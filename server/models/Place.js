import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  country: { type: String, required: true },
  continent: { type: String, required: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  category: [{ type: String }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Place', placeSchema);
