import { Link } from 'react-router-dom'

const ITEMS = [{ label: 'Bảng câu hỏi', path: '/dashboard' }]

export default function Navbar() {
  return (
    <nav className='flex gap-x-2 items-center'>
      {ITEMS.map((item, index) => (
        <Link key={index} to={item.path} className='font-semibold'>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
