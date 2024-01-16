import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { IQuestion } from '@/constants/types'

export default function ListQuestion({ questions }: { questions: IQuestion[] }) {
  return (
    <div className='flex flex-col gap-y-4'>
      {questions.map((q, index) => (
        <div key={q.id}>
          <h4 className='text-xl font-medium mb-1'>
            Câu hỏi {index + 1}: {q.title}
          </h4>

          <Table className='border'>
            <TableHeader>
              <TableRow>
                <TableHead>Câu trả lời</TableHead>
                <TableHead className='w-28 text-center'>Lượt trả lời</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.answers
                ?.sort((x) => -x.count)
                ?.map((ans) => (
                  <TableRow key={ans.id}>
                    <TableCell>{ans.title}</TableCell>
                    <TableCell className='w-28 text-center'>{ans.count}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
