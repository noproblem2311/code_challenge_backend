import { ProductRead, ProductUpdateData } from '../product.entities'
import { ProductQueryBuilder } from '../product.builder'

export class UpdateProductByIdUsecase {
  private builder: ProductQueryBuilder

  constructor(builder?: ProductQueryBuilder) {
    this.builder = builder || new ProductQueryBuilder()
  }

  async execute(ID: number, data: ProductUpdateData): Promise<ProductRead> {
    return this.builder.update(ID, data)
  }
}
