import { ProductQueryBuilder } from '../product.builder'

export class DeleteProductByIdUsecase {
  private builder: ProductQueryBuilder

  constructor(builder?: ProductQueryBuilder) {
    this.builder = builder || new ProductQueryBuilder()
  }

  async execute(ID: number): Promise<void> {
    await this.builder.delete(ID)
  }
}
