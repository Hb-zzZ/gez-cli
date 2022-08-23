import { checkVersion } from '@/utils/npm'

const commands = {
  check: {
    description: '检测cli版本',
    command: 'check',
    action: () => checkVersion()
  }
}

export default commands
