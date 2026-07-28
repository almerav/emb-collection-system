import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add it to .env.local."
  );
}

const options = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);

const clientPromise: Promise<MongoClient> =
  process.env.NODE_ENV === "development"
    ? global._mongoClientPromise ?? (global._mongoClientPromise = client.connect())
    : client.connect();

export default clientPromise;
