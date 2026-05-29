import { readFile } from 'fs/promises'
import path from 'path'

export default async function AirbnbWorksheetPage() {
  const filePath = path.join(process.cwd(), 'app', 'marfa', 'airbnb-worksheet', 'airbnb-worksheet.html')
  const html = await readFile(filePath, 'utf-8')

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i)

  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: headMatch?.[1] || '' }} />
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bodyMatch?.[1] || html }} />
    </>
  )
}
