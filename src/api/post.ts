import { api } from '.'
import { CreatePostDTO, SubmitAnswerDTO } from './types/post'

const getPosts = (params?: {
  page?: number
  perPage?: number
  orderBy?: 'asc' | 'desc'
  status?: 'active' | 'inactive'
  search?: string
}) => api.get('/admin/posts', { params })
const getPost = (id: number) => api.get(`/admin/posts/${id}`)
const setPost = (payload: CreatePostDTO) => api.post('/admin/posts', payload)

const getPostsWithoutAuth = () => api.get('/posts')
const getPostByIdWithoutAuth = (id: number) => api.get(`/posts/${id}`)
const submitAnswer = (id: number, payload: SubmitAnswerDTO) => api.patch(`/posts/answer-post/${id}`, payload)

const getPostComments = (params?: {
  page?: number
  perPage?: number
  orderBy?: 'asc' | 'desc'
  status?: 'active' | 'inactive'
  search?: string
  postId?: number
}) =>
  api.get('/admin/comments', {
    params: params
  })

const postService = {
  getPosts,
  getPost,
  setPost,
  getPostsWithoutAuth,
  getPostByIdWithoutAuth,
  submitAnswer,
  getPostComments
}

export default postService
