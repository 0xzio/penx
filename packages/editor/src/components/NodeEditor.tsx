import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Descendant, Editor, Path, Transforms } from 'slate'
import { Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { SetNodeToDecorations } from '@penx/code-block'
import { getProjection } from '@penx/dnd-projection'
import { getNodeByPath } from '@penx/editor-queries'
import { useNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { useCreateEditor } from '../hooks/useCreateEditor'
import ClickablePadding from './ClickablePadding'
import { DragOverlayPreview } from './DragOverlayPreview'
import { editorValueToNode } from './editorValueToNode'
import HoveringToolbar from './HoveringToolbar/HoveringToolbar'
import { NodeEditorEditable } from './NodeEditorEditable'
import { ProtectionProvider } from './ProtectionProvider'

interface Props {
  content: any[]
  node: Node
  editableProps?: EditableProps
  plugins: ((editor: Editor) => Editor)[]
  onChange?: (value: Descendant[], editor: Editor) => void
  onBlur?: (editor: Editor) => void
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ]
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    })
  },
}

export type UniqueIdentifier = string

export function NodeEditor({
  content,
  node,
  onChange,
  onBlur,
  plugins,
}: Props) {
  const { nodeList, nodes } = useNodes()
  const editor = useCreateEditor(plugins)

  editor.items = nodes

  // console.log('editor node======:', node)

  const indentationWidth = 50
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const flattenedItems = useMemo(() => {
    return nodeList.flattenNode(node)
  }, [nodeList, node])

  const [items, setItems] = useState(flattenedItems)

  // console.log(
  //   'flattenedItems===:',
  //   flattenedItems.map((item) => nodeList.getNode(item.id)),
  // )

  editor.flattenedItems = items

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const activeItem = activeId ? items.find(({ id }) => id === activeId) : null

  return (
    <Slate
      editor={editor}
      initialValue={content}
      onChange={(value) => {
        onChange?.(value, editor)
      }}
    >
      <HoveringToolbar />
      <SetNodeToDecorations />

      <DndContext
        sensors={sensors}
        // collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={items}
          // strategy={verticalListSortingStrategy}
          strategy={rectSortingStrategy}
        >
          <NodeEditorEditable onBlur={onBlur} />

          {createPortal(
            // <DragOverlay dropAnimation={dropAnimationConfig}>
            <DragOverlay dropAnimation={null}>
              {activeId && activeItem ? (
                <DragOverlayPreview item={activeItem} />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
      <ClickablePadding />
    </Slate>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    // resetState()

    console.log('active:', active.id, 'over:', over?.id)

    const activeId = active.id as string
    const overId = over?.id as string

    // console.log('protected============:', projected)

    if (activeId === overId) {
      console.log('same........')
      return
    }

    // console.log('overID:', overId)

    const [activeEntry] = Editor.nodes(editor, {
      at: [],
      match: (n: any) => n.id === activeId,
    })

    const [overEntry] = Editor.nodes(editor, {
      at: [],
      match: (n: any) => n.id === overId,
    })

    const isOverChildren = checkIsOverChildren(activeEntry[1], overId)
    // console.log('isOverChildren=======:', isOverChildren)

    if (isOverChildren) return

    if (overEntry) {
      const p1 = getNodeByPath(editor, Path.parent(activeEntry[1]))
      const p2 = getNodeByPath(editor, Path.parent(overEntry[1]))
      // console.log('p1:', p1, 'p2:', p2)

      Transforms.moveNodes(editor, {
        at: Path.parent(activeEntry[1]),
        // match: (n: any) => n === activeEntry[0],
        to: Path.parent(overEntry[1]),
      })

      const newItems = editorValueToNode(
        nodeList,
        editor,
        editor.children[0] as any,
      )

      // console.log('newItems===:', newItems)

      setItems(newItems)
      // console.log('entry:', overEntry)
    }

    // console.log('handleDragEnd======: ', depth, 'parentId:', parentId)
  }

  function checkIsOverChildren(activePath: Path, overId: string) {
    const [overEntry] = Editor.nodes(editor, {
      at: Path.parent(activePath),
      match: (n: any) => n.id === overId,
    })

    return !!overEntry
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setActiveId(null)
    document.body.style.setProperty('cursor', '')
  }
}
