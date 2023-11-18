import { CaseSensitive } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { getEmptyParagraph } from './getEmptyParagraph'
import { insertEmptyParagraph } from './insertEmptyParagraph'
import { Paragraph } from './Paragraph'
import { ELEMENT_P } from './types'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    elements: [
      {
        type: ELEMENT_P,
        component: Paragraph,
        // placeholder: "Type '/' to browse options",
        placeholder: '',
        // slashCommand: {
        //   name: 'Text',
        //   icon: CaseSensitive,
        // },
      },
    ],
  })
}

export * from './types'
export * from './isParagraph'

export { Paragraph, insertEmptyParagraph, getEmptyParagraph }
