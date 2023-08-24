import mongoose from 'mongoose';

const OrderModel = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderStatus',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
    },
    dateRequire: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Order', OrderModel);
