import { injectable } from "tsyringe";
import ProfileDoc from "../../models/ProfileDoc";
import crypto from "crypto";
import userDoc from "../../models/userDoc";
import UserHelper from "../../utils/others/user";

@injectable()
class UserService {

    constructor(private userHelper: UserHelper) { }


    async login(body: { username?: string; email?: string; password: string }) {
        const { username, email, password } = body;

        if (!password) return { status: 400, success: false, message: "Password is required" };
        if (!username && !email)
            return { status: 400, success: false, message: "Username or email is required" };

        const key = username ? "username" : "email";
        const value = username || email;

        const user = await this.userHelper.findAccount(key as any, value as string);
        if (!user) return { status: 404, success: false, message: "Invalid username or email" };
        const id = user?._id;
        const profile = await ProfileDoc.findOne({ userAccId: id }).select("_id username email fullname post bio followers following").lean();

        const token = this.userHelper.verifyAndGenerateToken(password, user);
        if (!token) return { status: 400, success: false, message: "Incorrect password" };

        return {
            status: 200,
            success: true,
            data: {
                message: "Login successful",
                accessToken: token,
                profile: profile
            },
        };
    }

    async signup(body: any) {
        const { username, fullname, email, password } = body;
        if (!username || !fullname || !email || !password) {
            return { status: 400, success: false, message: "All fields are required" };
        }

        try {
            const duplicate = await this.userHelper.checkDuplicacy(username, email);
            if (duplicate)
                return { status: 400, success: false, message: `${duplicate} already exists` };

            const salt = crypto.randomBytes(16).toString("hex");
            const hashpassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

            const userData = {
                username,
                fullname,
                email,
                password: hashpassword,
                salting: salt,
            };

            const newAccount = await userDoc.create(userData);

            const defaultImage = this.userHelper.getDefaultImage();

            const profileData = {
                userAccId: newAccount._id,
                username,
                fullname,
                email,
                profileImage: defaultImage,
            };

            const userProfile = await ProfileDoc.create(profileData);

            return {
                status: 201,
                success: true,
                data: {
                    message: "Signup successful",
                    user: newAccount,
                },
            };


        }
        catch (error: any) {
            return {
                status: 505,
                success: false,
                data: {
                    message: "Internal Error",
                }
            }


        }
    }

    async updateProfile(id: string, data: any, file?: Express.Multer.File) {
        const NewProfileData: any = {};

        if (data.fullname) {
            if (data.fullname === "") throw new Error("Full name cannot be empty");
            NewProfileData.fullname = data.fullname;
        }

        if (data.username) {
            if (data.username === "") throw new Error("Username cannot be empty");
            NewProfileData.username = data.username;

            const existingUser = await this.userHelper.findAccount("username", data.username);
            if (existingUser) throw new Error(`Username ${data.username} already exists`);
        }

        if (data.bio) {
            NewProfileData.bio = data.bio;
        }

        if (file) {
            NewProfileData.profileImage = {
                data: file.buffer,
                contentType: file.mimetype,
            };
        }

        const existingDetails = await ProfileDoc.findById(id);
        if (!existingDetails) throw new Error("Profile not found");

        const existingUsername = existingDetails.username;

        await userDoc.findOneAndUpdate(
            { username: existingUsername },
            {
                username: NewProfileData.username,
                fullname: NewProfileData.fullname,
            },
            { new: true }
        );

        const updatedProfile = await ProfileDoc.findByIdAndUpdate(id, NewProfileData, {
            new: true,
        });

        return updatedProfile;
    }

}


export default UserService;