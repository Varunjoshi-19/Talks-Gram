import { Router } from "express";
import multer, { memoryStorage, Multer } from "multer";
import PostController from "../../controllers/posts-controllers";
import PostsApiController from "../../controllers/posts-controllers/postApiController";
import RenderController from "../../controllers/others/render";
import { autoInjectable } from "tsyringe";

@autoInjectable()
class PostRouter {

    private router: Router;
    private upload: Multer;
    constructor(
        private postController: PostController,
        private postApiController: PostsApiController,
        private renderController: RenderController
    ) {
        this.router = Router();
        this.upload = multer({ storage: memoryStorage(), limits: { fieldSize: 100 * 1024 * 1024 } })
    }

    getRoutes(): Router {

        this.router.post("/allPosts/:id", this.postApiController.fetchAllPosts.bind(this.postApiController));
        this.router.post("/fetchPosts", this.postApiController.fetchPosts.bind(this.postApiController));
        this.router.post("/newPost", this.upload.single('postImage'), this.postController.handleNewPostUpload.bind(this.postController));
        this.router.post("/fetchLikePost", this.postApiController.fetchLikedPost.bind(this.postApiController));
        this.router.post("/add-likePost", this.postController.handleAddLikePost.bind(this.postController));
        this.router.post("/remove-likePost", this.postController.handleRemoveLikePost.bind(this.postController));
        this.router.post("/add-comment", this.postController.handlePostComment.bind(this.postController));
        this.router.post("/fetch-comments/:id", this.postApiController.fetchAllComments.bind(this.postApiController));

        this.router.post("/share-post/:id", this.postController.handleSharePost.bind(this.postController));
        this.router.post("/share-story", this.upload.single("file"), this.postController.handleUploadNewStory.bind(this.postController));
        this.router.post("/new-note" , this.upload.none(), this.postController.handleAddNewNote.bind(this.postController));

        this.router.get("/fetch-single-post/:id", this.postApiController.fetchSinglePost.bind(this.postApiController))
        this.router.get("/fetch-all-stories", this.postApiController.fetchAllStories.bind(this.postApiController))
        this.router.get("/fetch-story/:id", this.postApiController.handleGetUploadedStory.bind(this.postApiController));
        this.router.get("/fetch-note/:id" , this.postApiController.handleGetNote.bind(this.postApiController));
        this.router.delete("/remove-story/:id" , this.postApiController.handleRemoveStory.bind(this.postApiController));
        
        this.router.get("/postImage/:id", this.renderController.renderPostImage.bind(this.renderController));
        this.router.get("/render-story/:id", this.renderController.RenderStory.bind(this.renderController));
        // router.post("/deletePost", );  // TODO LATER

        return this.router;
    }



}


export default PostRouter