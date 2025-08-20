import { autoInjectable } from "tsyringe";
import { Request, RequestHandler, Response } from "express";
import UserService from "../../services/user-services/UserServices";
import UserHelper from "../../utils/others/user";

@autoInjectable()

class UserController {
    constructor(private userService: UserService, private userHelper: UserHelper) { }


    login: RequestHandler = async (req, res) => {
        try {
            const result = await this.userService.login(req.body);
            res.status(result.status).json(result.success ? { data : result.data} : { error: result.message });
            return;
        } catch (err: any) {
            res.status(500).json({ error: err.message });
            return;
        }
    };

    signup: RequestHandler = async (req, res) => {
        try {
            const result = await this.userService.signup(req.body);
            res.status(result.status).json(result.success ? result.data : { error: result.message });
            return;
        } catch (err: any) {
            res.status(500).json({ error: err.message });
            return;
        }
    };

    newProfileHandler: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            const updatedProfile = await this.userService.updateProfile(id, req.body, req.file);
            res.status(200).json({ message: "Profile Updated Successfully", updatedProfile });
            return;
        } catch (error: any) {
            res.status(400).json({ error: error.message });
            return;
        }
    };




}

export default UserController;