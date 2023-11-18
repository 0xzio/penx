import { BaseElement } from 'slate'
import {
  ELEMENT_DATABASE,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LIVE_QUERY,
} from './constants'

export interface BaseCustomElement extends BaseElement {
  id?: string
}

export interface DatabaseElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE
  databaseId: string
  name: string
}

export interface DatabaseEntryElement extends BaseCustomElement {
  type: typeof ELEMENT_DATABASE_ENTRY
  databaseId: string
  name: string
  props: {
    color: string
    name: string
  }
}

export interface LiveQueryElement extends BaseCustomElement {
  type: typeof ELEMENT_LIVE_QUERY
}
