import { Router } from "express";
import { autoInjectable } from "tsyringe";
import multer, { memoryStorage } from "multer";
import UserController from "../../controllers/user-controller/user";
import UserApiController from "../../controllers/user-controller/user_api";
import OtpService from "../../controllers/validation-controller/validation";
import CommunicationController from "../../controllers/others/communication";
import UserHelperController from "../../controllers/user-controller/other";
import RenderController from "../../controllers/others/render";


@autoInjectable()
class UserRoutes {
    constructor(private userController: UserController,
        private userapiController: UserApiController,
        private userValidation: OtpService,
        private commController: CommunicationController,
        private userHelperController: UserHelperController,
        private renderController: RenderController

    ) { }

    getRoutes(): Router {
        const router = Router();
        const upload = multer({ storage: memoryStorage() });

        router.post("/update-profile", upload.single("profileImage"), this.userController.newProfileHandler.bind(this.userController));
        router.post("/login", this.userController.login.bind(this.userController));
        router.post("/signup", this.userController.signup.bind(this.userController));

        router.get("/fetch-profile-details/:id", this.userapiController.fetchSingleUserProfile.bind(this.userapiController));
        router.get("/getIdAndUsername/:id", this.userapiController.getIdAndUsername.bind(this.userapiController));

        router.get("/allAccounts", this.userapiController.fetchAllAccounts.bind(this.userapiController));
        router.post("/sendOtp", this.userValidation.generateOTP.bind(this.userValidation));
        router.post("/verifyOtp", this.userValidation.verifyOTP.bind(this.userValidation));
        router.post("/resetPassword", this.userValidation.resetPassword.bind(this.userValidation));
        router.post("/valid-password-reset/:id1/:id2", this.userValidation.checkValidParams.bind(this.userValidation));

        router.post("/searchUser", this.userHelperController.searchUsers.bind(this.userHelperController));
        router.get("/fetch/:id", this.commController.fetchCommunicationId.bind(this.commController));
        router.post("/add/:id", this.commController.addCommId.bind(this.commController));

        router.get("/user-online-status/:id", this.userapiController.fetchOnlineStatus.bind(this.userapiController));


        router.get("/profileImage/:id", this.renderController.renderImage.bind(this.renderController));


        return router;
    }
}

export default UserRoutes;