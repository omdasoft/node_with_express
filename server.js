const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const mongoose = require('mongoose');
//Create a server
const port = process.env.PORT || 3000;

mongoose.connect(process.env.CONN_STR).then((conn) => {
    console.log("connected successfully");
}).catch((error) => {
    console.log("some error occured");
})

app.listen(port, () => {
    console.log(`node server running on port ${port}`)
})