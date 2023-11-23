import { authRouter } from './router/auth'
import { extensionRouter } from './router/extension'
import { githubRouter } from './router/github'
import { inboxRouter } from './router/inbox'
import { nodeRouter } from './router/node'
import { SharedDocRouter } from './router/SharedDoc'
import { spaceRouter } from './router/space'
import { themeRouter } from './router/theme'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  space: spaceRouter,
  user: userRouter,
  auth: authRouter,
  node: nodeRouter,
  theme: themeRouter,
  inbox: inboxRouter,
  github: githubRouter,
  sharedDoc: SharedDocRouter,
  extension: extensionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
