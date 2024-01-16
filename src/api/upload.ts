import { api } from '.'

export const uploadFile = (formData: FormData) =>
  api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

const uploadService = {
  uploadFile
}

export default uploadService
