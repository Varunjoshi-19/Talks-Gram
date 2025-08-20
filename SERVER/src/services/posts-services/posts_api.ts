import { autoInjectable } from "tsyringe";
import CommentDoc from "../../models/Comments";
import PostDoc from "../../models/PostDoc";
import LikedPostDoc from "../../models/LikedPost";
import AllHelpServices from "../../utils/index";
import StoryDoc from "../../models/StoryDoc";
import NoteDoc from "../../models/NoteDoc";

@autoInjectable()
class PostsApiServices {

    constructor(private allHelp: AllHelpServices) { }

    async fetchAllComments(postId: string) {
        try {
            const comments = await CommentDoc.find({ postId }).sort({ createdAt: -1 });
            if (!comments || comments.length === 0) {
                return { status: 404, success: false, message: "No comment yet" };
            }
            return { status: 202, success: true, data: comments };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async fetchPosts(skip: number) {
        try {
            const posts = await PostDoc.find({}).sort({ createdAt: 1 }).skip(skip).limit(5);
            if (!posts || posts.length === 0) {
                return { status: 201, success: false, message: "Empty" };
            }

            const shuffledPosts = this.allHelp.shufflePosts(posts);
            return { status: 202, success: true, data: shuffledPosts };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async fetchLikedPost(postId: string, userId: string) {
        try {
            const likedPost = await LikedPostDoc.find({
                $and: [{ postId }, { userId }]
            });

            return {
                status: 200,
                success: true,
                likeStatus: likedPost && likedPost.length > 0
            };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async fetchAllPosts(userId: string) {
        try {
            const allPosts = await PostDoc.find({ "author.userId": userId });
            return { status: 202, success: true, data: allPosts };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handlefetchUserPost(id: string) {

        try {
            if (!id) {
                return { status: 404, message: "post id missing!" };
            }

            const post = await PostDoc.findOne({ _id: id }, { "author.userId": 1, "author.userAccId": 1, postLike: 1, createdAt: 1 });
            if (!post) {
                return { status: 404, message: "post not available" }
            }

            return { status: 200, post: post };
        } catch (error) {
            return { status: 505, message: error };
        }
    }

    async handleFetchAllStories() {
        try {
            const stories = await StoryDoc.find({}).select("_id userId username storyData.contentType storyData.duration").lean();
            if (!stories) {
                return { status: 404, success: false, message: "no stories available" }
            }

            return { status: 200, success: true, data: stories }
        }
        catch (error: any) {
            return { status: 505, success: false, message: error.message }
        }
    }

    async fetchStory(id: string) {
        try {
            const story = await StoryDoc.findOne({ userId: id }).select("_id userId storyData.contentType storyData.duration username expiredAt").lean();
            if (!story) {
                return { status: 404, success: false, message: "no story" }
            }
            return { status: 200, success: true, data: story }
        } catch (error: any) {
            return { status: 505, success: false, message: error.message }
        }
    }

    async fetchSingleNote(id: string) {
        try {
            if (!id) {
                return { status: 404, success: false, message: "id required!" };

            }
            const note = await NoteDoc.findOne({ userId: id }).select("_id userId noteMessage").lean();
            if (!note) {
                return { status: 404, success: false, message: "no note there!" };
            }
            return { status: 200, success: true, data: note };
        }
        catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async removeStory(id: string) {
        if (!id) {
            return { status: 404, success: false, message: "id required" }
        }
        const deleteStory = await StoryDoc.findByIdAndDelete(id);
        if (!deleteStory) {
            return { status: 404, success: true, message: "failed to delete" }
        }
        return { status: 200, success: true, message: "story removed!" }
    }
}



export default PostsApiServices;
