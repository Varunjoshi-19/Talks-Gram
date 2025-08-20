import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import ChatMessageService from "../../services/Chat/index";

@autoInjectable()
class ChatMessageController {
    constructor(private chatService: ChatMessageService) { }

    saveChat = async (req: Request, res: Response) => {
        const result = await this.chatService.savePersonalChat(req.body);
        res.status(result.status).json(result.success ? { ...result } : { error: result.message });
        return
    };

    saveAdditionalData = async (req: Request, res: Response) => {
        const { allData } = req.body;
        const result = await this.chatService.saveAdditionalData(allData, req.files as Express.Multer.File[]);
        res.status(result.status).json(result.success ? { message: result.message } : { error: result.message });
        return
    };

    saveAudioMessage = async (req: Request, res: Response) => {
        const { audioData } = req.body;
        const result = await this.chatService.saveAudioMessage(audioData, req.file as Express.Multer.File);
        res.status(result.status).json(result.success ? { message: result.message } : { error: result.message });
        return
    };

    handleSeenChats = async (req: Request, res: Response) => {
        const { id1, id2 } = req.params;
        const result = await this.chatService.toogleAllSeenChats(id1, id2);
        res.status(result.status).json(result.success ? { message: result.message } : { error: result.error });

    }

    generateChatId = (req: Request, res: Response) => {
        const chatId = this.chatService.generateChatId(req.params.id);
        res.status(202).json({ chatId });
        return
    };
}

export default ChatMessageController;
