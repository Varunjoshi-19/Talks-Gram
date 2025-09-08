import { autoInjectable } from "tsyringe";
import dbConnection from "../database/connections";
import { Client, Storage, ID, InputFile } from "node-appwrite";
import nodemailer from "nodemailer";
import globalConfig from "../config";
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
        const fileBuffer: any = file.buffer;
        const fileObject = new InputFile(
            Readable.from(file.buffer),
            file.originalname,
            Buffer.byteLength(file.buffer)
        );


        try {
            const result = await storage.createFile(
                bucketId,
                ID.unique(),
                fileObject
            );


            const fileUrl = `${globalConfig.appwriteEndPoint}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${globalConfig.appwriteProjectId}`;

            return {
                imageUrl: fileUrl,
                fileId: result.$id,
                success: true
            };
        } catch (error) {
            console.error("Upload error:", error);
            return {
                message: "Failed to upload file",
                success: false
            };
        }
    }
    async sendOtpEmail(to: string, otp: string) {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: globalConfig.emailUser,
                pass: globalConfig.emailPass,
            },
        });

        const mailOptions = {
            from: '"Talksgram" <no-reply@talksgram.com>',
            to,
            subject: "🔑 Your Talksgram Verification Code",
            html: `
      <div style="font-family: Arial, sans-serif; padding:20px; max-width:500px; margin:auto; border:1px solid #eee; border-radius:10px;">
        <h2 style="color:#4CAF50; text-align:center;">Talksgram</h2>
        <p>Hi there,</p>
        <p>We received a request to verify your account on <b>Talksgram</b>. Use the code below to continue:</p>
        <div style="text-align:center; margin:20px 0;">
          <span style="font-size:24px; letter-spacing:4px; font-weight:bold; background:#f5f5f5; padding:10px 20px; border-radius:8px; display:inline-block;">
            ${otp}
          </span>
        </div>
        <p>This code will expire in <b>10 minutes</b>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <br/>
        <p style="color:#777;">Thanks,<br/>The Talksgram Team</p>
      </div>
    `,
        }

        await transporter.sendMail(mailOptions);

    }


}

export default allHelpServices






