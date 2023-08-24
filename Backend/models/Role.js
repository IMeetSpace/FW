import mongoose from 'mongoose';

const RoleModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Role', RoleModel);
