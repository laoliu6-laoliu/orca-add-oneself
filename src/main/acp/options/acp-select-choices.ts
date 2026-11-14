import {
  SessionConfigSelectGroupSchema,
  SessionConfigSelectOptionSchema,
  type SessionConfigOption,
  type SessionConfigSelectOption
} from '../generated/acp-protocol.generated'

type SelectOption = Extract<SessionConfigOption, { type: 'select' }>

export function acpSelectChoices(
  option: SelectOption,
  groupLabel?: (name: string, group: string) => string
): SessionConfigSelectOption[] {
  const choices: SessionConfigSelectOption[] = []
  for (const entry of option.options) {
    const group = SessionConfigSelectGroupSchema.safeParse(entry)
    if (group.success) {
      const { name, options } = group.data
      choices.push(
        ...options.map((choice) =>
          groupLabel ? { ...choice, name: groupLabel(choice.name, name) } : choice
        )
      )
      continue
    }
    const choice = SessionConfigSelectOptionSchema.safeParse(entry)
    if (choice.success) {
      choices.push(choice.data)
    }
  }
  return choices
}
