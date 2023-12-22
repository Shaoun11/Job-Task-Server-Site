const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uzun1bo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
 // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("task-manger-data").collection("task");
    const userdatabase = client.db("task-manger-data").collection("taskUser");

    app.get('/task',  async (req, res) => {
        const result = await database.find().toArray();
        res.send(result);
      });

      
      app.post('/users', async (req, res) => {
        const user = req.body;
        // insert email if user doesnt exists: 
        // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
        const query = { email: user.email }
        const existingUser = await userdatabase.findOne(query);
        if (existingUser) {
          return res.send({ message: 'user already exists', insertedId: null })
        }
        const result = await userdatabase.insertOne(user);
        res.send(result);
      });

        //get user

        app.get('/users',  async (req, res) => {
            const result = await userdatabase.find().toArray();
            res.send(result);
          });
      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Task Manager ...");
  }); 
  
  app.listen(port, () => {
    console.log(`Task Manager server is Running on port ${port}`);
  });