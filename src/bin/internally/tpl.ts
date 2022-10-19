import { createTpl, loginGit } from '@/function/tpl'

const commands = {
  logingit: {
    description: '初始化工蜂账号',
    command: 'logingit',
    action: () => loginGit()
  },
  create: {
    description: '初始化脚手架模版',
    command: 'create',
    action: () => createTpl()
  }
}

export default commands
