import { ProductRead } from '../product.entities'
import { ProductQueryBuilder } from '../product.builder'

export class GetProductsUsecase {
  private builder: ProductQueryBuilder

  constructor(builder?: ProductQueryBuilder) {
    this.builder = builder || new ProductQueryBuilder()
  }

  async execute(): Promise<ProductRead[]> {
    return this.builder.findAll()
  }
}
