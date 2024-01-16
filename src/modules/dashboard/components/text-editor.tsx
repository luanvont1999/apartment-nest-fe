import '@/styles/custom-quill.css'
import ReactQuill, { Quill } from 'react-quill'
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter'

import { useCallback, useMemo, useRef, useState } from 'react'

import uploadService from '@/api/upload'

type TextEditorType = {
  value: string
  setValue: (_: string) => void
}

Quill.register('modules/blotFormatter', BlotFormatter)

let debounce: number | NodeJS.Timeout

const TextEditor = ({ value, setValue }: TextEditorType) => {
  const [loading, setLoading] = useState(false)
  const quillRef = useRef<ReactQuill | null>(null)

  const imageUploadHandler = useCallback(async () => {
    if (!quillRef?.current) return
    const editor = quillRef.current.getEditor()
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      try {
        setLoading(true)
        const file = input.files?.[0]
        if (editor && file && /^image\//.test(file.type)) {
          const formData = new FormData()
          formData.append('folder', 'post')
          formData.append('file', file)
          const { data } = await uploadService.uploadFile(formData) // upload data into server or aws or cloudinary
          const url = data?.location
          const selection = editor.getSelection()?.index

          if (selection !== undefined) {
            editor.insertEmbed(selection || 0, 'image', url)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['image', 'link']
        ],
        handlers: {
          image: imageUploadHandler
        }
      },
      blotFormatter: {}
    }),
    []
  )

  const handleChange = (value: string) => {
    if (debounce) {
      clearTimeout(debounce)
    }
    debounce = setTimeout(() => {
      setValue(value)
    }, 300)
  }

  return (
    <div className='w-full pb-12 relative'>
      <ReactQuill ref={quillRef} theme='snow' modules={modules} defaultValue={value} onChange={handleChange} />
      {loading && <div className='absolute inset-0 bg-black/20' />}
    </div>
  )
}

export default TextEditor
