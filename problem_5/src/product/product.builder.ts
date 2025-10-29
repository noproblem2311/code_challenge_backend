import { ProductRead, ProductCreateData, ProductUpdateData } from './product.entities'
import { db } from '../utils/db.server'
import { Author } from '../author/author.service'

export class ProductQueryBuilder {
  private selectFields = {
    ID: true,
    title: true,
    isFiction: true,
    datePublish: true,
    author: {
      select: {
        ID: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    },
    createdAt: true,
    updatedAt: true
  }

  findAll() {
    return db.product.findMany({
      select: this.selectFields
    })
  }

  findById(ID: number) {
    return db.product.findUnique({
      where: { ID },
      select: this.selectFields
    })
  }

  create(data: ProductCreateData) {
    const parseDate: Date = new Date(data.datePublish)

    return db.product.create({
      data: {
        title: data.title,
        isFiction: data.isFiction,
        datePublish: parseDate,
        authorID: data.authorID
      },
      select: this.selectFields
    })
  }

  update(ID: number, data: ProductUpdateData) {
    const updateData: any = {}

    if (data.title !== undefined) {
      updateData.title = data.title
    }

    if (data.isFiction !== undefined) {
      updateData.isFiction = data.isFiction
    }

    if (data.datePublish !== undefined) {
      updateData.datePublish = new Date(data.datePublish)
    }

    if (data.authorID !== undefined) {
      updateData.authorID = data.authorID
    }

    return db.product.update({
      where: { ID },
      data: updateData,
      select: this.selectFields
    })
  }

  delete(ID: number) {
    return db.product.delete({
      where: { ID }
    })
  }
}
