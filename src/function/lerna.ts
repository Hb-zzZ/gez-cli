import { logError, logSuccess, logLoading } from '@/utils/log'
import { downloadGit } from '@/utils/git'
import { copyFile, readFile, existsFile, removeFile } from '@/utils/file'
import { prompt } from '@/utils/prompt'
import { getTpl, PACKAGES_PATH } from '@/config/tpl'
import { checkControl, checkTemplate } from '@/utils/tpl'
import { preCompiler } from '@/utils/preCompiler'

// 选择模板初始化或更新下载
export const createPkg = async () => {
  try {
    logLoading()
    const packageTpl = getTpl('packages')

    const { cachePath } = await downloadGit({
      downloadId: packageTpl.downloadId,
      path: PACKAGES_PATH,
      onlyCache: true
    })

    const packagesConfig = readFile({ path: `${cachePath}/.gez.json` })

    if (packagesConfig && Array.isArray(packagesConfig.packagesList) && packagesConfig.packagesList.length) {
      logLoading({ start: false, str: '获取配置成功' })
      const packagesList = packagesConfig.packagesList

      const response = await prompt([
        {
          type: 'text',
          name: 'outputName',
          message: '请输入输出目录名称'
        },
        {
          type: 'text',
          name: 'projectTitle',
          message: '请输入项目标题'
        },
        {
          type: 'select',
          name: 'packageName',
          message: '请选择要生成的应用包类型',
          choices: packagesConfig.packagesList
        }
      ])

      const { packageName, outputName: rOutputName, projectTitle } = response
      const outputName = rOutputName || packageName

      const packagePath = `${cachePath}/${packageName}`
      const createPath = `${PACKAGES_PATH}/${outputName}`

      let isCreate = true

      if (existsFile({ path: createPath, system: false })) {
        await prompt(
          [
            {
              type: 'confirm',
              name: 'isCreate',
              message: '当前有相同命名的package，确认是否直接覆盖？',
              initial: true
            }
          ],
          {
            onSubmit: (returnPrompt: {}, answer: boolean) => (isCreate = answer),
            onCancel: () => (isCreate = false)
          }
        )
      }

      if (isCreate) {
        const { template } = packagesList.find((item) => item.value === packageName)

        // 确保初始化control
        await checkControl()
        // 确保存在模版包
        await checkTemplate(template)

        removeFile({ path: createPath })
        // 将选择的pck从缓存中复制
        copyFile({ path: packagePath, copyPath: createPath })

        const compilerParams = { packageName: outputName, packageValue: packageName, projectTitle }

        await preCompiler(createPath, compilerParams)

        logSuccess(`创建包成功：\n-${createPath}`)
      }

      return response
    } else {
      logLoading({ start: false, str: '获取配置失败' })

      return false
    }
  } catch (error) {
    logLoading({ start: false })
    logError(error)
  }
}
