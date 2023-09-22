import { PlusOutline } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { Button } from 'uikit'
import { NewDocPopover } from './NewDocPopover'

export const CatalogueBoxHeader = () => {
  return (
    <Box toCenterY toBetween gap2 my2>
      <Box fontBold ml2>
        Docs
      </Box>
      <NewDocPopover>
        <Button
          size="sm"
          variant="ghost"
          colorScheme="gray700"
          isSquare
          roundedFull
        >
          <PlusOutline />
        </Button>
      </NewDocPopover>
    </Box>
  )
}
