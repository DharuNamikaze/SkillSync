import mongoose, { Schema, Document, Types } from 'mongoose';

export type TeamMessageStatus = 'sent' | 'delivered' | 'read';

export interface ITeamMessage extends Document {
  sender: Types.ObjectId;
  projectId: Types.ObjectId;
  content: string;
  readBy: Types.ObjectId[];
  status: TeamMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMessageSchema: Schema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
TeamMessageSchema.index({ projectId: 1, createdAt: -1 });
TeamMessageSchema.index({ sender: 1, projectId: 1 });

export default mongoose.model<ITeamMessage>('TeamMessage', TeamMessageSchema);