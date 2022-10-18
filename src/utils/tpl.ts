import { downloadGit } from '@/utils/git'
import { getTpl } from '@/config/tpl'
import { readFile } from '@/utils/file'

export const checkControl = (TOKEN: string) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const controlConfig: { name: string; version: string } | false = readFile({ path: '.gez.json', system: false })

      if (controlConfig && controlConfig.name === 'control') {
        resolve(controlConfig.version)
      } else {
        const controlTpl = getTpl('control')

        await downloadGit({ downloadId: controlTpl.downloadId, TOKEN, path: `` })
        resolve(controlTpl.name)
      }
    } catch (error) {
      reject(error)
    }
  })
}
