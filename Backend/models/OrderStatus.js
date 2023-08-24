import mongoose from 'mongoose';

const OrderStatusModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('OrderStatus', OrderStatusModel);
