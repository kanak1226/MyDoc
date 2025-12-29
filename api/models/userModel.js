import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser;
    },
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default:
      "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA...", // shortened
  },
  documents: [
    {
      url: { type: String, required: true },
      type: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  address: {
    type: Object,
    default: {
      line1: '',
      line2: '',
    },
  },
  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  phone: { type: String, default: '0000000000' },

  // ✅ Added password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
