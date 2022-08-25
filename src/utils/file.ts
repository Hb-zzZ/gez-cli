import fs from 'fs-extra'
import os from 'os'
import { logError, logSuccess, logInfo } from '@/utils/log'

// 定义存放文件夹
export const FILE_DIR: string = '.gez'

interface IReadFile {
  path: string
  system?: boolean
}

interface IExistsFile {
  path: string
  system?: boolean
}

interface IWriteFile {
  path: string
  file?: object
  system?: boolean
}

export const readFile = <T = {}>({ path = '', system = true }: IReadFile): T | false => {
  const rePath = system ? `${os.homedir()}/${FILE_DIR}/${path}` : path

  try {
    if (!fs.pathExistsSync(rePath)) {
      return false
    }
    const data = fs.readJsonSync(rePath)
    return data
  } catch (err) {
    logError(`读取错误: ${rePath}`)
    return false
  }
}

export const existsFile = ({ path = '', system = true }: IExistsFile) => {
  const rePath = system ? `${os.homedir()}/${FILE_DIR}/${path}` : path
  return fs.pathExistsSync(rePath)
}

export const writeFile = ({ path = '', file, system = true }: IWriteFile) => {
  const rePath = system ? `${os.homedir()}/${FILE_DIR}/${path}` : path
  logInfo(rePath)
  try {
    fs.outputJsonSync(`${rePath}`, file)
  } catch (err) {
    logError(`写入错误: ${err}`)
  }
}
