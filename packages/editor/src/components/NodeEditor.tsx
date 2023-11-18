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
import { useNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { useCreateEditor } from '../hooks/useCreateEditor'
import ClickablePadding from './ClickablePadding'
import { DragOverlayPreview } from './DragOverlayPreview'
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

  const indentationWidth = 50
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const flattenedItems = useMemo(() => {
    return nodeList.flattenNode(node)
  }, [nodeList, node])

  editor.flattenedItems = flattenedItems

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth,
        )
      : null

  // save projection to editor
  // TODO: not use projected now, do it later
  editor.projected = projected

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

  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null

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
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <ProtectionProvider value={projected as any}>
          <SortableContext
            items={flattenedItems}
            // strategy={verticalListSortingStrategy}
            strategy={rectSortingStrategy}
          >
            <NodeEditorEditable onBlur={onBlur} />

            {createPortal(
              <DragOverlay
                adjustScale={false}
                dropAnimation={dropAnimationConfig}
              >
                {activeId && activeItem ? <DragOverlayPreview /> : null}
              </DragOverlay>,
              document.body,
            )}
          </SortableContext>
        </ProtectionProvider>
      </DndContext>
      <ClickablePadding />
    </Slate>
  )

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId as string)
    setOverId(activeId as string)

    // document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId((over?.id as any) ?? null)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    const activeId = active.id as string
    const overId = over?.id as string

    if (!(overId && projected)) return
    console.log('protected============:', projected)

    if (activeId === overId) {
      console.log('same........')
      // TODO:
      return
    }

    console.log('overID:', overId)

    const [activeEntry] = Editor.nodes(editor, {
      at: [],
      match: (n: any) => n.id === activeId,
    })

    const [overEntry] = Editor.nodes(editor, {
      at: [],
      match: (n: any) => n.id === overId,
    })

    if (overEntry) {
      Transforms.moveNodes(editor, {
        at: Path.parent(activeEntry[1]),
        // match: (n: any) => n === activeEntry[0],
        to: Path.parent(overEntry[1]),
      })

      console.log('entry:', overEntry)
    }

    // console.log('handleDragEnd======: ', depth, 'parentId:', parentId)
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setActiveId(null)
    setOverId(null)
    setOffsetLeft(0)
    document.body.style.setProperty('cursor', '')
  }
}
