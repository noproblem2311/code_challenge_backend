import { Author } from '../author/author.service'

export type ProductRead = {
  ID: number
  title: string
  isFiction: boolean
  datePublish: Date
  author: Author
  createdAt: Date
  updatedAt: Date
}

export type ProductWrite = {
  title: string
  isFiction: boolean
  datePublish: Date
  authorID: number
}

export type ProductCreateData = {
  title: string
  isFiction: boolean
  datePublish: Date | string
  authorID: number
}

export type ProductUpdateData = {
  title?: string
  isFiction?: boolean
  datePublish?: Date | string
  authorID?: number
}
