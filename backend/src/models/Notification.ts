import { Schema, model, Model } from 'mongoose';
import { INotification } from '../types';

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['invitation', 'task_assignment', 'comment', 'deadline', 'achievement', 'mention', 'team_update', 'system'], 
      required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high'], 
      default: 'medium' 
    },
    sender: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: { type: String },
      role: { type: String }
    },
    actionUrl: { type: String, required: true },
    category: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
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
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, category: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification: Model<INotification> = model<INotification>('Notification', notificationSchema);

export default Notification;
