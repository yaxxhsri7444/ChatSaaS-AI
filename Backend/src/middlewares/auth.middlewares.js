const jwt = require('jsonwebtoken');
const Business = require('../models/Business');

module.exports = async (req, res, next) =>{
    try{
        const header = req.headers.authorization;
        if(!header) return res.status(401).json({message: "Authorization header missing"});
        const token = header.split(" ")[1];
        const playload = jwt.verify(token, process.env.JWT_SECRET);
        if(!playload) return res.status(401).json({message: "Invalid token"});
        const business = await Business.findById(playload.id);
        if(!business) return res.status(401).json({message: "Business not found"});
        req.business = business;
        next();
    }catch(err){
        return res.status(401).json({message: "Unauthorized"});
    }
}