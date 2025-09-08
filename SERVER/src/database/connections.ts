import mongoose from "mongoose";
import { injectable } from "tsyringe";
import { Client } from "node-appwrite";
import globalConfig from "../config";
@injectable()

class MongoDBConnection {


    #appwriteClient: Client | null;

    constructor() {
        this.#appwriteClient = null
    }


    async mongodbDatabaseConnection() {
        try {
            const connection = await mongoose.connect(process.env.MONGODB_URI!);
            if (!connection) {
                console.log('failed to connect with mongodb!')
                return;
            }
            console.log("Mongodb connected!")
        }
        catch (error) {
            console.error('MONGODB internal connection error', error);

        }


    }

    getAppWriteConnection() {

        if (this.#appwriteClient != null) {
            return this.#appwriteClient;

        }

        this.#appwriteClient = new Client();

        this.#appwriteClient
            .setEndpoint(globalConfig.appwriteEndPoint)
            .setProject(globalConfig.appwriteProjectId)

        return this.#appwriteClient;
    }


}

export default MongoDBConnection;
