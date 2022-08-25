import { selectTpl, loginGit } from '@/function/tpl'

const commands = {
  create: {
    description: '初始化脚手架模版',
    command: 'create',
    action: () => selectTpl()
  },
  loginGit: {
    description: '初始化工蜂账号',
    command: 'loginGit',
    action: () => loginGit()
  }
}

export default commands
