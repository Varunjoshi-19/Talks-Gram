import { injectable } from "tsyringe";
import FollowRequestDoc from "../../models/FollowRequest";
import FollowerDoc from "../../models/FollowersDoc";
import FollowingDoc from "../../models/FollowingDoc";
import ProfileDoc from "../../models/ProfileDoc";



@injectable()
class FollowService {

    async handleFollowRequest(userId: string, userIdOf: string, usernameOf: string) {
        try {
            const existing = await FollowRequestDoc.findOne({ userId, userIdOf });
            if (existing) {
                return { status: 204, success: false, message: "Already requested" };
            }

            const saved = await FollowRequestDoc.create({ userId, userIdOf, usernameOf });
            if (!saved) return { status: 204, success: false, message: "Follow" };

            return { status: 202, success: true, message: "Requested" };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async checkExistsInFollower(userId: string, userIdOf: string) {
        const query = {
            $and: [{ userId }, { FollowedById: userIdOf }],
        };

        try {
            const user = await FollowerDoc.find(query);
            if (!user || user.length === 0) return { status: 204, statusText: "Follow" };
            return { status: 202, statusText: "Following" };
        } catch (error: any) {
            return { status: 404, error: error.message };
        }
    }

    async checkAlreadyRequested(userId: string, userIdOf: string) {
        const query = {
            $and: [{ userId }, { userIdOf }],
        };

        try {
            const entry = await FollowRequestDoc.findOne(query);
            if (!entry) return { status: 204, statusText: "no entry found" };
            return { status: 202, statusText: "Requested" };
        } catch (error: any) {
            return { status: 404, error: error.message };
        }
    }

    async handleRemoveRequested(userId: string, userIdOf: string) {
        const query = {
            $and: [{ userId }, { userIdOf }],
        };

        try {
            const deletedRequest = await FollowRequestDoc.findOneAndDelete(query);
            if (!deletedRequest) {
                return { status: 204, message: "failed to remove", statusText: "Requested" };
            }
            return { status: 202, message: "Rejected", statusText: "Follow" };
        } catch (error: any) {
            return { status: 505, error: error.message };
        }
    }

    async handleAcceptedRequest(userId: string, userIdOf: string, usernameOf: string) {
        try {
            const query = { $and: [{ userId }, { userIdOf }] };

            const acceptedRequest = await FollowRequestDoc.findOneAndDelete(query);
            if (!acceptedRequest) return { status: 404, success: false, message: "failed!" };

            await FollowerDoc.create({ userId, FollowedById: userIdOf, FollowedByUsername: usernameOf });

            await ProfileDoc.findByIdAndUpdate(userId, { $inc: { followers: 1 } }, { new: true });

            const user = await ProfileDoc.findById(userId);
            if (!user) return { status: 404, success: false, message: "user not found" };

            await FollowingDoc.create({
                userId: userIdOf,
                FollowingWhomId: userId,
                FollowingWhomUsername: user.username,
            });

            await ProfileDoc.findByIdAndUpdate(userIdOf, { $inc: { following: 1 } }, { new: true });

            return { status: 200, success: true, message: "Accepted" };
        } catch (error: any) {
            return { status: 500, success: false, error: error.message };
        }
    }

    async handleRemoveFollower(userId: string, userIdOf: string) {
        const followerQuery = { $and: [{ userId }, { FollowedById: userIdOf }] };
        const followingQuery = { $and: [{ userId: userIdOf }, { FollowingWhomId: userId }] };

        try {
            const removedFollower = await FollowerDoc.findOneAndDelete(followerQuery);
            const removedFollowing = await FollowingDoc.findOneAndDelete(followingQuery);

            if (!removedFollower || !removedFollowing) {
                return { status: 404, success: false, statusText: "Following" };
            }

            await ProfileDoc.findByIdAndUpdate(userId, { $inc: { followers: -1 } }, { new: true });
            await ProfileDoc.findByIdAndUpdate(userIdOf, { $inc: { following: -1 } }, { new: true });

            return { status: 202, success: true, statusText: "Follow" };
        } catch (error: any) {
            return { status: 505, success: false, error: error.message };
        }
    }

}




export default FollowService;
