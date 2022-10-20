import { updateTpl, loginGit } from '@/function/tpl'

const commands = {
  logingit: {
    description: '初始化工蜂账号',
    command: 'logingit',
    action: () => loginGit()
  },
  update: {
    description: '自动更新脚手架模版',
    command: 'update',
    action: () => updateTpl()
  }
}

export default commands
