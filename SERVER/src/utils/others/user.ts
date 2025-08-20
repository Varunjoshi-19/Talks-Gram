import userDoc from "../../models/userDoc";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { autoInjectable } from "tsyringe";
import UserAuthService from "../../authentication/userAuth";
import ProfileDoc from "../../models/ProfileDoc";
import { defaultImagePath } from "../..";



@autoInjectable()
class UserHelper {

    constructor(private userAuthService: UserAuthService) { }

    async checkDuplicacy(username: string, email: string): Promise<string | false> {
        const userWithSameUsername = await userDoc.findOne({ username });
        if (userWithSameUsername) return "username";

        const userWithSameEmail = await userDoc.findOne({ email });
        if (userWithSameEmail) return "email";

        return false;
    }

    async findAccount(key: "username" | "email", value: string) {
        if (key === "username") return await userDoc.findOne({ username: value });
         return await userDoc.findOne({ email: value });
    }

    verifyAndGenerateToken(password: string, user: any): string | null {
        const newHashPassword = crypto
            .createHmac("sha256", user.salting)
            .update(password)
            .digest("hex");

        if (newHashPassword !== user.password) return null;

        const UserData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        return this.userAuthService.SaveAuthentication(UserData);
    }

    async searchUsers(username: string) {
        if (!username || username === "") return [];

        const searchedAccounts = await ProfileDoc.find({
            username: { $regex: new RegExp(username, "i") },
        });

        return searchedAccounts;
    }

    HashedPasswordAndSalting(password: string) {

        const salt = crypto.randomBytes(20).toString("hex");
        const hashpassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

        return { salt, hashpassword };

    }


    getDefaultImage() {

        const imagePath = path.resolve(defaultImagePath);
        const imageBuffer = fs.readFileSync(imagePath);


        return {
            data: imageBuffer,
            contentType: "image/jpeg"
        }
    }



}

export default UserHelper;