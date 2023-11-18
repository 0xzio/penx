import { Path, Transforms } from 'slate'
import { ContextMenu, MenuItem } from '@penx/context-menu'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { ListContentElement } from '../types'

interface Props {
  menuId: string
  element: ListContentElement
}

export const BulletMenu = ({ menuId, element }: Props) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!

  function handleItemClick(type: string) {
    if (type === 'DELETE') {
      Transforms.removeNodes(editor, { at: Path.parent(path) })
    }
  }

  return (
    <ContextMenu id={menuId}>
      <MenuItem onClick={() => handleItemClick('a')}>Add to favorite</MenuItem>
      <MenuItem onClick={() => handleItemClick('b')}>Publish</MenuItem>
      <MenuItem onClick={() => handleItemClick('c')}>Copy</MenuItem>
      <MenuItem onClick={() => handleItemClick('DELETE')}>Delete</MenuItem>
      <MenuItem onClick={() => handleItemClick('d')}>Expand all</MenuItem>
      <MenuItem onClick={() => handleItemClick('f')}>Collapse all</MenuItem>
    </ContextMenu>
  )
}
