import { autoInjectable } from "tsyringe";
import ReelsServices from "../../services/Reels-services/ReelsServices";
import { Request , Response } from "express";


@autoInjectable()
class ReelsController {
    constructor(private reelsService: ReelsServices) {
        this.reelsService = reelsService;
    }

    handleNewPostUpload = async (req: Request, res: Response) => {
        const { profile, caption } = req.body;
        const postReel = req.file!;
        const result = await this.reelsService!.handleNewPostUpload(profile, caption, postReel);
        res.status(result.status).json(result);
        return 
    };

    handleFetchReels = async (req: Request, res: Response) => {
        const skip = req.query.skip as string;
        const result = await this.reelsService!.handleFetchReels(skip);
        res.status(result.status).json(result);
        return 
    };

    handleAddLikePost = async (req: Request, res: Response) => {
        const { postId, userId } = req.body;
        const result = await this.reelsService!.handleAddLike(postId, userId);
        res.status(result.status).json(result);
        return 
    };

    handleRemoveLikePost = async (req: Request, res: Response) => {
        const { postId, userId } = req.body;
        const result = await this.reelsService!.handleRemoveLike(postId, userId);
        res.status(result.status).json(result);
        return
    };





}
export default ReelsController