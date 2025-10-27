import { Schema, model, Model } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    picture: { type: String },
    bio: { type: String },
    title: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete (ret as any).__v;
        return ret;
      }
    }
  }
);

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
