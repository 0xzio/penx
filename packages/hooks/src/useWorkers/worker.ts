import { WorkerEvents } from '@penx/constants'
import { db } from '@penx/local-db'
import { clearNodes } from './clearNodes'
import { normalizeNodes } from './normalizeNodes'
import { startPollingPull } from './pollingPull'
import { startPollingPush } from './pollingPush'
import { syncPenx101 } from './syncPenx101'

self.addEventListener('message', async (event) => {
  await db.database.connect()
  if (event.data === WorkerEvents.START_POLLING) {
    startPollingPush()
    startPollingPull()
  }

  // updateExtension()
  clearNodes()

  syncPenx101()

  normalizeNodes()
})
