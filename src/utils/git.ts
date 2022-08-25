import { getCwdPath } from '@/utils/path'
import axios from 'axios'
import AdmZip from 'adm-zip'

export interface IDownloadGIt {
  downloadId: string
  path: string
  TOKEN: string
}

// https://code.tencent.com/help/api/repository
export const downloadGit = ({ downloadId, TOKEN, path }: IDownloadGIt) => {
  return new Promise<string>((resolve, reject) => {
    axios({
      url: `http://git.code.tencent.com/api/v3/projects/${downloadId}/repository/archive`,
      method: 'get',
      headers: {
        'PRIVATE-TOKEN': TOKEN
      },
      responseType: 'arraybuffer'
    })
      .then((res: { data: Buffer }) => {
        const zip = new AdmZip(res.data)

        zip.extractAllTo(getCwdPath(`./${path}`), true)
        resolve(path)
      })
      .catch((error: string) => {
        reject(error)
      })
  })
}
