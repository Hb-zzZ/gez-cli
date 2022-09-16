import kleur from 'kleur'
import ora from 'ora'

const spinner = ora({
  color: 'magenta',
  spinner: {
    interval: 45,
    frames: [
      '██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁',
      '▁██████▁▁▁▁▁▁▁▁▁▁▁▁▁',
      '▁▁██████▁▁▁▁▁▁▁▁▁▁▁▁',
      '▁▁▁██████▁▁▁▁▁▁▁▁▁▁▁',
      '▁▁▁▁██████▁▁▁▁▁▁▁▁▁▁',
      '▁▁▁▁▁██████▁▁▁▁▁▁▁▁▁',
      '▁▁▁▁▁▁██████▁▁▁▁▁▁▁▁',
      '▁▁▁▁▁▁▁██████▁▁▁▁▁▁▁',
      '▁▁▁▁▁▁▁▁██████▁▁▁▁▁▁',
      '▁▁▁▁▁▁▁▁▁██████▁▁▁▁▁',
      '▁▁▁▁▁▁▁▁▁▁██████▁▁▁▁',
      '▁▁▁▁▁▁▁▁▁▁▁██████▁▁▁',
      '▁▁▁▁▁▁▁▁▁▁▁▁██████▁▁',
      '▁▁▁▁▁▁▁▁▁▁▁▁▁██████▁',
      '▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████',
      '█▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████',
      '██▁▁▁▁▁▁▁▁▁▁▁▁▁▁████',
      '███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███',
      '████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██',
      '█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█'
    ]
  }
})

let spinnerLoading = false

const logFn = (type: string, str: string | unknown) => {
  const logFilter: {
    [propName: string]: Function
  } = {
    info: getLogInfo,
    warning: getLogWarring,
    success: getLogSuccess,
    error: getLogError
  }

  const getLogFn = logFilter[type]

  if (spinnerLoading) {
    spinner.text += getLogFn(str)
  } else {
    // 没有loading，正常输出
    console.log(getLogFn(str))
  }
}

// loading动画（搭配下面log系列使用）
export const logLoading = ({
  start = true,
  str = ''
}: {
  // 是否开启loading
  start?: boolean
  str?: string
} = {}) => {
  if (start) {
    spinnerLoading = true
    spinner.text = '\n\n' + kleur.cyan(str)
    spinner.start()
  } else {
    spinnerLoading = false
    // 删除一个回车符，保持高度一致
    spinner.text = spinner.text.slice(1)
    spinner.stopAndPersist({
      text: str ? `\n${kleur.magenta(str)}\n` : str,
      prefixText: kleur.magenta(`******  DONE ******`) + `\n`
    })
    spinner.text = ''
  }
}

// 普通日志
export const logInfo = (str: string = '') => {
  logFn('info', str)
}

// 警告日志
export const logWarring = (str: string = '') => {
  logFn('warning', str)
}

// 成功日志
export const logSuccess = (str: string = '') => {
  logFn('success', str)
}

// 报错日志
export const logError = (str: string | unknown = '') => {
  logFn('error', str)
}

// 普通日志
export const getLogInfo = (str: string = '') => {
  return kleur.cyan(`[INFO]： ${str}`)
}

// 警告日志
export const getLogWarring = (str: string = '') => {
  return kleur.yellow(`[WARRING]： ${str}`)
}

// 成功日志
export const getLogSuccess = (str: string = '') => {
  return kleur.green(`[SUCCESS]： ${str}`)
}

// 报错日志
export const getLogError = (str: string | unknown = '') => {
  return kleur.red(`[ERROR]： ${str}`)
}

// 计时日志
export const logTiming = ({
  start = true,
  str = ''
}: {
  start?: boolean
  str?: string
} = {}) => {
  if (start) {
    console.time('Timing')
    console.log(kleur.magenta(`****** ${str} START ******`))
  } else {
    console.log(kleur.magenta(`****** ${str} END ******`))
    console.timeEnd('Timing')
  }
}
