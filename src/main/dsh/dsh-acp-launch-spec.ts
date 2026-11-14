import { join } from 'node:path'
import { directoryAccountBinding } from '../acp/launch/acp-account-binding'
import type { AcpLaunchSpec } from '../acp/launch/acp-launch-contract'

export const DSH_ACP_LAUNCH_SPEC: AcpLaunchSpec = {
  agent: 'dsh',
  command: 'dsh',
  ignoreAgentCommandSetting: true,
  args: () => ['--profile', 'acp'],
  env: {},
  dialect: {
    configModelLabel: (name, group) => `${name} · ${group}`
  },
  loginCommand: [],
  account: directoryAccountBinding('DSH_HOME', (homePath) => join(homePath, '.dsh')),
  installDirectories: ({ env, homePath }) => {
    if (process.platform !== 'win32') {
      return [join(homePath, '.local', 'bin')]
    }
    const localAppData = env.LOCALAPPDATA || join(homePath, 'AppData', 'Local')
    return [
      join(localAppData, 'Programs', 'DeepSeek Harness', 'resources', 'runtime', 'cli', 'bin')
    ]
  },
  modelDiscovery: {
    kind: 'unavailable',
    reason: 'DeepSeek Harness lists models after the chat session starts'
  },
  transcriptImport: null,
  sessionHistory: {
    rowAgents: [],
    rowSessionId: (link) => link.handle.nativeId,
    parseResumeArgs: () => null
  },
  resumePreference: 'resume'
}
