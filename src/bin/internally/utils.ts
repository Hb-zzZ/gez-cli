import { checkVersion } from '@/utils/npm'
import { exec } from '@/utils/shell'

const commands = {
  check: {
    description: '检测cli版本',
    command: 'check',
    action: () => checkVersion()
  },
  gitcommit: {
    description: 'git规范提交',
    command: 'gitcommit',
    action: async () => {
      try {
        await exec(`git cz`)
      } catch {}
    }
  }
}

export default commands
