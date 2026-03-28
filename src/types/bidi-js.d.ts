declare module 'bidi-js' {
  export default function bidi(
    text: string,
    direction: number,
    shaping: boolean
  ): {
    text: string
    levels: number[]
    paragraphs: Array<{
      level: number
      start: number
      end: number
    }>
  }
}
