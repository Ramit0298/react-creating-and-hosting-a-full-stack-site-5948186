import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

// Run mongod in the background to start the MongoDB server
// It starts up the Mongo DB server on port 27017 (Mongo Daemon)
// Run mongosh in another terminal to start the MongoDB shell
// It connects to the MongoDB server on port 27017 (Mongo Shell)

// const articleInfo = [
//   {
//     name: "learn-react",
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: "learn-node",
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: "mongodb",
//     upvotes: 0,
//     comments: [],
//   },
// ];

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello World! (GET)");
});

app.get("/hello/:name", (req, res) => {
  const { name } = req.params;
  res.send(`Hello World! (GET) ${name}`);
});

app.post("/hello", (req, res) => {
  res.send(`Hello World! (POST) ${req.body.name}`);
});

let db;

async function connectToDB() {
  const uri = !process.env.MONGODB_USERNAME
    ? "mongodb://127.0.0.1:27017"
    : `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.3orsmno.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  db = client.db("full-stack-react-db");
}

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const article = await db.collection("articles").findOne({ name });
  res.json(article);
});

// Middleware to check if the user is authenticated
app.use(async function (req, res, next) {
  const { authtoken } = req.headers;

  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken);
    req.user = user;
    next();
  } else {
    res.sendStatus(400);
  }
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const canUpvote = uid && !upvoteIds.includes(uid);

  if (canUpvote) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      { name },
      {
        $inc: { upvotes: 1 },
        $push: { upvoteIds: uid },
      },
      {
        returnDocument: "after",
      }
    );

    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

// Create request to downvote articles
// This endpoint is used to downvote an article
app.post("/api/articles/:name/downvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const canDownvote = uid && upvoteIds.includes(uid);

  if (canDownvote) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      { name },
      {
        $inc: { upvotes: -1 },
        $pull: { upvoteIds: uid },
      },
      {
        returnDocument: "after",
      }
    );

    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const newComment = { postedBy, text };

  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const commentIds = article.commentIds || [];
  const canAddComment = uid && !commentIds.includes(uid);

  if (canAddComment) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      { name },
      {
        $push: { comments: newComment, commentIds: uid },
      },
      {
        returnDocument: "after",
      }
    );

    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

// Create request to delete comments
// This endpoint is used to delete a comment from an article
app.delete("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const newComment = { postedBy, text };

  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const commentIds = article.commentIds || [];
  const canDeleteComment = uid && commentIds.includes(uid);

  if (canDeleteComment) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      { name },
      {
        $pull: { comments: newComment, commentIds: uid },
      },
      {
        returnDocument: "after",
      }
    );

    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

// Create request to upvote or downvote comments

const PORT = process.env.PORT || 8000;

async function start() {
  await connectToDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();
