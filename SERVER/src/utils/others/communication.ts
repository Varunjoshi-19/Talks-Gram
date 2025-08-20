import CommDoc from "../../models/CommunicationId";
import crypto from "crypto";
class CommunicationServices {

    async fetchCommunicationId(userId: string) {
        if (!userId || userId === "") throw new Error("ID REQUIRED");

        const commId = await CommDoc.findOne({ userId });
        if (!commId) throw new Error("No communication ID found");

        return commId;
    }

    async addCommId(userId: string) {
        const commId = this.generateCommunicationId(userId);

        const newComm = await CommDoc.create({
            userId,
            commId,
        });

        return newComm;
    }

    generateCommunicationId(userId: string) {

        const commId = crypto.createHmac("sha256", process.env.COMMUICATION_KEY!).update(userId).digest("hex");
        return commId;

    }



}

export default CommunicationServices;