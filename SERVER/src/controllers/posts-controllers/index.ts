import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import PostServices from "../../services/posts-services/PostServices";

@autoInjectable()
class PostController {
    constructor(private postServices: PostServices) { }

    handleNewPostUpload = async (req: Request, res: Response) => {
        const { profile, caption } = req.body;
        const postImage = req.file!;
        const result = await this.postServices.handleNewPostUpload(profile, caption, postImage);
        res.status(result.status).json(result);
        return
    };

    handleAddLikePost = async (req: Request, res: Response) => {
        const { postId, userId } = req.body;
        const result = await this.postServices.handleAddLikePost(postId, userId);
        res.status(result.status).json(result);
        return
    };

    handleRemoveLikePost = async (req: Request, res: Response) => {
        const { postId, userId } = req.body;
        const result = await this.postServices.handleRemoveLikePost(postId, userId);
        res.status(result.status).json(result);
        return
    };

    handlePostComment = async (req: Request, res: Response) => {
        const { postId, userId, comment } = req.body;
        const result = await this.postServices.handlePostComment(postId, userId, comment);
        res.status(result.status).json(result);
        return
    };

    handleSharePost = async (req: Request, res: Response) => {
        const id = req.params.id;
        const data = req.body;
        const result = await this.postServices.SharedPost(data, id);
        res.status(result?.status).json(result);
        return;
    }

    handleUploadNewStory = async (req: Request, res: Response) => {

        const data = req.body;
        const storyFile = req.file!;
        const result = await this.postServices.UploadNewStory(data, storyFile);
        res.status(result.status).json({ message: result.success ? "uploaded" : "failed to add story!" });
        return;
    }

    handleAddNewNote = async (req : Request , res : Response) => { 
        const data = req.body;
        const result =  await this.postServices.UploadNewNote(data);
        res.status(result.status).json(result.message);
        return;
    }


}

export default PostController;
