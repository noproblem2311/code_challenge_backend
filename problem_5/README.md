# Express TypeScript CRUD API

This project is a simple RESTful API built using Express.js, TypeScript, and Prisma, implementing CRUD operations (Create, Read, Update, Delete).

# For the author feature, I built it using a simple approach suitable for short-term projects (1-6 months).

# For the product feature, I used a scalable approach suitable for long-term projects (1-3 years or longer).

## Getting Started

Follow these steps to run the project locally:

1. **Install Dependencies:**

```bash
npm install
```

```create env and add value

DATABASE_URL="file:./dev.db"
PORT="8000"

```

2. **Create database:**

```bash
npx prisma db push
```

3. **Run database seed:**

```bash
npx prisma db seed
```

4. **Start development server:**

```bash
npm run dev
```

These steps will install the necessary dependencies, create the database schema, seed the database with initial data, and start the development server on port 8000.

## API Endpoints

### Author:

- GET /api/author: Retrieve all author.
- GET /api/author/:id: Retrieve an author by ID.
- POST /api/author: Create a new author.
- PUT /api/author/:id: Update an author by ID.
- DELETE /api/author/:id: Delete an author by ID

### Product:

- GET /api/product: Retrieve all products.
- GET /api/product/:id: Retrieve a product by ID.
- POST /api/product: Create a new product.
- PUT /api/product/:id: Update a product by ID.
- DELETE /api/product/:id: Delete a product by ID

The API Postman Collection is available in the /postman-collection/ directory.
