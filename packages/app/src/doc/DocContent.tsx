import { Box } from '@fower/react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { Input } from 'uikit'
import { DocEditor } from '@penx/editor'
import { isAstChange } from '@penx/editor-queries'
import { useDoc } from '@penx/hooks'
import { insertEmptyParagraph } from '@penx/paragraph'
import { docToMarkdown } from '@penx/shared'

export function DocContent() {
  const doc = useDoc()
  const { title } = doc

  function handleEnterKeyInTitle(editor: Editor) {
    insertEmptyParagraph(editor, { at: [0] })

    ReactEditor.focus(editor as any)
    Transforms.select(editor, Editor.start(editor, [0]))
  }

  if (!doc.inited) return null

  const md = docToMarkdown(doc.raw)

  // return (
  //   <Box p10>
  //     <Textarea defaultValue={md} h-80vh />
  //   </Box>
  // )

  return (
    <Box>
      <Box mx-auto maxW-800>
        <DocEditor
          content={doc.content}
          onChange={(value, editor) => {
            if (isAstChange(editor)) {
              doc.updateDoc(value, title)
            }
          }}
          renderPrefix={(editor) => (
            <Box mt10>
              <Input
                text5XL
                fontSemibold
                h-2em
                placeholderGray300
                leadingNormal
                value={title}
                variant="unstyled"
                placeholder="Enter Title"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleEnterKeyInTitle(editor)
                  }
                }}
                onChange={(e) => {
                  doc.setTitleState(e.target.value)
                  doc.updateDoc(editor.children, e.target.value)
                }}
              />
            </Box>
          )}
        />
      </Box>
    </Box>
  )
}
