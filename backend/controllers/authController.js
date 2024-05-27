import bcrypt from 'bcryptjs';
import generateTokenAndCookie from '../lib/generateTokenAndCookie.js';
import User from '../models/userModel.js';

export const signup = async (req, res) => {

    try {
        const { fullName, userName, email, password } = req.body;
        // regular expression for email validation
        const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!fullName || !userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // test method returns true if it finds a match
        // otherwise it returns false
        if (!emailReg.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const user1 = await User.findOne({ email: email });

        if (user1) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user2 = await User.findOne({ userName: userName });

        if (user2) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            // if the key and value are the same
            // we can just write it once
            fullName,
            userName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            // _id field is automatically created if 
            // we defined the schema with mongoose
            generateTokenAndCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                token: res.cookie.token
            });
        }
    } catch (error) {
        console.log('error in signup', error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user1 = await User.findOne({ userName });

        const user2 = await bcrypt.compare(password, !user1 ? "" : user1.password);

        if (!user1 || !user2) {
            return res.status(400).json({ message: "Invalid userName or password" });
        }

        generateTokenAndCookie(user1._id, res);

        res.json({
            _id: user1._id,
            fullName: user1.fullName,
            userName: user1.userName,
            email: user1.email,
            token: res.cookie.token
        });

    } catch (error) {
        console.log('error in login', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {

    try {
        res.cookie('token', '',{maxAge: 0});
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.log('error in logout', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.json(user);
    } catch (error) {
        console.log('error in getMe', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}