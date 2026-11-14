import { expect, it } from 'vitest'
import { acpSelectChoices } from './acp-select-choices'

it('keeps model providers visible when the model list contains groups', () => {
  const option = {
    id: 'model',
    name: 'Model',
    type: 'select' as const,
    currentValue: 'flash',
    options: [
      { name: 'DeepSeek Account', group: 'account', options: [{ value: 'flash', name: 'Flash' }] },
      { name: 'Local', group: 'local', options: [{ value: 'local', name: 'Local' }] }
    ]
  }

  expect(acpSelectChoices(option, (name, group) => `${name} · ${group}`)).toEqual([
    { value: 'flash', name: 'Flash · DeepSeek Account' },
    { value: 'local', name: 'Local · Local' }
  ])
  expect(acpSelectChoices(option)[0].name).toBe('Flash')
})
