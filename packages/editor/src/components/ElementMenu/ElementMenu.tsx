import { FC, memo } from 'react'
import { Box } from '@fower/react'
import { Node, Path } from 'slate'
import { isHeading } from '@penx/heading'
import { isEqual } from '../../common/utils'
import { DragMenu } from './DragMenu'

interface Props {
  // element: Node
  element: any
  path: Path
  listeners: any
}

export const ElementMenu: FC<Props> = memo(
  function ElementMenu({ element, path, listeners }) {
    const { id = '', type } = element as any
    const width = 80
    return (
      <Box
        contentEditable={false}
        toCenterY
        toRight
        absolute
        left={-width - 6}
        w={width}
        h={isHeading(element) ? '2em' : 'calc(1.5em + 8px)'}
        textBase
        text3XL={isHeading(element, 'h1')}
        text2XL={isHeading(element, 'h2')}
        textXL={isHeading(element, 'h3')}
        textLG={isHeading(element, 'h4')}
        textSM={isHeading(element, 'h6')}
      >
        <DragMenu id={id} type={type} path={path} listeners={listeners} />
      </Box>
    )
  },
  (prev, next) => {
    const equal =
      prev.element.id === next.element.id &&
      prev.element.type === next.element.type &&
      isEqual(prev.path, next.path)

    return equal
  },
)
