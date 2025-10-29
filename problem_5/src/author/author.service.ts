import { db } from '../utils/db.server'

export type Author = {
  ID: number
  firstName: string
  lastName: string
  createdAt: Date
  updatedAt: Date
}

export const getAuthors = async (): Promise<Author[]> => {
  return db.author.findMany({
    select: {
      ID: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const getAuthorById = async (ID: number): Promise<Author | null> => {
  return db.author.findUnique({
    where: {
      ID
    },
    select: {
      ID: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const createAuthor = async (author: Omit<Author, 'ID'>): Promise<Author> => {
  const { firstName, lastName } = author

  return db.author.create({
    data: {
      firstName,
      lastName
    },
    select: {
      ID: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const updateAuthorById = async (ID: number, author: Omit<Author, 'ID'>): Promise<Author> => {
  const { firstName, lastName } = author

  return db.author.update({
    where: {
      ID
    },
    data: {
      firstName,
      lastName
    },
    select: {
      ID: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const deleteAuthorById = async (ID: number): Promise<void> => {
  await db.author.delete({
    where: {
      ID
    }
  })
}
