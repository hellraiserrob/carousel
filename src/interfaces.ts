export interface Image {
  src: string
  aspect: string
}

export interface Card {
  title: string,
  summary: string,
  text: string
  image?: Image
}

export interface Column {
  id: number,
  x: number,
  y: number,
}

export interface Breakpoint {
  threshold: number,
  columns: number,
  gutter: number,
}
