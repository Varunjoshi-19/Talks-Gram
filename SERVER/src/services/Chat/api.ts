import { injectable } from "tsyringe";
import PersonalChatDoc from "../../models/PersonalChatDoc";
import { ChattedUserPayload } from "../../interfaces";

@injectable()
class ChatApiServices {


    async fetchAllPersonalChats(chatId: string, chatSkip: number) {
        try {
            const limit = 10;
            let chats = await PersonalChatDoc.find({ chatId })
                .sort({ initateTime: -1 })
                .skip(chatSkip)
                .limit(limit)
                .select("chatId userId otherUserId senderUsername receiverUsername initateTime chat seenStatus sharedContent AdditionalData._id AdditionalData.contentType")
                .lean();


            chats = chats.reverse();

            if (!chats || chats.length === 0) {
                return {
                    status: 202,
                    success: false,
                    message: "No messages available",
                };
            }

            return {
                status: 200,
                success: true,
                data: chats,
            };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error fetching chats",
                error: error.message,
            };
        }
    }

    async fetchChattedUsers(userId: string) {
        try {
            const users: any = await PersonalChatDoc.find({
                $or: [
                    { userId: userId },
                    { otherUserId: userId }
                ]
            })
                .select("chatId userId otherUserId senderUsername receiverUsername initateTime seenStatus chat")
                .sort({ initateTime: -1 });

            const uniqueUser = new Map<string, ChattedUserPayload>();

            users.forEach((each: any) => {

                const id = userId === each.userId ? each.otherUserId : each.userId;
                const name = userId === each.userId ? each.receiverUsername : each.senderUsername;


                if (!uniqueUser.has(id)) {
                    const entry: ChattedUserPayload = {
                        chatId: each.chatId,
                        userId: id,
                        yourMessage: userId === each.userId,
                        checkName: each.senderUsername,
                        username: name ?? "Unknown",
                        initateTime: each.initateTime,
                        seenStatus: each.seenStatus,
                        unseenCount: 0,
                        recentChat: each.chat ?? "",
                    };
                    uniqueUser.set(id, entry);
                }

                if (each.otherUserId === userId && !each.seenStatus) {
                    const otherUid = each.userId;
                    const user = uniqueUser.get(otherUid);
                    if (user) user.unseenCount++;
                }
            });



            return {
                status: 200,
                success: true,
                data: Array.from(uniqueUser.entries())
            };

        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error fetching users",
                error: error.message,
            };
        }
    }





}

export default ChatApiServices;
