import shelljs from 'shelljs'
import { logError, logInfo, logLoading } from '@/utils/log'

// 执行语句
export const exec = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = shelljs.exec(command, { silent: true, async: true })
    let errorStr: string = ''
    logLoading()

    child.stdout &&
      child.stdout.on('data', function (str) {
        logInfo(str)
      })

    child.stderr &&
      child.stderr.on('data', function (str) {
        str && (errorStr += str)
      })

    child.on('exit', (code) => {
      if (code !== 0) {
        logError(errorStr)
        logLoading({ start: false })

        reject(errorStr)
      } else {
        logLoading({ start: false })
        resolve()
      }
    })
  })
}
