import mongoose, { Schema, Document, Types } from 'mongoose';

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  content: string;
  read: boolean;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
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
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);