import User from "../models/User.js";

// Read
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getUserfollowings = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const followings = await Promise.all(
            user.followings.map((followingId) => {
                return User.findById(followingId);
            })
        );
        let followingList = [];
        followings.map((following) => {
            const { _id, firstname, lastname, picture } = following;
            followingList.push({ _id, firstname, lastname, picture });
        });
        res.status(200).json(followingList);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getUserfollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const followers = await Promise.all(
            user.followers.map((followerId) => {
                return User.findById(followerId);
            })
        );
        let followerList = [];
        followers.map((follower) => {
            const { _id, firstname, lastname, picture } = follower;
            followerList.push({ _id, firstname, lastname, picture });
        });
        res.status(200).json(followerList);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Update
export const addremovefollowers = async (req, res) => {
    try {
        const { userId, followerId } = req.params;

        // Find the user to add/remove followers
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if followerId already exists in user's followers
        const isFollower = user.followers.includes(followerId);

        // Update user's followers based on the isFollower value
        if (isFollower) {
            // Remove followerId from the user's followers array
            user.followers = user.followers.filter((id) => id !== followerId);
        } else {
            // Add followerId to the user's followers array
            user.followers.push(followerId);
        }

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
};