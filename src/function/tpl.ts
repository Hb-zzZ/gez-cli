import { logError, logSuccess, logLoading } from '@/utils/log'
import { exec } from '@/utils/shell'
import { writeFile } from '@/utils/file'
import { updateAllTpl } from '@/utils/tpl'
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

    const onSubmit = async (prompt: {}, answer: string) => {
      try {
        writeFile({
          path: '.gitConfig',
          file: {
            TOKEN: answer
          },
          system: true
        })

        logSuccess(`写入成功，请确保私人令牌正确，如不正确请再次执行此命令`)
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

// 更新所有模板
export const updateTpl = async () => {
  try {
    await updateAllTpl()
  } catch (error) {
    logError(error)
  }
}
