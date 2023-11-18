import { useState } from 'react'
import { Box, styled } from '@fower/react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { MenuItem, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { IColumnNode } from '@penx/model-types'
import { columnWidthMotion } from '../../../columnWidthMotion'
import { FieldIcon } from '../FieldIcon'
import { ResizeHandle } from './ResizeHandle'

const AnimatedDiv = styled(motion.div)

interface Props {
  index: number
  column: IColumnNode
}

export const ColumnItem = ({ column, index }: Props) => {
  const { width: w = 120 } = column.props
  const x = useMotionValue(w - 2)
  const width = useTransform(x, (latest) => latest + 2)

  // TODO: hack, save width in store, so we can use it in cell
  columnWidthMotion[column.id] = width

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AnimatedDiv
        borderTop
        borderBottom
        borderRight
        h-40
        toCenterY
        cursorPointer
        relative
        bgGray100--hover
        transitionColors
        style={{
          width,
        }}
      >
        <Popover
          placement="bottom-start"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger asChild>
            <Box
              h-100p
              flex-1
              toCenterY
              gap2
              px3
              onClick={() => {
                setIsOpen(!isOpen)
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
              }}
            >
              <FieldIcon fieldType={column.props.fieldType} index={index} />
              <Box>{column.props.name}</Box>
            </Box>
          </PopoverTrigger>
          <PopoverContent w-200>
            <MenuItem>Move to left</MenuItem>
            <MenuItem>Move to right</MenuItem>
            <MenuItem>Delete Column</MenuItem>
          </PopoverContent>
        </Popover>
        <ResizeHandle x={x} width={width} column={column} />
      </AnimatedDiv>
    </>
  )
}
