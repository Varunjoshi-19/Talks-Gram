import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import ChatApiServices from "../../services/Chat/api";

@autoInjectable()
class ChatApiController {
    constructor(private chatService: ChatApiServices) { }

    fetchAllChats = async (req: Request, res: Response) => {
        const chatId = req.params.id;
        const chatSkip = Number(req.query.chatSkip) || 0;
        const result = await this.chatService.fetchAllPersonalChats(chatId, chatSkip);
        res.status(result.status).json(result.success ? result.data : { error: result.message });
        return;
    };

    fetchChattedUsers = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const result = await this.chatService.fetchChattedUsers(userId);
        res.status(result.status).json(result.success ? result.data : { error: result.message });
        return;
    };
}

export default ChatApiController;
