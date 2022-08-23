import chalk from 'chalk'

// 计时日志
export const logTiming = (str: string = '', start: boolean = true) => {
  if (start) {
    console.time('Timing')
    console.log(chalk.cyan(`****** ${str} START ******`))
  } else {
    console.log(chalk.cyan(`****** ${str} END ******`))
    console.timeEnd('Timing')
  }
}

// 普通日志
export const logInfo = (str: string = '') => {
  console.log(chalk.green(`[INFO]： ${str}`))
}

// 警告日志
export const logWarring = (str: string = '') => {
  console.log(chalk.yellowBright(`[WARRING]： ${str}`))
}

// 成功日志
export const logSuccess = (str: string = '') => {
  console.log(chalk.greenBright(`[SUCCESS]： ${str}`))
}

// 报错日志
export const logError = (str: string | unknown = '') => {
  console.log(chalk.redBright(`[ERROR]： ${str}`))
}
