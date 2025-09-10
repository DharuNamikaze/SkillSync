import { Schema, model, Model } from 'mongoose';
import { ISkill } from '../types';

const skillSchema = new Schema<ISkill>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    level: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
      required: true 
    },
    category: { type: String, required: true }
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

// Indexes for efficient queries
skillSchema.index({ userId: 1 });
skillSchema.index({ userId: 1, category: 1 });
skillSchema.index({ name: 1 });

const Skill: Model<ISkill> = model<ISkill>('Skill', skillSchema);

export default Skill;
