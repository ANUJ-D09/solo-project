const express = require('express')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ShreeJagnnath"

function auth(req, res, next) {
    const token = req.headers['token'];
    if (!token) {
        res.status(401).json("missing token");
        return;
    }
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.userId = decodedData.userId;
        next();

    } catch (error) {
        console.error('JWT verification failed:', error.message);
        res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
}
module.exports = {
    auth
};