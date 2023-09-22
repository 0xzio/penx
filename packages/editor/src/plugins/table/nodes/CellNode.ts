import { produce } from 'immer'
import { Editor, Node, Path, Transforms } from 'slate'
import { findNodePath } from '@penx/editor-queries'
import {
  TableCellElement,
  TableElement,
  TableRowElement,
} from '@penx/editor-types'
import { getEmptyCellNode } from '../getEmptyCellNode'
import { getEmptyRowNode } from '../getEmptyRowNode'

export class CellNode {
  constructor(private editor: Editor, private element: TableCellElement) {}

  get path() {
    return findNodePath(this.editor, this.element) || []
  }

  get rowPath() {
    return Path.parent(this.path)
  }

  get isInFirstColumn() {
    return this.path[this.path.length - 1] === 0
  }

  get isInFirstRow() {
    return this.path[this.path.length - 2] === 0
  }

  get rowElement() {
    return Node.parent(this.editor, this.path) as TableRowElement
  }

  get tableElement() {
    return Node.parent(this.editor, this.path.slice(0, -1)) as TableElement
  }

  get isInHeader() {
    return (
      (this.isInFirstColumn && this.tableElement.isHeaderColumn) ||
      (this.isInFirstRow && this.tableElement.isHeaderRow)
    )
  }
}
