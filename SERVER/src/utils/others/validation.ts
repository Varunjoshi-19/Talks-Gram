import { injectable } from "tsyringe";
import crypto from "crypto";
import Userdoc from "../../models/userDoc";
import UserHelper from "./user";

const otps: Record<string, { OTP: number; expires: number }> = {};

@injectable()
class OtpService {

    constructor(private userHelper: UserHelper) {
        this.userHelper = userHelper;
    }


    async generateOTP(email: string) {
        if (!email) throw new Error("Email is required");

        const user = await Userdoc.findOne({ email });
        if (!user) throw new Error("Invalid email");

        const OTP = Math.floor(Math.random() * 90000) + 10000;
        const userId = user._id.toString();

        otps[userId] = {
            OTP,
            expires: Date.now() + 20 * 1000,
        };

        return { userId, OTP };
    }

    async verifyOTP(userId: string, enteredOTP: number) {
        const data = otps[userId];
        if (!data) throw new Error("Invalid OTP, request a new one.");
        if (Date.now() > data.expires) throw new Error("OTP expired, try again later.");
        if (data.OTP != enteredOTP) throw new Error("Wrong OTP");

        delete otps[userId];

        const keyId = crypto
            .createHmac("sha256", process.env.OTP_KEY!)
            .update(userId)
            .digest("base64");

        return keyId;
    }

    async resetPassword(keyId: string, userId: string, newPassword: string) {
        const newkeyId = crypto
            .createHmac("sha256", process.env.OTP_KEY!)
            .update(userId)
            .digest("base64");

        if (keyId !== newkeyId) throw new Error("Invalid keyId or userId");

        const { salt, hashpassword } = this.userHelper.HashedPasswordAndSalting(newPassword);

        await Userdoc.findByIdAndUpdate(userId, {
            password: hashpassword,
            salting: salt,
        });

        return "Password updated successfully";
    }

    checkValidParams(id1: string, id2: string) {
        const newkeyId = crypto
            .createHmac("sha256", process.env.OTP_KEY!)
            .update(id1)
            .digest("base64");

        if (newkeyId !== id2) throw new Error("Invalid keys");
        return "Valid keys";
    }
}

export default OtpService;
