import { autoInjectable } from "tsyringe";
import dbConnection from "../database/connections";
import { Client, Storage, ID } from "appwrite";
import { Readable } from "stream";

@autoInjectable()
class allHelpServices {

    shufflePosts(allPosts: any) {

        for (let i = allPosts.length - 1; i > 0; i--) {

            const randomIndex = Math.floor(Math.random() * (i + 1));

            [allPosts[i], allPosts[randomIndex]] = [allPosts[randomIndex], allPosts[i]];

        }

        return allPosts;
    }



    async handleUploadFile(file: Express.Multer.File, bucketId: string) {

        const connection = new dbConnection();
        const client: Client = connection.getAppWriteConnection();

        const storage = new Storage(client);
        const fileBuffer = file.buffer;

        const fileBlob = new Blob([fileBuffer as any], { type: file.mimetype });
        const fileObject = new File([fileBlob], file.originalname, { type: file.mimetype });

        try {

            const result = await storage.createFile(
                bucketId,
                ID.unique(),
                fileObject
            );

            const url = storage.getFileView(bucketId, result.$id);
            if (!url) {
                return {
                    message: "Failed to upload file",
                    success: false
                }
            }

            return {
                imageUrl: url.toString(),
                fileId: result.$id.toString(),
                success: true
            };


        } catch (error) {
            return {
                message: "Failed to upload file",
                success: true
            };
        }




    };

}

export default allHelpServices






