import { selectTpl } from '@/function/tpl'

const commands = {
  create: {
    description: '初始化脚手架模版',
    command: 'create',
    action: () => selectTpl()
  }
}

export default commands
