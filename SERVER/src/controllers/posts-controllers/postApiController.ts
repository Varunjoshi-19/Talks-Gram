import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import PostsApiServices from "../../services/posts-services/posts_api";
import NoteDoc from "../../models/NoteDoc";

@autoInjectable()
class PostsApiController {

    constructor(private postsApiServices: PostsApiServices) { }

    fetchAllComments = async (req: Request, res: Response) => {

        const result = await this.postsApiServices.fetchAllComments(req.params.id);
        if (!result.success) {
            res.status(result.status).json({ message: result.message });
            return
        }
        res.status(result.status).json({ comments: result.data });
    };

    fetchPosts = async (req: Request, res: Response) => {
        const skip = parseInt(req.query.skip as string) || 0;
        const result = await this.postsApiServices.fetchPosts(skip);
        if (!result.success) {
            res.status(result.status).json({ message: result.message });
            return
        }
        res.status(result.status).json({ shuffledPosts: result.data });
    };

    fetchLikedPost = async (req: Request, res: Response) => {
        const { postId, userId } = req.body;
        const result = await this.postsApiServices.fetchLikedPost(postId, userId);
        if (!result.success) {
            res.status(result.status).json({ message: result.message });
            return
        }
        res.status(result.status).json({ likeStatus: result.likeStatus });
    };

    fetchAllPosts = async (req: Request, res: Response) => {
        const result = await this.postsApiServices.fetchAllPosts(req.params.id);
        if (!result.success) {
            res.status(result.status).json({ message: result.message });
            return
        }
        res.status(result.status).json({ allPosts: result.data });
    };

    fetchSinglePost = async (req: Request, res: Response) => {

        const id = req.params.id;
        const result = await this.postsApiServices.handlefetchUserPost(id);
        res.status(result.status).json({ post: result.post });
        return;
    }

    fetchAllStories = async (req: Request, res: Response) => {
        const result = await this.postsApiServices.handleFetchAllStories();
        res.status(result.status).json(result.success ? result.data : result.message);

    }

    handleGetUploadedStory = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.postsApiServices.fetchStory(id);
        res.status(result?.status).json(result.success ? result.data : result?.message)
        return;
    }

    handleGetNote = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.postsApiServices.fetchSingleNote(id);
        res.status(result.status).json(result.success ? result.data : result.message);
        return;
    }

    handleRemoveStory = async (req: Request, res: Response) => {
        const id = req.params.id;
        const result = await this.postsApiServices.removeStory(id);
        res.status(result.status).json(result.message);
        return;
    }
}

export default PostsApiController;
