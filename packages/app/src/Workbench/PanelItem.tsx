import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'
import { NodeEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { NodeProvider, useNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { routerAtom } from '@penx/store'
import { withBulletPlugin } from '../plugins/withBulletPlugin'
import { MobileNav } from './DocNav/MobileNav'
import { PCNav } from './DocNav/PCNav'
import { LinkedReferences } from './LinkedReferences'

interface Props {
  index: number
  node: Node
}

export function PanelItem({ node, index }: Props) {
  const { nodes } = useNodes()
  const { name } = useAtomValue(routerAtom)
  const nodeService = new NodeService(node, nodes)

  const debouncedSaveNodes = useDebouncedCallback(async (value: any[]) => {
    nodeService.savePage(node.raw, value[0], value[1])
  }, 500)

  return (
    <NodeProvider value={{ node, nodeService }}>
      <Box relative h-100vh>
        <Box
          overflowYAuto
          h={['calc(100vh - 48px)', '100vh']}
          px={[10, 16, 30, 40, 0]}
          py0
        >
          <MobileNav />
          {name === 'NODE' && <PCNav />}
          <Box w-100p>
            <Box mx-auto maxW-800>
              <NodeEditor
                index={index}
                plugins={[withBulletPlugin]}
                content={nodeService.getEditorValue()}
                node={node}
                onChange={(value, editor) => {
                  if (isAstChange(editor)) {
                    debouncedSaveNodes(value)
                  }
                }}
              />
              <LinkedReferences node={node} />
            </Box>
          </Box>
        </Box>
      </Box>
    </NodeProvider>
  )
}
