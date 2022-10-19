import { logError } from './log'
import { removeFile, walkFiles } from '@/utils/file'
import { getDirPath } from '@/utils/path'
import { renderString } from '@/utils/index'
import nodePlop from 'node-plop'

const plop = nodePlop(getDirPath('../../plopfile.ts'))

export const preCompiler = (path: string, data: { [propName: string]: any }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hbsList: string[] = []

      const callback = (filePath: string): Promise<void> => {
        return new Promise((resolve) => {
          hbsList.push(filePath)
          resolve()
        })
      }

      await walkFiles({ path, callback })

      const templatePlop = plop.setGenerator('template-plop', {
        description: '生成模版',
        prompts: [],
        actions: hbsList.map((templatePath) => {
          const createPath = `${renderString(templatePath, data).replace(/\.hbs$/i, '')}`
          return {
            type: 'add',
            path: createPath,
            templateFile: templatePath
          }
        })
      })
      // 编译模版
      await templatePlop.runActions(data)
      // 删除模版
      hbsList.forEach((templatePath) => removeFile({ path: templatePath }))

      resolve(null)
    } catch (error) {
      logError(error)
      reject(error)
    }
  })
}
