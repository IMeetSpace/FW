import mongoose from 'mongoose';

const CategoryModel = new mongoose.Schema({
  isActive: {
    type: Boolean,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  level: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model('Category', CategoryModel);
