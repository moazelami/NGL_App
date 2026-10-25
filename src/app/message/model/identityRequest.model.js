import { model, Schema } from 'mongoose';

const identityRequestSchema = new Schema(
    {
        message: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            unique: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        requester: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
            index: true,
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

identityRequestSchema.index({ sender: 1, createdAt: -1 });
identityRequestSchema.index({ requester: 1, status: 1 });

export const IdentityRequest = model('IdentityRequest', identityRequestSchema);
