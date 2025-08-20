import { autoInjectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { UserData } from "../interfaces/user";

@autoInjectable()
class UserAuthService {

    constructor() { }

    SaveAuthentication(userdetail: UserData) {

        const accessToken = jwt.sign(userdetail, process.env.SCERET_TOKEN_KEY!);

        return accessToken;

    }


}

export default UserAuthService;