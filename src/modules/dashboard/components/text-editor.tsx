import '@/styles/custom-quill.css'
import { useQuill } from 'react-quilljs'
import BlotFormatter from 'quill-blot-formatter'

import React, { useCallback, useMemo, useState } from 'react'

import uploadService from '@/api/upload'

type TextEditorType = {
  value: string
  setValue: (_: string) => void
}

let debounce: number | NodeJS.Timeout

const TextEditor = ({ value, setValue }: TextEditorType) => {
  const [loading, setLoading] = useState(false)
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['image', 'link']
        ]
      },
      blotFormatter: {}
    }),
    []
  )

  const { quill, quillRef, Quill } = useQuill({ modules })

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter)
  }

  const imageUploadHandler = useCallback(async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      try {
        setLoading(true)
        const file = input.files?.[0]
        if (quill && file && /^image\//.test(file.type)) {
          const formData = new FormData()
          formData.append('file', file)
          const { data } = await uploadService.uploadFile(formData) // upload data into server or aws or cloudinary
          const url = data?.location
          const selection = quill.getSelection()?.index
          if (selection !== undefined) quill.insertEmbed(selection, 'image', url)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }, [quill])

  React.useEffect(() => {
    if (quill) {
      // Initial Value
      quill.clipboard.dangerouslyPasteHTML(value)

      quill.on('text-change', () => {
        if (debounce) {
          clearTimeout(debounce)
        }
        debounce = setTimeout(() => {
          setValue(quill.root.innerHTML)
        }, 300)
      })

      // Add custom handler for Image Upload
      quill.getModule('toolbar').addHandler('image', imageUploadHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quill, imageUploadHandler, setValue])

  return (
    <div className='w-full pb-12'>
      <div className='text-editor relative' ref={quillRef}>
        {loading && <div className='absolute inset-0 bg-black' />}
      </div>
    </div>
  )
}

export default TextEditor
