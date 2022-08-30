import { exec } from '@/utils/shell'
import { TOption } from '@/bin/index'

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
    command: 'createpkg <name>',
    option: [
      ['--description <value>', '描述内容', `package应用包`] as TOption,
      ['--keywords <value>', '关键词', `repo`] as TOption,
      ['--license <value>', '许可证', `MIT`] as TOption
    ],
    action: (
      name: string,
      option: {
        description: string
        keywords: string
        license: string
        [propName: string]: string
      }
    ) => {
      const optionStr = Object.keys(option)
        .filter((key) => option[key])
        .map((key) => `--${key} ${option[key]}`)
        .join(' ')

      exec(`lerna create ${name} ${optionStr} --private --yes`)
    }
  }
}

export default commands
