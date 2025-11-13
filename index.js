const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const admin = require("firebase-admin");

// index.js
const decoded = Buffer.from(process.env.FIREBASE_SERVICE_KEY
  , "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




// Token verification with firebase Token and admin 
const VerifyFirebaseToken = async(req, res, next)=>{
  
  const token = req.headers.authorization;
  console.log(token);


  if(!token){
    return res.status(401).send({message: "Forbidden"})
  }

  const tokenn = token.split(" ")[1];

  if(!tokenn){
    return res.status(401).send({message: "Forbidden"})
  }

  // Verify token with firebse admin

  try{

    const decode = await admin.auth().verifyIdToken(tokenn);
    next();
  }
  catch{

    return res.status(401).send({message:"forbidden"})

  }
}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1rbama4.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// test route
app.get('/', (req, res) => {
  res.send('Backend server running ✅');
});






async function run() {
  try {

    // await client.connect();

    const ProductData = client.db('Krishi-Link');
    const ProductCollection = ProductData.collection('All-Crops-Details');

    
    // Get All Crops Data

    app.get('/allproducts', async(req, res)=>{

      try {
      const cursor = ProductCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);

      }
      catch(error){
        console.log(error);
        res.status(500).send({ message: "Failed to fetch data" });
      }
    })

    // Get Single Product

    app.get('/allproducts/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await ProductCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ message: "Product not found" });
        }

        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to fetch product" });
      }
    });

    // Posting New porduct to database collection (ProductCollection)

    app.post('/allproducts', async(req, res)=>{
      const newCrop = req.body;
      const result = await ProductCollection.insertOne(newCrop);
      res.send(result);
    })

    // Updating interest

    app.patch('/allproducts/:id', async(req,VerifyFirebaseToken, res)=>{
      const id = req.params.id;
      const updateInterest = req.body;
      const query = {_id: new ObjectId(id)};
      const update = { $push: { interest: updateInterest } };
      const result = await ProductCollection.updateOne(query, update);
      res.send(result);
    });


    app.patch('/allproducts/:id/interest', async (req, res) => {
    const { id } = req.params;
    const { userEmail, status } = req.body;

    try {
      const result = await ProductCollection.updateOne(
        { _id: new ObjectId(id), "interest.userEmail": userEmail },
        { $set: { "interest.$.status": status } }
      );

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed to update interest status" });
    }
  });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
