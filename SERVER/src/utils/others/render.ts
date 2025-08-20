import { injectable } from "tsyringe";
import ProfileDoc from "../../models/ProfileDoc";
import PersonalChatDoc from "../../models/PersonalChatDoc";
import PostDoc from "../../models/PostDoc";
import ReelDoc from "../../models/ReelDoc";
import StoryDoc from "../../models/StoryDoc";

@injectable()
class RenderService {

    async getProfileImage(id: string) {
        try {
            const profile = await ProfileDoc.findById(id);

            if (!profile || !profile.profileImage || !profile.profileImage.data) {
                return {
                    status: 404,
                    success: false,
                    message: "Image not found",
                };
            }

            return {
                status: 200,
                success: true,
                contentType: profile.profileImage.contentType,
                data: profile.profileImage.data,
            };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error fetching image",
                error: error.message,
            };
        }
    }

    async fetchMessageItem(id1: string, id2: string) {
        if (!id1 || !id2) {
            return {
                status: 400,
                success: false,
                message: "Invalid ID provided",
            };
        }

        const query = {
            _id: id1,
            "AdditionalData._id": id2,
        };

        const projection: any = {
            "AdditionalData.$": 1,
        };

        try {
            const post = await PersonalChatDoc.findOne(query, projection);

            if (!post || !post.AdditionalData || post.AdditionalData.length === 0) {
                return {
                    status: 404,
                    success: false,
                    message: "Data not found",
                };
            }

            const { data, contentType } = post.AdditionalData[0];

            return {
                status: 200,
                success: true,
                contentType,
                data,
            };
        } catch (error: any) {
            console.error("Error fetching render data:", error);
            return {
                status: 500,
                success: false,
                message: "Server error while fetching",
            };
        }
    }

    async renderPostImage(id: string) {
        if (!id || id.trim() === "") {
            return {
                status: 404,
                success: false,
                message: "Failed to render image",
            };
        }

        try {
            const post = await PostDoc.findOne({ _id: id });

            if (!post || !post.postImage || !post.postImage.data) {
                return {
                    status: 404,
                    success: false,
                    message: "Image not found",
                };
            }

            return {
                status: 200,
                success: true,
                contentType: post.postImage.contentType,
                data: post.postImage.data,
            };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error fetching image",
            };
        }
    }

    async handleRenderReel(id?: string) {
        if (!id) {
            return { status: 400, error: "Invalid ID provided" };
        }

        try {
            const post = await ReelDoc.findOne({ _id: id });

            if (!post?.reelVideo?.data) {
                return { status: 404, error: "Video not found" };
            }

            return {
                status: 200,
                contentType: post.reelVideo.contentType,
                data: post.reelVideo.data,
            };
        } catch (error: any) {
            return { status: 500, error: "Server error while fetching video" };
        }
    }

    async handleRenderStory(id: string) {
        if (!id) {
            return { status: 400, error: "Invalid ID provided" };
        }

        try {
            const post = await StoryDoc.findOne({ _id: id });

            if (!post?.storyData?.data) {
                return { status: 404, error: "Video not found" };
            }

            return {
                status: 200,
                contentType: post.storyData.contentType,
                data: post.storyData.data,
            };
        } catch (error: any) {
            return { status: 500, error: "Server error while fetching video" };
        }
    }
}

export default RenderService;
