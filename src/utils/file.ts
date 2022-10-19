import fs from 'fs-extra'
import os from 'os'
import nPath from 'path'
import { logError } from '@/utils/log'
import { eachFileFilterSync } from 'rd'
import myCache from '@/utils/cache'

// 定义存放文件夹
export const SYSTEM_FILE_DIR: string = `${os.homedir()}/.gez`

interface IReadFile {
  path: string
  system?: boolean
  cache?: boolean
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

export const readFile = <T = { [propName: string]: any }>({
  path = '',
  system = false,
  cache = true
}: IReadFile): T | false => {
  const rePath = system ? `${SYSTEM_FILE_DIR}/${path}` : path

  try {
    if (!fs.pathExistsSync(rePath)) {
      return false
    }
    const cacheFile: T | undefined = myCache.get(rePath)

    if (cache && cacheFile) {
      return cacheFile
    } else {
      const data = fs.readJsonSync(rePath)
      myCache.set(rePath, data)
      return data
    }
  } catch (err) {
    logError(`读取错误: ${rePath}`)
    return false
  }
}

export const removeFile = ({ path = '', system = false }: IRemoveFile) => {
  const rePath = system ? `${SYSTEM_FILE_DIR}/${path}` : path
  myCache.del(rePath)
  return fs.removeSync(rePath)
}

export const existsFile = ({ path = '', system = false }: IExistsFile) => {
  const rePath = system ? `${SYSTEM_FILE_DIR}/${path}` : path
  return fs.pathExistsSync(rePath)
}

export const copyFile = ({ path = '', copyPath = '', system = false }: ICopySystemFile) => {
  const rePath = system ? `${SYSTEM_FILE_DIR}/${path}` : path
  // 复制之前清除旧路径
  fs.removeSync(copyPath)
  myCache.del([rePath, copyPath])
  return fs.copySync(rePath, copyPath)
}

export const writeFile = ({ path = '', file, system = false }: IWriteFile) => {
  const rePath = system ? `${SYSTEM_FILE_DIR}/${path}` : path
  try {
    fs.outputJsonSync(`${rePath}`, file)
    myCache.del(rePath)
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
