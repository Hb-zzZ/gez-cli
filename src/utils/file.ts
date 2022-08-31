import fs from 'fs-extra'
import os from 'os'
import { logError, logInfo } from '@/utils/log'

// 定义存放文件夹
export const FILE_DIR: string = `${os.homedir()}/.gez`

interface IReadFile {
  path: string
  system?: boolean
}

interface IExistsFile {
  path: string
  system?: boolean
}

interface ICopySystemFile {
  path: string
  copyPath: string
  system?: boolean
}

interface IWriteFile {
  path: string
  file?: object
  system?: boolean
}

export const readFile = <T = {}>({ path = '', system = true }: IReadFile): T | false => {
  const rePath = system ? `${FILE_DIR}/${path}` : path

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
  const rePath = system ? `${FILE_DIR}/${path}` : path
  return fs.pathExistsSync(rePath)
}

export const copyFile = ({ path = '', copyPath = '', system = true }: ICopySystemFile) => {
  const rePath = system ? `${FILE_DIR}/${path}` : path
  return fs.copy(rePath, copyPath)
}

export const writeFile = ({ path = '', file, system = true }: IWriteFile) => {
  const rePath = system ? `${FILE_DIR}/${path}` : path
  try {
    fs.outputJsonSync(`${rePath}`, file)
  } catch (err) {
    logError(`写入错误: ${err}`)
  }
}
