import fs from 'fs-extra'
import os from 'os'
import { logError, logSuccess, logInfo } from '@/utils/log'

// 定义存放文件夹
export const CACHE_DIR: string = 'GEZ_CACHE'

interface ILoadFile {
  path: string
  system?: boolean
}

interface IExistsFile {
  path: string
  system?: boolean
}

interface IWriteFile {
  path: string
  file?: string
  system?: boolean
}

export const loadFile = <T = {}>({ path = '', system = true }: ILoadFile): T | false | undefined => {
  const rePath = system ? `${os.homedir()}/${CACHE_DIR}/${path}` : path

  try {
    if (!fs.pathExistsSync(rePath)) {
      return false
    }
    const data = fs.readJsonSync(rePath)
    return data
  } catch (err) {
    logError(`读取错误: ${rePath}`)
  }
}

export const existsFile = ({ path = '', system = true }: IExistsFile) => {
  const rePath = system ? `${os.homedir()}/${CACHE_DIR}/${path}` : path
  return fs.pathExistsSync(rePath)
}

export const writeFile = ({ path = '', file, system = true }: IWriteFile) => {
  const rePath = system ? `${os.homedir()}/${CACHE_DIR}/${path}` : path
  logInfo(rePath)
  try {
    fs.outputJsonSync(`${rePath}`, file)
    logSuccess(`写入文件成功`)
  } catch (err) {
    logError(`写入错误: ${err}`)
  }
}
