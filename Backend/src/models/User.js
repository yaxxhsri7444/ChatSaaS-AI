const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    email: { type: String, required: true, unique: true },
    name : { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    passwordHash: { type: String, required: true },

});