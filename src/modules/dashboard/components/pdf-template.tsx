import { IPost } from '@/constants/types'
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import QRCode from 'qrcode'

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500
    },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 }
  ]
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  section: {
    margin: 10,
    padding: 10
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  qr: {
    width: 320,
    height: 320,
    marginHorizontal: 'auto'
  }
})

export default function PDFTemplate({ post }: { post: IPost }) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{post.title}</Text>
        </View>
        <View
          style={{
            margin: 10,
            padding: 10,
            textAlign: 'center'
          }}
        >
          <Image src={QRCode.toDataURL(`${location.origin}/question/${post.id}`)} style={styles.qr} />
          <Text>Quét QRCode để chia sẻ ý kiến của bạn</Text>
        </View>
      </Page>
    </Document>
  )
}
