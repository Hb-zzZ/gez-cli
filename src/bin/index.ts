#!/usr/bin/env node

// 注册别名
import path from 'path'
import alias from 'module-alias'

alias(path.resolve(__dirname, '../../'))
import { Command } from 'commander'
const PACKAGE = require('../../package.json')

import internallyCommand from './internally'

interface ICommand {
  [propName: string]: { description: string; command: string; action: (value?: any) => void }
}

const program = new Command(PACKAGE.commandName)
program.version(PACKAGE.version)

const registerCommand = (commandMap: ICommand) => {
  Object.keys(commandMap).forEach((commandKey) => {
    const { description, command, action } = commandMap[commandKey]

    program
      .description(description)
      .command(command)
      .action((value: any) => {
        action(value)
      })
  })
}

const register = () => {
  registerCommand(internallyCommand)
}

register()

program.parse(process.argv)