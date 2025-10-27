import User from '../models/User';
import { CreateUserRequest, UpdateUserRequest, IUser } from '../types';
import { createError } from '../middleware/errorHandler';

export class UserService {
  async createOrUpdateUser(userData: CreateUserRequest): Promise<IUser> {
    try {
      const { googleId, email, name, picture } = userData;
      
      if (!email && !googleId) {
        throw createError('Email or Google ID is required', 400);
      }

      const filter = googleId ? { googleId } : { email };
      const update = { 
        $set: { 
          email, 
          name, 
          picture, 
          googleId 
        } 
      };
      const options = { 
        upsert: true, 
        new: true, 
        setDefaultsOnInsert: true 
      };
      
      const user = await User.findOneAndUpdate(filter, update, options);
      if (!user) {
        throw createError('Failed to create or update user', 500);
      }
      return user;
    } catch (error) {
      console.error('Create/Update user error:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ 
        $or: [
          { _id: userId },
          { googleId: userId }
        ]
      });
      return user;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error('Get user by email error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updateData: UpdateUserRequest): Promise<IUser | null> {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        updateData,
        { new: true }
      );
      return user;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(userId);
      return !!result;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await User.countDocuments();
      
      return { users, total };
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }
}
