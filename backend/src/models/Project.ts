import { Schema, model, Model } from 'mongoose';
import { IProject } from '../types';

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['planning', 'recruiting', 'active', 'completed', 'paused'], 
      default: 'planning' 
    },
    technologies: [{ type: String }],
    members: {
      current: { type: Number, default: 0, min: 0 },
      max: { type: Number, required: true, min: 1 },
      userIds: [{ type: String }]
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: { type: Date, required: true },
    createdBy: { type: String, required: true },
    department: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      required: true 
    },
    tags: [{ type: String }],
    metrics: {
      commits: { type: Number, default: 0, min: 0 },
      issues: { type: Number, default: 0, min: 0 },
      stars: { type: Number, default: 0, min: 0 }
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

// Indexes for efficient queries
projectSchema.index({ createdBy: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ difficulty: 1 });
projectSchema.index({ 'members.userIds': 1 });
projectSchema.index({ name: 'text', description: 'text', technologies: 'text' });

const Project: Model<IProject> = model<IProject>('Project', projectSchema);

export default Project;
