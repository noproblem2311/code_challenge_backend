import { ProductRead } from '../product.entities'
import { ProductQueryBuilder } from '../product.builder'

export class GetProductByIdUsecase {
  private builder: ProductQueryBuilder

  constructor(builder?: ProductQueryBuilder) {
    this.builder = builder || new ProductQueryBuilder()
  }

  async execute(ID: number): Promise<ProductRead | null> {
    return this.builder.findById(ID)
  }
}
