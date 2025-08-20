import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import FollowService from "../../services/Follow-Request/index"

@autoInjectable()
class FollowController {
    constructor(private followService: FollowService) { }

    handleFollowRequest = async (req: Request, res: Response) => {
        const { userId, userIdOf, usernameOf } = req.body;
        const result = await this.followService.handleFollowRequest(userId, userIdOf, usernameOf);
        res.status(result.status).json({ status: result.message });
        return
    };

    checkExistsInFollower = async (req: Request, res: Response) => {
        const { userId, userIdOf } = req.body;
        if (!userId || !userIdOf) {
            res.status(404).json({ error: "id's required" });
            return
        }

        const result = await this.followService.checkExistsInFollower(userId, userIdOf);
        if (result.error) {
            res.status(404).json({ error: result.error });
            return
        }
        res.status(result.status).json({ status: result.statusText });
        return
    };

    checkAlreadyRequested = async (req: Request, res: Response) => {
        const { userId, userIdOf } = req.body;
        if (!userId || !userIdOf)  {
            res.status(404).json({ error: "id required" });
            return 
        }

        const result = await this.followService.checkAlreadyRequested(userId, userIdOf);
        if (result.error) {
            res.status(404).json({ error: result.error });
            return
        }
        res.status(result.status).json({ status: result.statusText });
        return
    };

    handleRemoveRequested = async (req: Request, res: Response) => {
        const { userId, userIdOf } = req.body;

        const result = await this.followService.handleRemoveRequested(userId, userIdOf);
        if (result.error) {
            res.status(505).json({ error: result.error });
            return
        }

        res.status(result.status).json({ message: result.message, status: result.statusText });
        return
    };

    handleAcceptedRequest = async (req: Request, res: Response) => {
        const { userId, userIdOf, usernameOf } = req.body;

        const result = await this.followService.handleAcceptedRequest(userId, userIdOf, usernameOf);
        if (result.success) {
            res.status(result.status).json({ message: result.message });
            return
        }
        res.status(result.status).json({ error: result.message || result.error });
        return
    };

    handleRemoveFollower = async (req: Request, res: Response) => {
        const { userId, userIdOf } = req.body;

        const result = await this.followService.handleRemoveFollower(userId, userIdOf);
        if (result.success) {
            res.status(result.status).json({ status: result.statusText });
            return
        }
        res.status(result.status).json({ error: result.error || result.statusText });
        return
    };


}

export default FollowController;
