import { logInfo } from '@/utils/log'

const PACKAGE = require('../../package.json')

export const checkVersion = async () => {
  logInfo(`当前版本${PACKAGE.version}为最新版本。`)
}
