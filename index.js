const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ghnljed.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function run() {
  try {
    const newsCollection = client.db("techNews").collection("news");

    app.get("/news", async (req, res) => {
      const allNews = await newsCollection.find({}).toArray();
      res.send(allNews);
    });

    app.get("/news/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const aNews = await newsCollection.findOne(query);
      res.send(aNews);
    });

    app.post("/news", async (req, res) => {
      const newsData = req.body;
      const result = await newsCollection.insertOne(newsData);
      res.send(result);
    });

    app.patch("/news/:id", async (req, res) => {
      const newsData = req.body;
      const id = req.params.id
      const updateDoc = { $set: { ...newsData } };
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      //console.log(newsData, filter)
      const result = await newsCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    });

    app.delete("/news/:id", async (req, res) => {
      const id = req.params.id;
      const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });
  } catch (error) {
    console.log("ERROR: ", error);
  }
}

app.get("/", (req, res) => {
  res.send("Tech news Server is working");
});

app.listen(port, () => {
  console.log("Tech news is running on port", port);
});

run();
