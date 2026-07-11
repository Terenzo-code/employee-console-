const mongoose = require('mongoose');

// 1. FIXED: Removed the accidental 'e' at the end
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true // 2. FIXED: Changed 'require' to 'required'
    },
    roles: {
        User: {
            type: Number, // 3. QUICK TIP: If your default is 2001, type should be Number, not String!
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);