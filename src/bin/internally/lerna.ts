import { exec } from '@/utils/shell'
import { TOption } from '@/bin/index'
import { createPkg } from '@/function/lerna'

const commands = {
  install: {
    description: '仓库安装所有第三方依赖包',
    command: 'install',
    action: () => exec(`lerna bootstrap`)
  },
  add: {
    description: '仓库添加第三方依赖包',
    command: 'add <name>',
    option: [['-D, --dev', '添加到开发包', false] as TOption],
    action: (name: string, option: { dev: boolean }) => {
      if (option.dev) {
        exec(`lerna add ${name} --dev`)
      } else {
        exec(`lerna add ${name}`)
      }
    }
  },
  createpkg: {
    description: '仓库创建package应用包',
    command: 'createpkg',
    action: () => createPkg()
  }
}

export default commands
