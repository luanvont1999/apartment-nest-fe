import { api } from '.'
import { CreatePostDTO, SubmitAnswerDTO } from './types/post'

const getPosts = () => api.get('/admin/posts')
const getPost = (id: number) => api.get(`/admin/posts/${id}`)
const setPost = (payload: CreatePostDTO) => api.post('/admin/posts', payload)

const getPostsWithoutAuth = () => api.get('/posts')
const getPostByIdWithoutAuth = (id: number) => api.get(`/posts/${id}`)
const submitAnswer = (id: number, payload: SubmitAnswerDTO) => api.patch(`/posts/answer-post/${id}`, payload)

const getPostComments = (postId: number) =>
  api.get('/admin/comments', {
    params: { postId }
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
