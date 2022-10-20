import { downloadGit } from '@/utils/git'
import { getTpl, ITpl, PACKAGES_PATH } from '@/config/tpl'
import { readFile, writeFile } from '@/utils/file'
import { logError, logLoading } from '@/utils/log'
import { prompt } from '@/utils/prompt'

type TTemplate = string

interface ITemplateList {
  name: string
  version: string
}

const configPath = '.gez.json'

// 获取当前项目控制器版本
const getControlVersion = () => {
  const config: { name: string; version: string } | false = readFile({ path: configPath, cache: false })

  if (config && config.name === 'control') {
    return config.version
  } else {
    return false
  }
}

// 获取当前内容模版版本
const getTemplateVersion = (template: TTemplate) => {
  const config: { templateList: ITemplateList[] } | false = readFile({ path: configPath, cache: false })

  if (config && Array.isArray(config.templateList) && config.templateList.length) {
    const templateAttrs = config.templateList.find(({ name }) => name === template)

    return templateAttrs && templateAttrs.version
  } else {
    return false
  }
}

// 写入template版本
const writeTemplateVersion = (template: TTemplate, templatePath: string) => {
  const packageJson: { version: string } | false = readFile({
    path: `${templatePath}/package.json`,
    cache: false
  })

  if (packageJson && packageJson.version) {
    const config: { templateList: ITemplateList[] } | false = readFile({ path: configPath, cache: false })

    if (config) {
      // 在项目配置写入最新的template版本号
      if (!Array.isArray(config.templateList)) {
        config.templateList = []
      }
      const templateIndex = config.templateList.findIndex(({ name }) => name === template)

      if (~templateIndex) {
        config.templateList.splice(templateIndex, 1)
      }

      config.templateList.push({ name: template, version: packageJson.version })

      writeFile({
        path: configPath,
        file: config
      })

      return packageJson.version
    } else {
      return false
    }
  } else {
    return false
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

// 检测外层模版
export const checkControl = (forceUpdate: boolean = false) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const version = getControlVersion()

      if (!forceUpdate && version) {
        resolve(version)
      } else {
        const controlTpl = getTpl('control')

        await downloadGit({ downloadId: controlTpl.downloadId, path: `` })

        const version = getControlVersion()

        if (version) {
          resolve(version)
        } else {
          reject(`获取ControlVersion失败`)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

// 检测内容模版
export const checkTemplate = (template: TTemplate, forceUpdate: boolean = false) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const version = getTemplateVersion(template)

      if (!forceUpdate && version) {
        resolve(version)
      } else {
        const templateTpl = getTpl(template)

        const { userPath } = await downloadGit({
          downloadId: templateTpl.downloadId,
          path: `${PACKAGES_PATH}/${template}`
        })

        const version = writeTemplateVersion(template, userPath)

        if (version) {
          resolve(version)
        } else {
          reject(`获取TemplateVersion失败`)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

// 更新所有模版（此操作只会进行覆盖操作，不会删除更新后缺少的文件，需要自行删除）
export const updateAllTpl = () => {
  return new Promise<string[]>(async (resolve, reject) => {
    try {
      const { isUpdate } = await prompt([
        {
          type: 'confirm',
          name: 'isUpdate',
          message: '是否确认更新所有应用模版？',
          initial: true
        }
      ])

      if (isUpdate) {
        // logLoading()
        let allTemplate: string[] = []

        const config: { templateList: ITemplateList[] } | false = readFile({ path: configPath, cache: false })

        if (config && Array.isArray(config.templateList) && config.templateList.length) {
          allTemplate = config.templateList.map(({ name }) => name)
        }

        // 先等待主模版更新后更新应用包，否则无法写入应用包信息
        await checkControl(true)

        await Promise.all(allTemplate.map((template) => checkTemplate(template, true)))

        logLoading({ start: false, str: '更新模版成功' })
        resolve(['control', ...allTemplate])
      } else {
        logLoading({ start: false })
        reject(`已取消`)
      }
    } catch (error) {
      logLoading({ start: false })
      reject(error)
    }
  })
}
