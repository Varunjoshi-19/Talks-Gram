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
                .select("chatId userId otherUserId senderUsername receiverUsername initateTime chat seenStatus sharedContent AdditionalData")
                .populate("sharedContent.userId", "username profileImage")
                .populate("sharedContent.postId", "createdAt postLike postImage")
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
                .select("chatId userId otherUserId  initateTime seenStatus chat")
                .sort({ initateTime: -1 })
                .populate("userId", "username profileImage")
                .populate("otherUserId", "username profileImage");

            const uniqueUser = new Map<string, ChattedUserPayload>();

            users.forEach((each: any) => {
                const isSender = each.userId._id.toString() === userId.toString();
                const otherUser = isSender ? each.otherUserId : each.userId;

                if (!uniqueUser.has(otherUser._id.toString())) {
                    uniqueUser.set(otherUser._id.toString(), {
                        chatId: each.chatId,
                        userId: otherUser._id.toString(),
                        yourMessage: isSender,
                        checkName: each.userId.username,
                        username: otherUser.username ?? "Unknown",
                        profileImage: otherUser.profileImage.url ?? null,
                        initateTime: each.initateTime,
                        seenStatus: each.seenStatus,
                        unseenCount: 0,
                        recentChat: each.chat ?? "",
                    });
                }


                if (each.otherUserId._id.toString() === userId.toString() && !each.seenStatus) {
                    const senderId = each.userId._id.toString();
                    const user = uniqueUser.get(senderId);
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
