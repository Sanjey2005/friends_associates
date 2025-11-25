import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
    sender: 'user' | 'admin';
    text: string;
    timestamp: Date;
}

export interface IChat extends Document {
    userId: mongoose.Types.ObjectId;
    messages: IMessage[];
    lastUpdated: Date;
}

const ChatSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    messages: [{
        sender: { type: String, enum: ['user', 'admin'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    lastUpdated: { type: Date, default: Date.now }
});

const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
