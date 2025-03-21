import { MongoDBClient } from "@/lib/mongodb";

const mongoClient = new MongoDBClient();
const db = mongoClient.getDb();

const usersCollection = db.collection("users");
const eventsCollection = db.collection("events");
const teamsCollection = db.collection("teams");
const organizerCollection = db.collection("organizers");

export {
  usersCollection,
  eventsCollection,
  teamsCollection,
  organizerCollection,
};
