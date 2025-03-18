import { MongoClient } from "mongodb";

export class MongoDBClient {
    private uri: string|null;
    private dbName: string;
    private client: MongoClient;
    constructor() {
        this.uri = process.env.MONGODB_URI!;
        if (!this.uri) {
            throw new Error("MONGODB_URI is not set");
        }
        this.dbName = process.env.DBNAME || "test";
        this.client = new MongoClient(this.uri, {});
    }
    async init() {
        console.log("[database]: connecting to mongodb...");
        try {
            await this.client.connect();
            console.log('[database]: connected to db');
        } catch (error) {
            console.log(`[database Error]: Could not connect to db ${error}`);
        }
    }
    getDb() {
        return this.client.db(this.dbName);
    }
    getCollection(collectionName:string) {
        return this.getDb().collection(collectionName);
    }
    close() {
        this.client.close();
    }
}
