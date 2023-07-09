const mongoose = require('mongoose')
const uri_compass = "mongodb://localhost:27017/test"
async function connect() {
    try {
        await mongoose.set('strictQuery', true);
        await mongoose.connect(uri_compass, {
            useNewUrlParser: true
        })
        console.log('connect db success')
    } catch (error) {
        console.log('connect db error')
    }
};
module.exports = { connect };