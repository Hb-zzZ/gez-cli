import { logError, logSuccess, logLoading } from '@/utils/log'
import { downloadGit, getCachePath } from '@/utils/git'
import { copyFile, readFile, existsFile, removeFile } from '@/utils/file'
import { prompt } from '@/utils/prompt'
import { getTpl } from '@/config/tpl'
import { preCompiler } from '@/utils/preCompiler'

const PACKAGES_PATH = `packages`

// 选择模板初始化或更新下载
export const createPkg = async () => {
  try {
    const gitConfig: { TOKEN: string } | false = readFile({ path: '.gitConfig' })

    if (gitConfig && gitConfig.TOKEN) {
      logLoading()
      const packageTpl = getTpl('packages')

      await downloadGit({
        downloadId: packageTpl.downloadId,
        TOKEN: gitConfig.TOKEN,
        path: PACKAGES_PATH,
        onlyCache: true
      })

      const packagesConfigPath = getCachePath({ downloadId: packageTpl.downloadId, path: `${PACKAGES_PATH}/.gez.json` })

      const packagesConfig = readFile({
        path: packagesConfigPath,
        system: false
      }) || { packagesList: null }

      if (Array.isArray(packagesConfig.packagesList) && packagesConfig.packagesList.length) {
        logLoading({ start: false, str: '获取配置成功' })

        const response = await prompt([
          {
            type: 'text',
            name: 'outputName',
            message: '请输入应用包名称'
          },
          {
            type: 'select',
            name: 'packageName',
            message: '请选择要生成的应用包类型',
            choices: packagesConfig.packagesList
          }
        ])

        const { packageName, outputName: rOutputName } = response
        const outputName = rOutputName || packageName

        const packagePath = `${getCachePath({ downloadId: packageTpl.downloadId, path: PACKAGES_PATH })}/${packageName}`
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
          removeFile({ path: createPath, system: false })
          // 将选择的pck从缓存中复制
          copyFile({ path: packagePath, copyPath: createPath, system: false })

          await preCompiler(createPath, { pkg: 'pkName', name: '测试' })

          logSuccess(`创建包成功：\n-${createPath}`)
        }

        return response
      } else {
        logLoading({ start: false, str: '获取配置失败' })

        return false
      }
    } else {
      logError(`请先执行[logingit]获取用户信息`)
    }
  } catch (error) {
    logError(error)
  }
}
