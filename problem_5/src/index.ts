import * as dotenv from 'dotenv'

import express from 'express'

import cors from 'cors'

import { authorRouter } from './author/author.router'

import { productRouter } from './product/product.router'

dotenv.config()

if (!process.env.PORT) {
  process.exit(1)
}

const PORT: number = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/author', authorRouter)

app.use('/api/product', productRouter)

app.listen(PORT, () => {
  console.log(`Server run on port http://localhost:${PORT}`)
})
