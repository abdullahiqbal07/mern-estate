// now we are creating a new schema 
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
  },{
    timestamps: true // This enables automatic createdAt and updatedAt fields
  });


//   now we are creating model
  const User = mongoose.model('User', UserSchema);
  export default User; 