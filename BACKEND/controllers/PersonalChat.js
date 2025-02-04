const ProfileDoc = require("../models/ProfileDoc");
const PersonalChatDoc = require("../models/PersonalChatDoc");
const crypto = require("node:crypto");
const FollowRequestDoc = require("../models/FollowRequest.js");
const FollowerDoc = require("../models/FollowersDoc.js");
const FollowingDoc = require("../models/FollowingDoc.js");

async function fetchSingleUserProfile(req, res) {
    let query = {};


    if (req.query.username) {
        query.username = req.query.username;
    }
    if (req.params.id) {
        query._id = req.params.id;
    }


    if (Object.keys(query).length === 0) {
        return res.status(404).json({ error: "Either username or id is required" });
    }

    try {

        const userProfile = await ProfileDoc.findOne(query);

        if (!userProfile) {
            return res.status(404).json({ error: "No user profile found" });
        }

        res.status(202).json({ userProfile });
    } catch (error) {
        res.status(505).json({ error: error.message });
    }
}

function GenerateChatId(req, res) {

    const MixedId = req.params.id;


    const chatId = crypto.createHmac("sha256", process.env.CHAT_KEY).update(MixedId).digest("hex");

    res.status(202).json({ chatId });
}

async function FetchAllPersonalChats(req, res) {


    try {
        const chats = await PersonalChatDoc.find({ chatId: req.params.id }).sort({ initateTime: -1 })

        if (!chats || chats == "") return res.status(404).json({ error: "no chats" });

        if (chats && chats != null) {

            // let filteredData = [];

            // chats.map(entry => {
            //     let { chatId, username, initateTime, chat } = entry;
            //     filteredData.push({ chatId, username, initateTime, chat });
            // });

            let filteredData = [];

            for(let i = chats.length -1 ; i>=0;i--) {

                let { chatId, username, initateTime, chat } = chats[i];
                filteredData.push({ chatId, username, initateTime, chat });
            }


            res.status(200).json(filteredData);
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ error: "error in fetching chats" })
    }

}

async function SavePersonalChats(req, res) {

    const chat = req.body;
    try {
        const savedChat = await PersonalChatDoc.create(chat);
        res.status(200).json({ msg: "chat saved", savedChat });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error saving chats" });
    }
}

