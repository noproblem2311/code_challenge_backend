import { ProductRead, ProductCreateData } from '../product.entities'
import { ProductQueryBuilder } from '../product.builder'

export class CreateProductUsecase {
  private builder: ProductQueryBuilder

  constructor(builder?: ProductQueryBuilder) {
    this.builder = builder || new ProductQueryBuilder()
  }

  async execute(data: ProductCreateData): Promise<ProductRead> {
    return this.builder.create(data)
  }
}
