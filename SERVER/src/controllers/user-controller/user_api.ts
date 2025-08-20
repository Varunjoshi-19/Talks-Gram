import { autoInjectable } from "tsyringe";
import { Request, Response } from "express";
import UserApiServices from "../../services/user-services/fetch-user-api";
import SocketConnection from "../../main/socket";

@autoInjectable()
class UserApiController {
    constructor(private userApiServices: UserApiServices, private socketApi: SocketConnection) { }



    getIdAndUsername = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const userProfile = await this.userApiServices.handleGetIdAndUsername(id);
            res.status(202).json(userProfile);
            return
        } catch (error: any) {
            res.status(404).json({ error: error.message });
            return
        }
    };

    fetchAllAccounts = async (req: Request, res: Response) => {
        try {
            const email = String(req.query.email);
            const allAccounts = await this.userApiServices.getAllAccounts(email);
            res.status(202).json({ allAccounts });
            return
        } catch (error: any) {
            res.status(400).json({ error: error.message });
            return
        }
    };

    fetchSingleUserProfile = async (req: Request, res: Response) => {

        const id = req.params.id;
        const result = await this.userApiServices.fetchSingleUserProfile(id);

        if (result.success) {
            res.status(result.status).json(result.data);
            return;
        }

        res.status(result.status).json({ error: result.message });
        return
    };

    fetchOnlineStatus = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const status = this.socketApi.CheckUserOnlineStatus(userId);
        res.status(status.status).json({ onlineStatus: status.onlineStatus })
        return;

    }
}

export default UserApiController;
