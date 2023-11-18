import { FocusEvent, KeyboardEvent, memo, useCallback, useMemo } from 'react'
import { css } from '@fower/react'
import { Editor } from 'slate'
import { Editable, RenderElementProps } from 'slate-react'
import { onKeyDownAutoformat } from '@penx/autoformat'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { Leaf } from '@penx/editor-leaf'
import { useExtensionStore } from '@penx/hooks'
import { useDecorate } from '../hooks/useDecorate'
import { useOnCompositionEvent } from '../hooks/useOnCompositionEvent'
import { useOnDOMBeforeInput } from '../hooks/useOnDOMBeforeInput'
import { ElementContent } from './ElementContent'

interface Props {
  onBlur?: (editor: Editor) => void
}

export const NodeEditorEditable = memo(
  function NodeEditorEditable({ onBlur }: Props) {
    // const editor = useEditor()
    const editor = useEditorStatic()
    const { extensionStore } = useExtensionStore()
    const decorate = useDecorate(editor)
    const onDOMBeforeInput = useOnDOMBeforeInput(editor)
    const onOnCompositionEvent = useOnCompositionEvent(editor)

    const renderElement = useCallback((props: RenderElementProps) => {
      const attr = {
        ...props.attributes,
        // 'data-slate-type': element.type,
      }

      return <ElementContent {...props} attributes={attr} />
    }, [])

    const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // form auto format
      onKeyDownAutoformat(
        editor as any,
        {
          options: { rules: extensionStore.rules },
        } as any,
      )(e)

      for (const fn of editor.onKeyDownFns) {
        fn(editor, e)
      }
    }

    const blur = (e: FocusEvent<HTMLDivElement, globalThis.Element>) => {
      onBlur?.(editor)
      for (const fn of editor.onBlurFns) {
        fn(editor, e)
      }
    }

    return (
      <Editable
        className={css('black mt4 outlineNone')}
        renderLeaf={(props) => <Leaf {...props} />}
        renderElement={renderElement}
        decorate={decorate as any} //
        onCompositionUpdate={onOnCompositionEvent}
        onCompositionEnd={onOnCompositionEvent}
        onKeyDown={keyDown}
        onDOMBeforeInput={onDOMBeforeInput}
        onBlur={blur}
      />
    )
  },
  (prev, next) => {
    return prev.onBlur === next.onBlur
  },
)
