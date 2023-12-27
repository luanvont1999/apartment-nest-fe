import { api } from '.'
import { CreatePostDTO } from './types/post'

const getPosts = () => api.get('/admin/posts')

const setPost = (payload: CreatePostDTO) => api.post('/admin/posts', payload)

const postService = {
  getPosts,
  setPost
}

export default postService
