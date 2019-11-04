const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) =>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({'_id': decode._id, 'tokens.token': token});
        if(!user){
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
        
    } catch (err) {
        res.status(401).send('erro: Please authenticate.');
    }
}

module.exports = auth;
