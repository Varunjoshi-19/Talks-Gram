import mongoose from "mongoose";
import { injectable } from "tsyringe";

@injectable()
class MongoDBConnection  {

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

    async postgresqlConnection () {
         
    }


}

export default MongoDBConnection ;
