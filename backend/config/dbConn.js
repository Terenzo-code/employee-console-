const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Look mom, no options object!
        await mongoose.connect(process.env.DATABASE_URI);
       // console.log('MongoDB connected successfully!'); 
    } catch (err) {
        console.error(err);
    }
}

module.exports  = connectDB