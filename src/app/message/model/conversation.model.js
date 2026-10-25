import { model, Schema } from 'mongoose';

const conversationSchema = new Schema(
    {
        request: {
            type: Schema.Types.ObjectId,
            ref: 'IdentityRequest',
            required: true,
            unique: true,
        },
        message: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
        },
        participants: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            validate: {
                validator: (participants) => participants.length === 2,
                message: 'A conversation must have exactly two participants',
            },
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        },
    }
);

conversationSchema.index({ participants: 1, createdAt: -1 });

export const Conversation = model('Conversation', conversationSchema);
