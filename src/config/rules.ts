import type { RuleOptions } from '@fancy-crud/core'

export const ruleOptions: RuleOptions = {}

export function setRuleOptions(options: RuleOptions = {}) {
  Object.assign(ruleOptions, options)
}
