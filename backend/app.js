const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const uri = "mongodb://localhost:27017"; // MongoDB connection URI
const client = new MongoClient(uri);
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
let db, collection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Access the database and collection
    db = client.db("JSWhiteboard");
    collection = db.collection("dailySaves");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();

// POST endpoint to save objects
app.post("/api/save-object", async (req, res) => {
  try {
    const receivedObject = req.body; // Extract data sent from the frontend
    console.log("Received object:", receivedObject);

    // Insert the object into MongoDB
    const result = await collection.insertOne(receivedObject);
    console.log("Document inserted:", result);

    res.json({ message: "Object saved successfully!", object: receivedObject });
  } catch (err) {
    console.error("Error saving object:", err);
    res
      .status(500)
      .json({ message: "Failed to save object.", error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully close MongoDB connection on process exit
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