async function fetchChattedUser(req, res) {
    const id = req.params.id;

    try {
        const users = await PersonalChatDoc.find({ otherUserId: id }).sort({ initateTime: -1 });

        const uniqueUsers = [];
        const usernames = new Set();

        users.forEach(user => {
            if (!usernames.has(user.username)) {
                usernames.add(user.username);
                uniqueUsers.push(user);
                return;
            }
        });


        res.status(202).json({ users: uniqueUsers });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function HandleFollowRequest(req, res) {

    const { userId, userIdOf, usernameOf } = req.body;

    try {

        // check that the request of that user is already there if yes then reject that 

        const FollowInfo = {
            userId: userId,
            userIdOf: userIdOf,
            usernameOf: usernameOf,

        }



        const saved = await FollowRequestDoc.create(FollowInfo);
        if (!saved || saved == "") return res.status(204).json({ status: "Follow" });

        res.status(202).json({ status: "Requested" });
    }
    catch (error) {
        res.status(505).json({ error: error.message });
    }


}

async function fetchAllFollowers(req, res) {

}

async function fetchAllFollowings(req, res) {

}

async function checkExistsInFollower(req, res) {

    const { userId, userIdOf } = req.body;


    if (!userId || !userIdOf) return res.status(404).json({ error: "id's required" });



    const query = {
        $and: [
            { userId: userId },
            { FollowedById: userIdOf },
        ],
    };

    try {
        const user = await FollowerDoc.find(query);
        console.log(user);
        if (!user || user == "") return res.status(204).json({ status: "Follow" })

        if (user) res.status(202).json({ status: "Following" });

    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}

async function checkAlreadyRequested(req, res) {

    const { userId, userIdOf } = req.body;

    if (!userId || !userIdOf) return res.status(404).json({ error: "id required" });

    const query = {
        $and: [
            { userId: userId },
            { userIdOf: userIdOf },
        ],
    };

    try {
        const entry = await FollowRequestDoc.findOne(query);

        if (!entry) return res.status(204).json({ status: "no entry found" });

        if (entry) res.status(202).json({ status: "Requested" });


    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }


}

async function HandleRemoveRequested(req, res) {

    const { userId, userIdOf, usernameOf } = req.body;


    const query = {
        $and: [
            { userId: userId },
            { userIdOf: userIdOf },
        ],
    };

    try {
        const deletedRequest = await FollowRequestDoc.findOneAndDelete(query);
        if (!deletedRequest) return res.status(204).json({ status: "Requested", message: "failed to remove" });

        if (deletedRequest) return res.status(202).json({ status: "Follow", message: "Rejected" });

    }
    catch (error) {

        return res.status(505).json({ error: error.message });
    }

}

async function fetchAllRequests(req, res) {

    const id = req.params.id;


    try {

        const requests = await FollowRequestDoc.find({ userId: id });
        if (!requests) return res.status(404).json({ message: "no requests" });

        res.status(202).json({ requests });

    }
    catch (error) {
        res.status(404).json({ error: error.message })
    }

}

async function HandleAcceptedRequest(req, res) {
    const { userId, userIdOf, usernameOf } = req.body;

    

    try {

        const query = {
            $and: [
                { userId: userId },
                { userIdOf: userIdOf },
            ],
        };

        const acceptedRequest = await FollowRequestDoc.findOneAndDelete(query);
        if(!acceptedRequest || acceptedRequest == "") return res.status(404).json({ error : "failed !" });

        await FollowerDoc.create({
            userId: userId,
            FollowedById: userIdOf,
            FollowedByUsername: usernameOf,
        });

        await ProfileDoc.findOneAndUpdate(
            { _id: userId },
            { $inc: { followers: 1 } },
            { new: true }
        );

        const user = await ProfileDoc.findById(userId);

        await FollowingDoc.create({
            userId: userIdOf,
            FollowingWhomId: userId,
            FollowingWhomUsername: user.username,
        });

        await ProfileDoc.findOneAndUpdate(
            { _id: userIdOf },
            { $inc: { following: 1 } },
            { new: true }
        );

        res.status(200).json({ message: "Accepted" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }


}

async function HandleRemoveFollower(req, res) {

    const { userId, userIdOf } = req.body;
    console.log(userId , userIdOf);

    const query = {
        $and: [
            { userId: userId },
            { FollowedById: userIdOf },
        ],
    };

    const query1 = {
        $and: [
            { userId: userIdOf },
            { FollowingWhomId: userId },
        ],
    };


    try {

        const removedFollower = await FollowerDoc.findOneAndDelete(query);
       const removedFollowing = await FollowingDoc.findOneAndDelete(query1);
        if (removedFollower == "" || removedFollowing == "") return res.status(404).json({ status: "Following" });

        await ProfileDoc.findOneAndUpdate(
            { _id: userId },
            { $inc: { followers: -1 } },
            { new: true }

        );

        await ProfileDoc.findOneAndUpdate(
            { _id : userIdOf },
            { $inc : { following : -1 } },
            { new : true }
        );

        res.status(202).json({ status: "Follow" });
    }
    catch (error) {
        res.status(505).json({ error: error.message })
    }

}


module.exports = {

    fetchSingleUserProfile,
    GenerateChatId,
    FetchAllPersonalChats,
    SavePersonalChats,
    fetchChattedUser,
    HandleFollowRequest,
    checkExistsInFollower,
    fetchAllFollowers,
    fetchAllFollowings,
    checkAlreadyRequested,
    HandleRemoveRequested,
    HandleAcceptedRequest,
    HandleRemoveFollower,
    fetchAllRequests

}