import { Schema, model, Model } from 'mongoose';

// Database model interface
export interface IProjectChat {
  projectId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'code';
  codeBlock?: {
    language: string;
    content: string;
  };
}

// Frontend response interface
export interface IProjectChatResponse {
  id: string;
  content: string;
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  type: 'text' | 'system' | 'code';
  codeBlock?: {
    language: string;
    content: string;
  };
}

const projectChatSchema = new Schema<IProjectChat>(
  {
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { 
      type: String, 
      enum: ['text', 'system', 'code'],
      default: 'text'
    },
    codeBlock: {
      language: String,
      content: String
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for efficient queries
projectChatSchema.index({ projectId: 1, timestamp: -1 });
projectChatSchema.index({ userId: 1 });

const ProjectChat: Model<IProjectChat> = model<IProjectChat>('ProjectChat', projectChatSchema);

export default ProjectChat;