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

    avatar: {
      type: String,
      default: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
    }
  },{
    timestamps: true // This enables automatic createdAt and updatedAt fields
  });


//   now we are creating model
  const User = mongoose.model('User', UserSchema);
  export default User; 