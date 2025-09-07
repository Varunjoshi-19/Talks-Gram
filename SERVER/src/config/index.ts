import dotenv from "dotenv";
dotenv.config();

const globalConfig = {

    appwriteProjectId: process.env.VITE_APPWRITE_PROJECT_ID!,
    appwriteProjectName: process.env.VITE_APPWRITE_PROJECT_NAME!,
    appwriteEndPoint: process.env.VITE_APPWRITE_ENDPOINT!,
    talksGramBucketId: process.env.VITE_APPWRITE_QUICK_CART_BUCKET_ID!

};

export default globalConfig;

