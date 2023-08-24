import mongoose from 'mongoose';

const UserModel = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      unique: true,
    },
    name: String,
    description: String,
    avatarUrl: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserModel);
