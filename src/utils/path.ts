import { resolve } from 'path'

// 项目本地路径
export const getDirPath = (relPath: string = '') => {
  return resolve(__dirname, relPath)
}

// 获取运行路径
export const getCwdPath = (relPath: string = '') => {
  return resolve(process.cwd(), relPath)
}
