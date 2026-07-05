import { readFile } from 'fs/promises'
import path from 'path'
import ElevatorSpeechContent from './elevator-speech-content'

export default async function ElevatorSpeechPage() {
  const filePath = path.join(process.cwd(), 'app', 'marfa', 'elevator-speech', 'elevator-speech.html')
  const html = await readFile(filePath, 'utf-8')

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i)

  return (
    <ElevatorSpeechContent
      headHtml={headMatch?.[1] || ''}
      bodyHtml={bodyMatch?.[1] || html}
    />
  )
}
