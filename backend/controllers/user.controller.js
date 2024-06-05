import User from "../model/user.model.js";

export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({_id : {$ne: loggedInUser}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(400).json({error: "Internal Server Error"});
    }
}