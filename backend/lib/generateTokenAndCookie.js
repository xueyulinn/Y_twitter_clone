import JWT from 'jsonwebtoken';


const generateToken = (userId, res) => {
    // sign the token
    // claims, secret, options
    const jwt = JWT.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
    // name, value, options
    res.cookie('token', jwt, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 15,
    });
}

export default generateToken;