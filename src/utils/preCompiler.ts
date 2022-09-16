import { logError } from './log'
import { walkFiles } from '@/utils/file'

export const preCompiler = async (path: string) => {
  try {
    const callback = (filePath: string, dirent: {}): Promise<void> => {
      return new Promise((resolve, reject) => {
        console.log('%cfilePath, dirent: ', 'color: MidnightBlue; background: #7c28ff; font-size: 16px;', filePath)
        resolve()
      })
    }

    await walkFiles({ path, callback })
  } catch (error) {
    logError(error)
  }
}
