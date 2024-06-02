import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// manage env file
dotenv.config();
const app = express();

// connect to database server
mongoose.connect(process.env.MONGO).then(() => {
    console.log('connected to Mongoose');
}).catch(err=>{
    console.log('error connecting');
});




// port number
const port = 3000;
app.listen(port, () => {
    console.log('listening on port', port);
});

