import ProfileDoc from "../../models/ProfileDoc";


class UserApiServices {


    async fetchSingleUserProfile(id: string) {
        if (!id) {
            return { success: false, status: 404, message: " id is required" };
        }

        try {
            const userProfile = await ProfileDoc.findById(id).select("_id username fullname post bio followers following").lean();
            if (!userProfile) {
                return { success: false, status: 404, message: "No user profile found" };
            }

            return { success: true, status: 202, data: userProfile };
        } catch (error: any) {
            return { success: false, status: 505, message: error.message };
        }
    }

    async handleGetIdAndUsername(id: string) {
        const userProfile = await ProfileDoc.findById(id).select("_id username").lean();
        if (!userProfile) throw new Error("Profile not found");
        return userProfile;
    }

    async getAllAccounts(excludeEmail: string) {
        if (!excludeEmail) throw new Error("Email is required");
        const allAccounts = await ProfileDoc.find({ email: { $ne: excludeEmail } }).select("_id username fullname").limit(4).lean();
        return allAccounts;
    }




}




export default UserApiServices;