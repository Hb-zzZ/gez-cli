#!/usr/bin/env node

// 注册别名
import path from 'path'
import alias from 'module-alias'

alias(path.resolve(__dirname, '../../'))

import { getLogInfo, getLogWarring, logError } from '@/utils/log'
import { Command } from 'commander'
const PACKAGE = require('../../package.json')

import internallyCommand from './internally'

type defaultValue = string | boolean | string[]
export type TOption = [string, string?, defaultValue?]

interface ICommand {
  [propName: string]: {
    description: string
    command: string
    action: (...args: any[]) => void
    option?: TOption[]
  }
}

const program = new Command(PACKAGE.commandName)
program.version(PACKAGE.version)

const registerCommand = (commandMap: ICommand) => {
  Object.keys(commandMap).forEach((commandKey) => {
    const { description, command, action, option } = commandMap[commandKey]

    const tmpProgram = program
      .command(command)
      .description(description)
      .action((...args) => action(...args))

    if (option) {
      option.forEach((params) => tmpProgram.option(...(params as TOption)))
    }
  })
}

program.configureOutput({
  // 此处使输出变得容易区分
  writeOut: (str) => process.stdout.write(getLogInfo(str)),
  writeErr: (str) => process.stdout.write(getLogWarring(str)),
  // 将错误高亮显示
  outputError: (str) => logError(str)
})

const register = () => {
  registerCommand(internallyCommand)
}

register()

program.parse(process.argv)
