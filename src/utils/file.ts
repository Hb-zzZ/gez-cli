import fs from 'fs-extra'
import os from 'os'
import nPath from 'path'
import { logError } from '@/utils/log'
import { eachFileFilterSync } from 'rd'

// 定义存放文件夹
export const FILE_DIR: string = `${os.homedir()}/.gez`

interface IReadFile {
  path: string
  system?: boolean
}

interface IRemoveFile {
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

export interface IWalkFiles {
  path: string
  callback: (filePath: string, dirent: { [propName: string]: any }) => Promise<void>
}

export const readFile = <T = { [propName: string]: any }>({ path = '', system = true }: IReadFile): T | false => {
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

export const removeFile = ({ path = '', system = true }: IRemoveFile) => {
  const rePath = system ? `${FILE_DIR}/${path}` : path
  return fs.removeSync(rePath)
}

export const existsFile = ({ path = '', system = true }: IExistsFile) => {
  const rePath = system ? `${FILE_DIR}/${path}` : path
  return fs.pathExistsSync(rePath)
}

export const copyFile = ({ path = '', copyPath = '', system = true }: ICopySystemFile) => {
  const rePath = system ? `${FILE_DIR}/${path}` : path
  // 复制之前清除旧路径
  fs.removeSync(copyPath)
  return fs.copySync(rePath, copyPath)
}

export const writeFile = ({ path = '', file, system = true }: IWriteFile) => {
  const rePath = system ? `${FILE_DIR}/${path}` : path
  try {
    fs.outputJsonSync(`${rePath}`, file)
  } catch (err) {
    logError(`写入错误: ${err}`)
  }
}

// 遍历文件夹
export const walkFiles = ({ path, callback }: IWalkFiles) => {
  return new Promise((resolve, reject) => {
    try {
      const allWalk: Promise<void>[] = []

      eachFileFilterSync(nPath.resolve(path), /\.hbs$/, function (f, s) {
        allWalk.push(Promise.resolve(callback(f, s)))
      })

      Promise.all(allWalk)
        .then(() => resolve(null))
        .catch((err) => reject(err))
    } catch (error) {
      logError(error)
      reject(error)
    }
  })
}
