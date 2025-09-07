import { injectable } from "tsyringe";
import crypto from "crypto";
import PersonalChatDoc from "../../models/PersonalChatDoc";
import { MessageInfo } from "../../interfaces/user";
import AllHelpServices from "../../utils/index";
import globalConfig from "../../config";


@injectable()
class ChatMessageService {

    constructor(private allHelp: AllHelpServices) {
        this.allHelp = allHelp;
    }

    async savePersonalChat(chatData: any) {
        try {
            const { userId, otherUserId } = chatData;
            const savedChat = await PersonalChatDoc.create({ ...chatData, seenStatus: userId === otherUserId });
            console.log(savedChat);
            return {
                status: 200,
                success: true,
                message: "Chat saved",
                data: savedChat,
            };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error saving chat",
                error: error.message,
            };
        }
    }

    async saveAdditionalData(allData: string, files: Express.Multer.File[]) {
        try {
            const parsedData = JSON.parse(allData);

            const additionalData: any = files.map(async (file) => {
                const data = await this.allHelp.handleUploadFile(file, globalConfig.talksGramBucketId);
                if (data.success) {
                    return {
                        url: data.imageUrl,
                        contentType: file.mimetype
                    }
                }
            });

            const dataToSave: MessageInfo = {
                userId: parsedData.userId,
                otherUserId: parsedData.otherUserId,
                chatId: parsedData.chatId,
                senderUsername: parsedData.senderUsername,
                receiverUsername: parsedData.receiverUsername,
                initateTime: parsedData.initateTime,
                AdditionalData: additionalData,
            };

            const savedData = await PersonalChatDoc.create(dataToSave);
            if (!savedData) {
                return { status: 404, success: false, message: "Failed to save message" };
            }

            return { status: 200, success: true, message: "Message has been saved" };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Server internal error",
                error: error.message,
            };
        }
    }

    async saveAudioMessage(audioData: string, audioFile?: Express.Multer.File) {
        if (!audioFile) {
            return { status: 404, success: false, message: "Audio file missing" };
        }

        try {
            const parsedData = JSON.parse(audioData);
            const data = await this.allHelp.handleUploadFile(audioFile, globalConfig.talksGramBucketId);

            if (!data.success) {
                return { status: 500, success: false, message: "Failed to upload audio file" };
            }

            const fileData: { url: string, contentType: string } = {
                url: data.imageUrl!,
                contentType: "wav",
            };

            const dataToSave: MessageInfo = {
                userId: parsedData.userId,
                otherUserId: parsedData.otherUserId,
                chatId: parsedData.chatId,
                senderUsername: parsedData.senderUsername,
                receiverUsername: parsedData.receiverUsername,
                initateTime: parsedData.initateTime,
                AdditionalData: [fileData],
            };

            const savedData = await PersonalChatDoc.create(dataToSave);
            if (!savedData) {
                return { status: 404, success: false, message: "Failed to save message" };
            }

            return { status: 200, success: true, message: "Audio message saved" };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Server internal error",
                error: error.message,
            };
        }
    }

    async toogleAllSeenChats(senderId: string, receiverId: string) {
        try {
            const data = await PersonalChatDoc.updateMany(
                {
                    userId: senderId,
                    otherUserId: receiverId,
                    seenStatus: false
                },
                {
                    $set: { seenStatus: true }
                }
            );

            return { status: 200, success: true, message: "seen all chats!" };
        } catch (error) {
            return { status: 505, success: false, error: error }
        }



    }

    generateChatId(mixedId: string): string {
        return crypto.createHmac("sha256", process.env.CHAT_KEY as string).update(mixedId).digest("hex");
    }
}

export default ChatMessageService;
