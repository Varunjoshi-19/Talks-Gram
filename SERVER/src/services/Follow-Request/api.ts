import { autoInjectable } from "tsyringe";
import FollowRequestDoc from "../../models/FollowRequest";

@autoInjectable()
class FollowApiServices {

    constructor() { }

    async fetchAllRequests(userId: string) {
        try {
            const requests = await FollowRequestDoc.find({ userId });
            if (!requests || requests.length === 0) {
                return { success: false, status: 404, message: "No requests" };
            }
            return { success: true, status: 202, data: requests };
        } catch (error: any) {
            return { success: false, status: 404, error: error.message };
        }
    }

    async fetchAllFollowers(userId: string) {
        // Implement
        return [];
    }

    async fetchAllFollowings(userId: string) {
        // Implement
        return [];
    }

}

export default FollowApiServices