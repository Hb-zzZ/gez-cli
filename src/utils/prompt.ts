import prompts from 'prompts'
import kleur from 'kleur'

type TChoices = {
  title: string
  value: string
}

interface IQuestions {
  type:
    | 'text'
    | 'password'
    | 'invisible'
    | 'number'
    | 'confirm'
    | 'list'
    | 'toggle'
    | 'select'
    | 'multiselect'
    | 'autocomplete'
    | 'date'
    | 'autocompleteMultiselect'
  name: string
  message: string
  choices?: TChoices[]
  instructions?: string
  hint?: string
  initial?: boolean
  validate?: (val: string) => boolean | string
  min?: number
}

type TOnSubmit = (prompt: { [propName: string]: any }, answer: any, answers: any[]) => void
type TOnCancel = () => void

interface IOptions {
  onSubmit?: TOnSubmit
  onCancel?: TOnCancel
}

export const prompt = (questions: IQuestions[], options?: IOptions) => {
  return new Promise<{ [propName: string]: any }>((resolve, reject) => {
    // 处理字体颜色
    questions.forEach((question) => {
      if (question.message) {
        question.message = kleur.magenta().bold(question.message)
      }

      if (question.type === 'multiselect') {
        // 添加自定义详细说明
        question.instructions = `

${kleur.cyan(
  question.instructions ||
    `↑/↓: 选择
←/→/[空格]: 切换选择
a: 全选
回车: 确认`
)}
            
            `

        question.min = 1
      } else if (question.type === 'select') {
        // 添加自定义详细说明
        question.hint = `

${kleur.cyan(
  question.hint ||
    `↑/↓: 选择
回车: 确认`
)}
            
            `
      } else if (question.type === 'text') {
        // 必填
        question.validate = (text) => (text ? true : question.message)
      }
    })

    let successP: { [propName: string]: any } = {}
    // 等待全部输入完毕才resolve
    const checkSuccess = (result: { [propName: string]: any }) => {
      successP = {
        ...successP,
        ...result
      }

      if (Object.keys(successP).length === questions.length) {
        resolve(successP)
      }
    }

    prompts(questions, {
      onSubmit: (...reset) => {
        checkSuccess(reset[2])
        options && options.onSubmit && options.onSubmit(...reset)
      },
      onCancel: () => {
        reject(`已取消`)
        options && options.onCancel && options.onCancel()
      }
    })
  })
}
