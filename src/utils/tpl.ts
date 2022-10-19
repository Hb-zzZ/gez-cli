import { downloadGit } from '@/utils/git'
import { getTpl } from '@/config/tpl'
import { readFile } from '@/utils/file'

interface IControl {
  version: string
  lastVersion: string
}

export const checkControl = () => {
  return new Promise<IControl>(async (resolve, reject) => {
    try {
      const getConfig = () => {
        const config: { name: string; version: string } | false = readFile({ path: '.gez.json', cache: false })

        if (config && config.name === 'control') {
          return {
            version: config.version,
            lastVersion: config.version
          }
        } else {
          return false
        }
      }

      const config = getConfig()

      if (config) {
        resolve(config)
      } else {
        const controlTpl = getTpl('control')

        await downloadGit({ downloadId: controlTpl.downloadId, path: `` })

        const config = getConfig()
        
        if (config) {
          resolve(config)
        } else {
          reject(`获取ControlConfig失败`)
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error))
      reject(error)
    }
  })
}
