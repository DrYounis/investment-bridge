import { readFile } from 'fs/promises'
import path from 'path'

export default async function ElevatorSpeechPage() {
  const filePath = path.join(process.cwd(), 'public', 'marfa', 'elevator-speech.html')
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
