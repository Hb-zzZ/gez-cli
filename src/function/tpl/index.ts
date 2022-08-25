import { logError, logSuccess } from '@/utils/log'
import { downloadGit } from '@/utils/git'
import { writeFile, readFile } from '@/utils/file'
import { getTpl, ITpl } from '@/config/tpl'
import childProcess from 'child_process'
import prompts from 'prompts'

const commonInstructions: string = `

↑/↓: 选择
←/→/[空格]: 切换选择
a: 全选
回车: 确认

`

//登录工蜂账号
export const loginGit = async () => {
  try {
    childProcess.exec('start https://git.code.tencent.com/profile/account')

    const onSubmit = async (prompt: {}, answer: { TOKEN: string }) => {
      writeFile({
        path: '.gitConfig',
        file: {
          TOKEN: answer
        }
      })
    }

    const response = await prompts(
      [
        {
          type: 'password',
          name: 'TOKEN',
          message: '请登录工蜂，在此输入[账户-私人令牌]'
        }
      ],
      { onSubmit }
    )

    return response
  } catch (error) {
    logError(error)
  }
}

// 获取所有模版对应地址
export const getTplList = async (list: string[] = []): Promise<ITpl[] | undefined> => {
  try {
    return Promise.all(list.map((name) => getTpl(name)))
  } catch (error) {
    logError(error)
  }
}

// 选择模板初始化或更新下载
export const selectTpl = async () => {
  try {
    const gitConfig: { TOKEN: string } | false = readFile({ path: '.gitConfig' })

    if (gitConfig && gitConfig.TOKEN) {
      const onSubmit = async (prompt: {}, answer: []) => {
        const result = (await getTplList(answer)) as ITpl[] | undefined

        if (result) {
          Promise.all(
            result.map(({ downloadId, name }) => downloadGit({ downloadId, TOKEN: gitConfig.TOKEN, path: name }))
          ).then(() => {
            logSuccess(`模版${result.map(({ name }) => name)}下载成功`)
          })
        } else {
          logError(`获取模版错误`)
        }
      }

      const response = await prompts(
        [
          {
            type: 'multiselect',
            name: 'tplName',
            message: '请选择要拉取的模版',
            choices: [
              { title: 'element PC端', value: 'pc' },
              { title: 'vant 移动端', value: 'mobile' }
            ],
            instructions: commonInstructions
          }
        ],
        { onSubmit }
      )

      return response
    } else {
      logError(`请先执行[loginGit]获取用户信息`)
    }
  } catch (error) {
    logError(error)
  }
}
