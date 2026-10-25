import { model, Schema } from 'mongoose';

const conversationMessageSchema = new Schema(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 200,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

conversationMessageSchema.index({ conversation: 1, createdAt: 1 });

export const ConversationMessage = model('ConversationMessage', conversationMessageSchema);
