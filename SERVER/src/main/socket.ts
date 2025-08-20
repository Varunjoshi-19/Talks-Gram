import { Server as httpServer } from "http";
import io, { Socket, Server as SocketServer } from "socket.io";
import { autoInjectable } from "tsyringe";
import { CacheService } from "../services/Others/OtherServices";
import { notificationPayload } from "../interfaces";
import { onlineUsers } from "../index";

interface socketToUserPayload {
    username: string;
    userId: string;
}

interface userToSocketIdPayload {
    username: string;
    socketId: string;
}

@autoInjectable()
class SocketConnection {

    private httpModel: httpServer | null;
    private socketModel: SocketServer | null;
    private socketToUserId: Map<string, socketToUserPayload> | null;
    private userIdToSocketId: Map<string, userToSocketIdPayload> | null;

    constructor(private cacheService: CacheService) {
        this.cacheService = cacheService;
        this.httpModel = null;
        this.socketModel = null;
        this.socketToUserId = new Map();
        this.userIdToSocketId = new Map();

    }

    establishConnection(http: httpServer) {
        this.httpModel = http;

        this.socketModel = new SocketServer(this.httpModel, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,

            },
            maxHttpBufferSize: 1e8,

        });


        this.socketModel.on("connection", (socket: Socket) => {

            this.socketModel?.to(socket.id).emit("connDetailsReq");

            this.initSocketHandler(socket);

        })

    }

    initSocketHandler(socket: Socket) {

        socket.on("connectionDetails", (data) => {
            this.sendConnectionDetails(socket, data);

        })

        socket.on("seen-chat", (chatId) => {
            socket.join(chatId);
        });

        socket.on("new-chat", (message) => {

            const info: any = {
                senderUsername: message.senderUsername,
                receiverUsername: message.receiverUsername,
                chatId: message.chatId,
            };

            if (message.chat) info.chat = message.chat;

            if (message.AdditionalInfoData) {
                info.AdditionalInfoData = message.AdditionalInfoData;
            }

            if (message.audioData) {
                info.audioData = message.audioData;
            }

            if (message.sharedContent) {
                info.sharedContent = message.sharedContent;
                info.userId = message.userId;
                info.otherUserId = message.otherUserId;
                info.initateTime = message.initateTime;
                info.senderUsername = message.senderUsername;
                info.receiverUsername = message.receiverUsername;
            }


            this.socketModel?.to(message.chatId).emit("chat-receive", info);
        });

        socket.on("new-message", (message) => {
            const { receiverId } = message;
            const socket1: any = this.userIdToSocketId?.get(receiverId);
            this.socketModel?.to(socket1?.socketId).emit("new-message", message);

        })

        socket.on("follow-request", (userData) => {

            this.handleSendRequest(userData, socket)

        });

        socket.on("offline", (userId) => {
            if (onlineUsers.has(userId)) {
                onlineUsers.delete(userId);
                socket.broadcast.emit("offline", userId);
            }

        })

        socket.on("online", (data) => {
            const { userId, username } = data;
            onlineUsers.set(userId, username);
            socket.broadcast.emit("user-online", userId);
        })

        socket.on("disconnect", () => {
            this.handleWhenUserDisconnects(socket, socket.id);
        });

    }

    handleSendRequest(userData: notificationPayload, socket: Socket) {

        const { receiverUserID }: notificationPayload = userData;
        const valid: boolean = this.cacheService.handleAlreadyNotified(userData);
        if (valid) return;

        const socketId = this.userIdToSocketId?.get(receiverUserID)?.socketId!;
        this.socketModel?.to(socketId).emit("user-follow-request", userData);
        this.cacheService.handleAddNotification(userData);

    }

    sendConnectionDetails(socket: Socket, data: { socketId: string, userId: string, username: string }) {
        const { socketId, userId, username } = data;
        onlineUsers.set(userId, username);
        this.userIdToSocketId?.set(userId, { socketId, username });
        this.socketToUserId?.set(socketId, { userId, username });
        socket.broadcast.emit("online", userId);

    }

    handleWhenUserDisconnects(socket: Socket, socketId: string) {
        const userId: string = this.socketToUserId?.get(socketId)?.userId!;
        this.userIdToSocketId?.get(userId);

        //   removal 
        this.socketToUserId?.delete(socketId);
        onlineUsers.delete(userId);
        this.userIdToSocketId?.delete(userId);
        socket.broadcast.emit("offline", userId);
    }

    CheckUserOnlineStatus(userId: string) {
        const online = onlineUsers.has(userId);
        return { status: 200, onlineStatus: online };

    }

}

export default SocketConnection