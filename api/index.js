import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// import of router
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


// manage env file
dotenv.config();
const app = express();

// connect to database server
mongoose.connect(process.env.MONGO).then(() => {
    console.log('connected to Mongoose');
}).catch(err=>{
    console.log('error connecting', err);
});

//allow server to pass JSON data 
app.use(express.json());

// API routes are creating 
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// error handling middleware
app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        const message = err.message || "internal server error";

       return res.status(statusCode).json({
                success: false,
                message: message,
                statusCode: statusCode,
            })
    }    
) 

// port number
const port = 3000;
app.listen(port, () => {
    console.log('listening on port', port);
});

