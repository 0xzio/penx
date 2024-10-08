'use client'

import { PropsWithChildren } from 'react'
import { useAddress } from '@/hooks/useAddress'
import { useQueryChainSpace } from '@/hooks/useChainSpace'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useQueryEthPrice } from '@/hooks/useEthPrice'
import { CreateSpaceDialog } from '../CreateSpaceDialog/CreateSpaceDialog'
import { CreationDialog } from '../CreationDialog/CreationDialog'
import { Sidebar } from './Sidebar/Sidebar'

export function DashboardLayout({ children }: PropsWithChildren) {
  useQueryEthPrice()
  useQueryEthBalance()
  useQueryChainSpace()

  return (
    <div className="mx-auto h-screen">
      <div className="min-h-screen flex-row justify-center flex relative">
        <CreateSpaceDialog />
        <CreationDialog />
        <Sidebar />
        <div
          className="flex-1 overflow-x-hidden z-1"
          style={
            {
              // boxShadow: '-10px 0px 15px -5px rgba(0, 0, 0, 0.5)',
            }
          }
        >
          {children}
        </div>
      </div>
    </div>
  )
}
