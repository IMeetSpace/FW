import mongoose from 'mongoose';

const TenderStatusModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('TenderStatus', TenderStatusModel);
