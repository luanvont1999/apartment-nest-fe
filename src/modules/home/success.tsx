import { Link, useSearchParams } from 'react-router-dom'

export default function SuccessPage() {
  const [params] = useSearchParams()
  const returnUrl = params.get('returnUrl')

  return (
    <div className='min-h-screen w-full bg-secondary p-2 flex justify-center items-center'>
      <div className='bg-white p-4 py-10 rounded-md h-full text-center'>
        <h2 className='text-2xl font-bold mb-2'>Cảm ơn bạn rất nhiều</h2>
        <p className=''>Câu trả lời của bạn đã được gửi đến chúng tôi.</p>
        {returnUrl && (
          <div className='mt-4'>
            <Link to={returnUrl} className='italic hover:text-blue-600 hover:underline'>
              quay trở lại danh mục ý kiến
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
