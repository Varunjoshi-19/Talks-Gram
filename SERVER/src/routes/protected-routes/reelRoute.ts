import { Router } from "express";
import ReelsController from "../../controllers/Reels-controller/reels";
import multer, { memoryStorage, Multer } from "multer";
import RenderController from "../../controllers/others/render";
import { autoInjectable } from "tsyringe";


@autoInjectable()
class ReelsRoutes {

    private router: Router;
    private upload: Multer;
    constructor(private reelsController: ReelsController,
               private  renderController : RenderController
    ) {
        this.router = Router();
        this.reelsController = reelsController;
        this.upload = multer({ storage: memoryStorage() });
    }

    getRoutes(): Router {


        this.router.post("/newReel", this.upload.single("postReel"), this.reelsController.handleNewPostUpload.bind(this.reelsController));
        this.router.post("/fetch-reels", this.reelsController.handleFetchReels.bind(this.reelsController));
        this.router.post("/remove-likePost", this.reelsController.handleRemoveLikePost.bind(this.reelsController));
        this.router.post("/add-likePost", this.reelsController.handleAddLikePost.bind(this.reelsController));
        this.router.get("/render-reel/:id", this.renderController.handleRenderReel.bind(this.renderController));



        return this.router;
    }



}


export default ReelsRoutes;

