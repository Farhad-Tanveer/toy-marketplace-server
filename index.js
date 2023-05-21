const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("toy market place is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.id406pi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toyCollection = client.db("toyPlace").collection("allToys");

    // creating index on one fields
    const indexKeys = { title: 1, category: 1 };
    const indexOptions = { name: "titleCategory" };
    const result = await toyCollection.createIndex(indexKeys, indexOptions);

    // get all data
    app.get("/allToys", async (req, res) => {
      const result = await toyCollection.find({}).limit(20).toArray();
      res.send(result);
    });
    // get specific data
    app.get("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.get("/allToys", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/allToy/:email", async (req, res) => {
      //   console.log(req.params.email);
      const filter = { email: req.params.email };
      const result = await toyCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/getToysByText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await toyCollection
        .find({
          $or: [
            { title: { $regex: text, $options: "i" } },
            { category: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    app.get("/allToysByCategory/:category", async (req, res) => {
      //   console.log(req.params.category);
      const result = await toyCollection
        .find({
          category: req.params.category,
        })
        .toArray();
      res.send(result);
    });

    // sorting by price
    // app.get("/sortedtoys", async (req, res) => {
    //   try {
    //     if (req.query?.email) {
    //       const query = { email: req.query.email };
    //       const sortOrder = req.query?.sort == "asc" ? 1 : -1;
    //       const result = await toyCollection
    //         .find({})
    //         .sort({ price: sortOrder })
    //         .toArray();
    //       console.log(result);
    //       res.send(result);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ error: "Internal Server Error" });
    //   }
    // });

    app.put("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToy = req.body;
      const toy = {
        $set: {
          title: updateToy.title,
          name: updateToy.name,
          price: updateToy.price,
          category: updateToy.category,
          rating: updateToy.rating,
          image: updateToy.image,
          quantity: updateToy.quantity,
          description: updateToy.description,
        },
      };
      const result = await toyCollection.updateOne(filter, toy, options);
      res.send(result);
    });

    app.post("/addToy", async (req, res) => {
      const body = req.body;
      const result = await toyCollection.insertOne(body);
      res.send(result);
      console.log(body);
    });

    app.delete("/allToys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`toy market place is running on ${port}`);
});
