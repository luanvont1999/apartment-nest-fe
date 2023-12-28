import { api } from '.'
import { CreatePostDTO, SubmitAnswerDTO } from './types/post'

const getPosts = () => api.get('/admin/posts')

const setPost = (payload: CreatePostDTO) => api.post('/admin/posts', payload)

const getPostsWithoutAuth = () => api.get('/posts')
const getPostByIdWithoutAuth = (id: number) => api.get(`/posts/${id}`)
const submitAnswer = (id: number, payload: SubmitAnswerDTO) => api.patch(`/posts/answer-post/${id}`, payload)

const postService = {
  getPosts,
  setPost,
  getPostsWithoutAuth,
  getPostByIdWithoutAuth,
  submitAnswer
}

export default postService
