import mongoose from 'mongoose';

const ChatModel = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Chat', ChatModel);
