import JWT from 'jsonwebtoken';
import User from '../models/userModel.js';
const protectRoute = async (req, res, next) => {
    // get the token from the cookie accomplished by cookie-parser
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    // returns the decoded token payload
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
        return res.status(401).json({ message: "Invalid Token" });
    }

    const currentUser = await User.findById(decoded.userId);


    // add user-deined property to req object
    req.user = currentUser;

    next();
};

export default protectRoute;