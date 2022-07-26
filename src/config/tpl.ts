export interface ITpl {
  name: string
  desc: string
  downloadId: string
}

export interface ISYSTEM_TPL {
  [propName: string]: ITpl
}

const SYSTEM_TPL: ISYSTEM_TPL = {
  control: {
    name: 'control',
    downloadId: '223881',
    desc: 'gez-template控制器'
  },
  packages: {
    name: 'packages',
    downloadId: '224415',
    desc: 'packages应用包'
  },
  gezPc: {
    name: 'gezPc',
    downloadId: '222444',
    desc: 'pc端模版 element-ui vue@2.0'
  }
}

export const getTpl = (name: string): ITpl => {
  return SYSTEM_TPL[name]
}

export const PACKAGES_PATH = `packages`
