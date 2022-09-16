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
  hint?: string,
  initial?: boolean
}

type TOnSubmit = (prompt: { [propName: string]: any }, answer: any, answers: any[]) => void
type TOnCancel = () => void

interface IOptions {
  onSubmit?: TOnSubmit
  onCancel?: TOnCancel
}

export const prompt = (questions: IQuestions[], options?: IOptions) => {
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
    }

    if (question.type === 'select') {
      // 添加自定义详细说明
      question.hint = `

${kleur.cyan(
  question.hint ||
    `↑/↓: 选择
回车: 确认`
)}
            
            `
    }
  })

  return prompts(questions, options)
}
