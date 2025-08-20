import { autoInjectable } from "tsyringe";
import { Request, Response } from "express";
import OtpService from "../../utils/others/validation";

@autoInjectable()
class OtpController {
    constructor(private otpService: OtpService) { }

    generateOTP = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const result = await this.otpService.generateOTP(email);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    verifyOTP = async (req: Request, res: Response) => {
        try {
            const { userId, enteredOTP } = req.body;
            const keyId = await this.otpService.verifyOTP(userId, enteredOTP);
            res.status(202).json({ message: "OTP verified", keyId });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { keyId, userId, newPassword } = req.body;
            const message = await this.otpService.resetPassword(keyId, userId, newPassword);
            res.status(200).json({ message });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    checkValidParams = async (req: Request, res: Response) => {
        try {
            const { id1, id2 } = req.params;
            const message = this.otpService.checkValidParams(id1, id2);
            res.status(202).json({ message });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };
}

export default OtpController;
