import bcrypt from 'bcryptjs';
import User from "../model/user.model.js";
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const {fullname, username, password, confirmpassword, gender} = req.body;

        if(password !== confirmpassword) {
            return res.status(400).json({error: "password don't match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error: "User Alredy Exists"});
        }

        // Hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create profile icons 
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User ({
            fullname,
            username,
            password : hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        })

        if(newUser){
            // Generate jwt token
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id : newUser.id,
                fullname : newUser.fullname,
                username : newUser.username,
                profilePic : newUser.profilePic,
            })
        }
        else{
            res.status(400).json({error: "Invalid User Data"});
        }

    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassword = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPassword){
            return res.status(400).json({error: "Invalid Username or Password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged Out Successfully"});

    } catch (error) {
        console.log("Error in Logout Controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}