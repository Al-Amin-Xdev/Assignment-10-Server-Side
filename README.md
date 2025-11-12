Backend

Technologies Used:

Node.js with Express.js

MongoDB (Atlas) for database

CORS middleware

dotenv for environment variables

Firebase Admin SDK (for verifying ID tokens)

REST API endpoints with CRUD functionality

Main Features:

Store crops and interest data in MongoDB

Endpoints:

GET /allproducts – fetch all crops

GET /allproducts/:id – fetch single crop by ID

POST /allproducts – add new crop

PATCH /allproducts/:id – update interest or crop data

Middleware to verify Firebase access tokens from front-end requests

Secure handling of user actions via Firebase token verification