import mongoose, {Document, Schema} from "mongoose";

interface Description {
  text: string;
  date: Date;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  isPro: boolean;
  aiLimit: number;
  aiUsed: number;
  savedDescriptions: Description[];
}

const descriptionSchema = new Schema<Description>({
  text: {type: String, required: true},
  date: {type: Date, default: Date.now},
});

const userSchema = new mongoose.Schema<IUser>({
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  isPro: {type: Boolean, default: false},
  aiLimit: {type: Number, default: 0},
  aiUsed: {type: Number, default: 0},
  savedDescriptions: {type: [descriptionSchema], default: []},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
