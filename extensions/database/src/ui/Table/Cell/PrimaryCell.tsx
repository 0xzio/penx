import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { Box, css } from '@fower/react'
import { createEditor, Editor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { TElement, useEditor } from '@penx/editor-common'
import { Leaf } from '@penx/editor-leaf'
import { getNodeById } from '@penx/editor-queries'
import { clearEditor } from '@penx/editor-transforms'
import { db, emitter } from '@penx/local-db'
import { Paragraph } from '@penx/paragraph'
import { Tag } from '@penx/tag'
import { CellProps } from './CellProps'

function withCell(editor: Editor) {
  const { isInline, isVoid } = editor

  editor.isInline = (element: any) => {
    return ['tag'].includes(element.type) ? true : isInline(element)
  }

  editor.isVoid = (element: any) => {
    return ['tag'].includes(element.type) ? true : isVoid(element)
  }

  return editor
}

export const PrimaryCell: FC<CellProps> = memo(function PrimaryCell(props) {
  const { cell, updateCell } = props
  const [value, setValue] = useState<any>(null)
  const editorRef = useRef(withCell(withReact(withHistory(createEditor()))))

  const parentEditor = useEditor()

  const nodeId = cell.props.ref

  useEffect(() => {
    db.getNode(nodeId).then((node) => {
      if (!node) {
        return setValue([])
      }
      if (!isEqual(editorRef.current.children[0], node.element)) {
        setValue([node.element])
      }
    })
  }, [nodeId])

  useEffect(() => {
    emitter.on('REF_NODE_UPDATED', (node) => {
      if (node.id === nodeId) {
        if (isEqual(editorRef.current.children[0], node.element)) return
        clearEditor(editorRef.current)
        Transforms.insertNodes(editorRef.current, [node.element])
      }
    })
    return () => emitter.off('REF_NODE_UPDATED')
  }, [nodeId])

  const renderElement = useCallback((props: RenderElementProps) => {
    const element = props.element as TElement
    if (element.type === 'p') {
      return <Paragraph {...props} />
    }

    if (element.type === 'tag') {
      return <Tag {...(props as any)} />
    }

    return <div {...props}>{props.children}</div>
  }, [])

  function updateParentEditor(element: any) {
    const entry = getNodeById(parentEditor, element.id)
    if (!entry) return

    const [node, path] = entry

    if (!isEqual(node, element)) return

    Transforms.removeNodes(parentEditor, { at: path })
    Transforms.insertNodes(parentEditor, element, {
      at: path,
      select: true,
    })
  }

  if (!value) return null

  return (
    <Box w-100p h-100p relative inlineFlex>
      <Slate
        editor={editorRef.current as any}
        initialValue={value}
        onChange={async (value) => {
          const element: any = value[0]
          db.updateNode(nodeId, { element })
          updateParentEditor(element)
        }}
      >
        {/* <HoveringToolbar /> */}
        <Editable
          className={css('black p2 outlineNone h-100p w-100p')}
          renderLeaf={(props) => <Leaf {...props} />}
          renderElement={renderElement}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
        />
      </Slate>
    </Box>
  )
})
