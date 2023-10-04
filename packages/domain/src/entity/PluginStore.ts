import type { AutoformatRule } from '@udecode/plate-autoformat'
import { Editor } from 'slate'
import { BlockElement, OnKeyDown } from '@penx/plugin-typings'
import { PluginStore as PluginStoreJSON } from '@penx/store'

export class PluginStore {
  rules: AutoformatRule[] = []

  withFns: ((editor: Editor) => Editor)[] = []

  elementMaps: Record<string, BlockElement> = {}
  onKeyDownFns: OnKeyDown[] = []

  inlineTypes: string[] = []
  voidTypes: string[] = []

  constructor(private store: PluginStoreJSON) {
    this.init()
  }

  private init() {
    // builtin plugins
    const {
      store,
      withFns,
      rules,
      elementMaps,
      onKeyDownFns,
      inlineTypes,
      voidTypes,
    } = this

    // penx plugins
    for (const name of Object.keys(store)) {
      const plugin = store[name]
      if (!plugin.block) continue
      const { elements = [] } = plugin.block
      if (plugin.block?.with) withFns.push(plugin.block.with)

      if (plugin.block.handlers?.onKeyDown) {
        onKeyDownFns.push(plugin.block.handlers.onKeyDown)
      }

      if (plugin.block.autoformatRules) {
        this.rules = [...this.rules, ...plugin.block.autoformatRules]
      }

      for (const ele of elements) {
        // get inline types
        if (isBooleanTrue(ele.isInline)) inlineTypes.push(ele.type)

        // get void types
        if (isBooleanTrue(ele.isVoid)) voidTypes.push(ele.type)

        // set element maps
        elementMaps[ele.type] = ele
      }
    }

    return { withFns, rules }
  }
}

function isBooleanTrue(value: any): value is true {
  return typeof value === 'boolean' && value === true
}
