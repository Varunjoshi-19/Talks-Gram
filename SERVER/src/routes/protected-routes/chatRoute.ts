import { Router } from "express";
import { autoInjectable } from "tsyringe";
import FollowApiController from "../../controllers/Follow-request/api_controller"
import FollowController from "../../controllers/Follow-request/index"
import ChatApiController from "../../controllers/chats/apiController"
import ChatController from "../../controllers/chats/index"
import UserApiController from "../../controllers/user-controller/user_api";
import multer, { memoryStorage } from "multer";
import RenderController from "../../controllers/others/render";



@autoInjectable()
export class ChatRoutes {
    private router;
    private upload;
    constructor(
        private userApiController: UserApiController,
        private chatController: ChatController,
        private chatApiController: ChatApiController,
        private followapiController: FollowApiController,
        private followController: FollowController,
        private renderController: RenderController
    ) {
        this.router = Router();
        this.upload = multer({ storage: memoryStorage() })

    }

    getRoutes(): Router {

        this.router.get("/generate-chatId/:id", this.chatController.generateChatId.bind(this.chatController));
        this.router.post("/fetch-all-personal-chats/:id", this.chatApiController.fetchAllChats.bind(this.chatApiController));
        this.router.get("/generate-chatId/:id", this.chatController.generateChatId.bind(this.chatController));
        this.router.get("/fetchUser/:id", this.userApiController.fetchSingleUserProfile.bind(this.userApiController));
        this.router.post("/save-personal-chats", this.chatController.saveChat.bind(this.chatController));
        this.router.post("/fetch-chatted-users/:id", this.chatApiController.fetchChattedUsers.bind(this.chatApiController));
        this.router.post("/SendFollowRequest", this.followController.handleFollowRequest.bind(this.followController));
        this.router.post("/checkRequested", this.followController.checkAlreadyRequested.bind(this.followController));
        this.router.post("/checkFollowed", this.followController.checkExistsInFollower.bind(this.followController));
        this.router.post("/removeFromRequested", this.followController.handleRemoveRequested.bind(this.followController));
        this.router.post("/AcceptedRequest", this.followController.handleAcceptedRequest.bind(this.followController));
        this.router.post("/removeFollower", this.followController.handleRemoveFollower.bind(this.followController));
        this.router.post("/fetchRequests/:id", this.followapiController.fetchAllRequests.bind(this.followapiController));
        this.router.post("/additionalInfo-message", this.upload.array("files", 10), this.chatController.saveAdditionalData.bind(this.chatController));
        this.router.post("/audioDataInfo-message", this.upload.single("audioFile"), this.chatController.saveAudioMessage.bind(this.chatController))
        this.router.get("/render-message-items/:id1/:id2", this.renderController.renderMessageItem.bind(this.renderController));


        this.router.post("/seen-chats/:id1/:id2", this.chatController.handleSeenChats.bind(this.chatController));


        return this.router;
    }
}
