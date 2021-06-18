import { Schema, model } from 'mongoose';
const assetSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});
const Asset = model('Asset', assetSchema);
export default Asset;
