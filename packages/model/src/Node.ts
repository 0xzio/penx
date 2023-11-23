import CryptoJS from 'crypto-js'
import { format } from 'date-fns'
import { INode, NodeType } from '@penx/model-types'

type Element = {
  id: string
  type: string
  name?: string
  children: Array<{ text: string }>
}

export type WithFlattenedProps<T> = T & {
  parentId: string | null // parent node id
  depth: number
  index: number
}

export class Node {
  constructor(public raw: INode) {}

  get id(): string {
    return this.raw?.id || ''
  }

  parentId = this.raw?.parentId || ''

  get spaceId(): string {
    return this.raw.spaceId
  }

  get type(): string {
    return this.raw?.type || ''
  }

  get hasChildren() {
    return !!this.children.length
  }

  get props() {
    return this.raw.props || {}
  }

  get element(): Element[] {
    return Array.isArray(this.raw.element)
      ? this.raw.element
      : [this.raw.element]
  }

  get title(): string {
    if (this.isDaily) {
      return format(new Date(this.raw.props.date || Date.now()), 'EEEE, LLL do')
    }

    if (this.isInbox) return 'Inbox'
    if (this.isTrash) return 'Trash'
    if (this.isDatabaseRoot) return 'Tags'
    if (this.isDailyRoot) return 'Daily Notes'

    return this.element[0]?.children?.[0]?.text || this.props.name || ''
  }

  get isCommon() {
    return this.type === NodeType.COMMON
  }

  get isTrash() {
    return this.type === NodeType.TRASH
  }

  get isInbox() {
    return this.type === NodeType.INBOX
  }

  get isFavorite() {
    return this.type === NodeType.FAVORITE
  }

  get isDaily() {
    return this.type === NodeType.DAILY
  }

  get isRootNode() {
    return this.type === NodeType.ROOT
  }

  get isDatabaseRoot() {
    return this.type === NodeType.DATABASE_ROOT
  }

  get isDailyRoot() {
    return this.type === NodeType.DAILY_ROOT
  }

  get isDatabase() {
    return this.type === NodeType.DATABASE
  }

  get collapsed() {
    return this.raw.collapsed
  }

  get folded() {
    return this.raw.folded
  }

  get tagName(): string {
    return this.raw.props.name || ''
  }

  get tagColor(): string {
    return this.raw.props.color || ''
  }

  get children() {
    return this.raw.children
  }

  get createdAt() {
    return this.raw.createdAt
  }

  get updatedAt() {
    return this.raw.updatedAt
  }

  get createdAtFormatted() {
    return format(this.raw.createdAt, 'yyyy-MM-dd HH:mm')
  }

  get updatedAtFormatted() {
    return format(this.raw.updatedAt, 'yyyy-MM-dd HH:mm')
  }

  get snapshotId() {
    if (this.isInbox) return NodeType.INBOX
    if (this.isRootNode) return NodeType.ROOT
    if (this.isTrash) return NodeType.TRASH
    return this.id
  }

  get hash() {
    return this.md5Node()
  }

  private md5Node = () => {
    const json = [
      this.id,
      this.spaceId,
      this.parentId,
      this.type,
      this.element,
      this.props,
      this.collapsed,
      this.folded,
      this.children,
    ]

    return CryptoJS.MD5(JSON.stringify(json)).toString()
  }
}
