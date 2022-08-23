export interface ITpl {
  name: string
  desc: string
  downloadUrl: string
}

export interface ISYSTEM_TPL {
  [propName: string]: ITpl
}

const SYSTEM_TPL: ISYSTEM_TPL = {
  pc: {
    name: 'pc',
    downloadUrl: 'https://git.code.tencent.com/Hb-zzZ/gez-template-pc',
    desc: 'pc端模版 element-ui vue@2.0'
  }
}

export const getTpl = (name: string): ITpl => {
  return SYSTEM_TPL[name]
}
