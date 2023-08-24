import mongoose from 'mongoose';

const TenderModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TenderStatus',
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
    dateRequire: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Tender', TenderModel);
