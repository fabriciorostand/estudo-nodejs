const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        userId: user._id,
        role: user.role, 
        email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
