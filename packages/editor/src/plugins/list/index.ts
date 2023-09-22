import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { List } from './List'
import { ListItem } from './ListItem'
import { ListItemContent } from './ListItemContent'
import { withListsPlugin } from './withListsPlugin'

export default function list(): EditorPlugin {
  return {
    with: withListsPlugin,
    elements: [
      {
        name: 'Unordered List',
        // showInPanel: true,
        type: ElementType.ul,
        component: List,
      },
      {
        name: 'Ordered List',
        // icon: IconBulletedList,
        // showInPanel: true,
        type: ElementType.ol,
        component: List,
      },
      {
        type: ElementType.li,
        component: ListItem,
      },
      {
        type: ElementType.lic,
        component: ListItemContent,
      },
    ],
  }
}
