import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { postAtom } from '@/hooks/usePost'
import { postsAtom } from '@/hooks/usePosts'
import { useSpace } from '@/hooks/useSpace'
import { PostType } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { Feather, PencilLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function CreateFirstPostButton() {
  const { space } = useSpace()
  const { push } = useRouter()
  const { isPending, mutateAsync } = trpc.post.create.useMutation()
  return (
    <Button
      size="lg"
      variant="default"
      className="rounded-2xl w-[200px]"
      onClick={async () => {
        try {
          const post = await mutateAsync({
            spaceId: space.id,
            type: PostType.ARTICLE,
          })
          store.set(postAtom, post as any)
          setTimeout(async () => {
            const posts = await api.post.listBySpaceId.query(space.id)
            store.set(postsAtom, posts)
          }, 0)
          push(`/~/space/${space.id}/post/${post.id}`)
        } catch (error) {
          const msg = extractErrorMessage(error)
          toast.error(msg || 'Failed to create post')
        }
      }}
    >
      {isPending ? (
        <LoadingDots color="white" />
      ) : (
        <div className="flex gap-1 items-center">
          <Feather size={14}></Feather>
          <div>Create First Post</div>
        </div>
      )}
    </Button>
  )
}
