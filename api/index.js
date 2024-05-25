import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('connected to Mongoose');
}).catch(err=>{
    console.log('error connecting');
});




const port = 3000;
app.listen(port, () => {
    console.log('listening on port', port);
});

