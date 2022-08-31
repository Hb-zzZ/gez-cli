import { logError, logSuccess } from '@/utils/log'
import { downloadGit } from '@/utils/git'
import { writeFile, readFile } from '@/utils/file'
import { prompt } from '@/utils/prompt'

// 选择模板初始化或更新下载
export const createPkg = async () => {
  try {
    const gitConfig: { TOKEN: string } | false = readFile({ path: '.gitConfig' })

    if (gitConfig && gitConfig.TOKEN) {
      // const onSubmit = async (prompt: {}, answer: []) => {
      //   await downloadGit({ downloadId: controlTpl.downloadId, TOKEN, path: `` })
      // }

      // const response = await prompt(
      //   [
      //     {
      //       type: 'multiselect',
      //       name: 'tplName',
      //       message: '请选择要生成的应用包类型',
      //       choices: [
      //         { title: 'PC', value: 'pc' },
      //         { title: '移动端', value: 'mobile' }
      //       ]
      //     }
      //   ],
      //   { onSubmit }
      // )

      // return response
    } else {
      logError(`请先执行[loginGit]获取用户信息`)
    }
  } catch (error) {
    logError(error)
  }
}
