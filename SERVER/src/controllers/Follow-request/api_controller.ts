import { Request, Response } from "express";
import FollowApiServices from "../../services/Follow-Request/api";
import { autoInjectable } from "tsyringe";


@autoInjectable()
class FollowApiController {

    constructor(private followService: FollowApiServices) { }


    fetchAllRequests = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const result = await this.followService.fetchAllRequests(userId);

        if (result.success) {
            res.status(result.status).json({ requests: result.data });
            return 
        }
        res.status(result.status).json({ error: result.message || result.error });
        return 
    };

    fetchAllFollowers = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const followers = await this.followService.fetchAllFollowers(userId);
        res.status(200).json({ followers });
    };

    fetchAllFollowings = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const followings = await this.followService.fetchAllFollowings(userId);
        res.status(200).json({ followings });
    };

}




export default FollowApiController