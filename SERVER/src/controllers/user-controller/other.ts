import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import UserHelper from "../../utils/others/user";

@autoInjectable()
class UserHelperController {
    constructor(private userHelper: UserHelper) { }

    checkDuplicacy = async (req: Request, res: Response) => {
        try {
            const { username, email } = req.body;

            if (!username || !email) {
                return res.status(400).json({ error: "Username and email are required" });
            }

            const result = await this.userHelper.checkDuplicacy(username, email);
            if (result) {
                return res.status(409).json({ error: `${result} already exists` });
            }

            return res.status(200).json({ message: "No duplicacy found" });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    findAccount = async (req: Request, res: Response) => {
        try {
            const { username, email } = req.query;
            if (!username && !email) {
                return res.status(400).json({ error: "Username or email required" });
            }

            const key = username ? "username" : "email";
            const value = String(username || email);
            const user = await this.userHelper.findAccount(key as any, value);

            if (!user) return res.status(404).json({ error: "User not found" });

            return res.status(200).json({ user });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    };

    searchUsers = async (req: Request, res: Response) => {
        try {
            const { username } = req.query;
            const searchedAccounts = await this.userHelper.searchUsers(String(username));
            if (!searchedAccounts || searchedAccounts.length === 0) {
                 res.status(404).json({ message: "No users found" });
                 return
            }

            res.status(200).json({ searchedAccounts });
            return
        } catch (error: any) {
            res.status(500).json({ error: error.message });
            return 
        }
    };

    getDefaultImage = async (_req: Request, res: Response) => {
        try {
            const image = this.userHelper.getDefaultImage();
            res.contentType(image.contentType);
            res.status(200).send(image.data);
        } catch (error: any) {
            res.status(500).json({ error: "Image not found or failed to load" });
        }
    };
}

export default UserHelperController;
