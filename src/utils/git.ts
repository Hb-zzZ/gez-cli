import { getCwdPath } from '@/utils/path'
import { SYSTEM_FILE_DIR, writeFile, readFile, copyFile, existsFile, removeFile } from '@/utils/file'
import axios from 'axios'
import AdmZip from 'adm-zip'

export interface IGetCachePath {
  downloadId: string
  path: string
}

export interface IDownloadGIt {
  downloadId: string
  path: string
  // 仅缓存
  onlyCache?: boolean
}

export interface ICheckGit {
  downloadId: string
  cachePath: string
  TOKEN: string
}

export interface ILatestConfig {
  latestCommit: string
  cachePath?: string
}

export interface IDownloadGItConfig {
  [propName: string]: ILatestConfig
}

// 获取缓存路径
export const getCachePath = ({ downloadId, path }: IGetCachePath) => {
  return `${SYSTEM_FILE_DIR}/download/${downloadId}/${path}`
}

// 检测缓存中git仓库是否为最新
export const checkGit = async ({ downloadId, TOKEN, cachePath }: ICheckGit) => {
  return new Promise<{ downloadGitConfig: IDownloadGItConfig; lastConfig: ILatestConfig }>((resolve, reject) => {
    axios({
      url: `http://git.code.tencent.com/api/v3/projects/${downloadId}/repository/commits`,
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': TOKEN
      }
    })
      .then((res: { data: object }) => {
        const latestCommit = Array.isArray(res.data) && res.data[0] && res.data[0].id
        const downloadGitConfig: IDownloadGItConfig = readFile({ path: '.downloadGit', system: true }) || {}
        const lastConfig = downloadGitConfig && downloadGitConfig[downloadId]

        if (
          lastConfig &&
          lastConfig.latestCommit === latestCommit &&
          lastConfig.cachePath === cachePath &&
          existsFile({ path: cachePath })
        ) {
          // 缓存存在数据且最后commit、缓存路径与缓存一致，使用缓存
          resolve({ downloadGitConfig, lastConfig })

          return
        }

        resolve({
          downloadGitConfig,
          lastConfig: {
            latestCommit
          }
        })
      })
      .catch((error: string) => {
        reject(error)
      })
  })
}

// https://code.tencent.com/help/api/repository
export const downloadGit = ({ downloadId, path, onlyCache = false }: IDownloadGIt) => {
  return new Promise<{ cachePath: string; userPath: string }>((resolve, reject) => {
    const gitConfig: { TOKEN: string } | false = readFile({ path: '.gitConfig', system: true })
    const cachePath = getCachePath({ downloadId, path })

    if (gitConfig && gitConfig.TOKEN) {
      const TOKEN = gitConfig.TOKEN

      checkGit({ downloadId, TOKEN, cachePath })
        .then(({ downloadGitConfig, lastConfig }) => {
          const userPath = getCwdPath(`./${path}`)

          if (lastConfig.cachePath) {
            // 存在缓存且可用
            !onlyCache && copyFile({ path: cachePath, copyPath: userPath })

            resolve({ cachePath, userPath })
          } else {
            axios({
              url: `http://git.code.tencent.com/api/v3/projects/${downloadId}/repository/archive`,
              method: 'get',
              headers: {
                'PRIVATE-TOKEN': TOKEN
              },
              responseType: 'arraybuffer'
            })
              .then(async (res: { data: Buffer }) => {
                removeFile({ path: cachePath })
                const zip = new AdmZip(res.data)

                await zip.extractAllTo(cachePath, true)
                // 写入缓存记录，保留原有记录
                writeFile({
                  path: `.downloadGit`,
                  file: {
                    ...downloadGitConfig,
                    [downloadId]: {
                      ...lastConfig,
                      cachePath
                    }
                  },
                  system: true
                })

                !onlyCache && copyFile({ path: cachePath, copyPath: userPath })

                resolve({ cachePath, userPath })
              })
              .catch((error: string) => {
                reject(error)
              })
          }
        })
        .catch((error: string) => {
          reject(error)
        })
    } else {
      reject(`请先执行[logingit]进行登录`)
    }
  })
}
