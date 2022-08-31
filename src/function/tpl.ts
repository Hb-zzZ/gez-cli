import { logError, logSuccess, logLoading } from '@/utils/log'
import { downloadGit } from '@/utils/git'
import { exec } from '@/utils/shell'
import { writeFile, readFile } from '@/utils/file'
import { checkControl } from '@/utils/tpl'
import { getTpl, ITpl } from '@/config/tpl'
import { prompt } from '@/utils/prompt'

//登录工蜂账号
export const loginGit = async () => {
  try {
    // 打开失败不影响输入
    try {
      await exec('start https://git.code.tencent.com/profile/account')
    } catch {
      logError(`打开浏览器失败，请手动登录工蜂(https://git.code.tencent.com/profile/account)`)
    }

    const onSubmit = async (prompt: {}, answer: { TOKEN: string }) => {
      try {
        writeFile({
          path: '.gitConfig',
          file: {
            TOKEN: answer
          }
        })

        logSuccess(`写入成功`)
      } catch {}
    }

    const response = await prompt(
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
        logLoading()
        const result = (await getTplList(answer)) as ITpl[] | undefined

        if (result) {
          checkControl(gitConfig.TOKEN)
            .then(() =>
              Promise.all(
                result.map(({ downloadId, name }) =>
                  downloadGit({ downloadId, TOKEN: gitConfig.TOKEN, path: `packages/${name}` })
                )
              )
            )
            .then(() => {
              logSuccess(`模版${result.map(({ name }) => name)}下载成功`)
            })
            .finally(() => logLoading({ start: false }))
        } else {
          logError(`获取模版错误`)
          logLoading({ start: false })
        }
      }

      const response = await prompt(
        [
          {
            type: 'multiselect',
            name: 'tplName',
            message: '请选择要拉取的模版',
            choices: [
              { title: 'element PC端', value: 'pc' },
              { title: 'vant 移动端', value: 'mobile' }
            ]
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
