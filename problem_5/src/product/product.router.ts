import express from 'express'
import type { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { GetProductsUsecase } from './usecases/get-products.usecase'
import { GetProductByIdUsecase } from './usecases/get-product-by-id.usecase'
import { CreateProductUsecase } from './usecases/create-product.usecase'
import { UpdateProductByIdUsecase } from './usecases/update-product-by-id.usecase'
import { DeleteProductByIdUsecase } from './usecases/delete-product-by-id.usecase'

export const productRouter = express.Router()

productRouter.get('/', async (request: Request, response: Response) => {
  try {
    const usecase = new GetProductsUsecase()
    const products = await usecase.execute()

    return response.status(200).json(products)
  } catch (error: any) {
    return response.status(500).json(error.message)
  }
})

productRouter.get('/:id', async (request: Request, response: Response) => {
  const ID: number = parseInt(request.params.id, 10)

  try {
    const usecase = new GetProductByIdUsecase()
    const product = await usecase.execute(ID)

    if (product) {
      return response.status(200).json(product)
    }

    return response.status(404).json('Product not found')
  } catch (error: any) {
    return response.status(500).json(error.message)
  }
})

productRouter.post(
  '/',
  body('title').isString(),
  body('isFiction').isBoolean(),
  body('datePublish').isDate().isDate(),
  body('authorID').isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() })
    }

    try {
      const usecase = new CreateProductUsecase()
      const newProduct = await usecase.execute(request.body)

      return response.status(201).json(newProduct)
    } catch (error: any) {
      return response.status(500).json(error.message)
    }
  }
)

productRouter.put(
  '/:id',
  body('title').isString().optional(),
  body('isFiction').isBoolean().optional(),
  body('datePublish').isDate().optional(),
  body('authorID').isInt().optional(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request)

    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() })
    }

    const ID: number = parseInt(request.params.id, 10)

    try {
      const usecase = new UpdateProductByIdUsecase()
      const updatedProduct = await usecase.execute(ID, request.body)

      return response.status(201).json(updatedProduct)
    } catch (error: any) {
      return response.status(500).json(error.message)
    }
  }
)

productRouter.delete('/:id', async (request: Request, response: Response) => {
  const ID: number = parseInt(request.params.id, 10)

  try {
    const usecase = new DeleteProductByIdUsecase()
    await usecase.execute(ID)

    return response.status(200).json('Product has been deleted')
  } catch (error: any) {
    return response.status(500).json(error.message)
  }
})
