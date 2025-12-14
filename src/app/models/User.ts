import mongoose, {Document, Schema} from "mongoose";

interface Description {
  text: string;
  date: Date;
}
export type Plan = "free" | "start" | "standard" | "pro";

export interface IUser extends Document {
  email: string;
  passwordHash: string;

  plan: Plan; 
  aiLimit: number;
  aiUsed: number;

  // Stripe billing
  stripeCustomerId?: string;
  stripeLastCheckoutSessionId?: string;
  planActivatedAt?: Date;

  savedDescriptions: Description[];
}

const descriptionSchema = new Schema<Description>({
  text: {type: String, required: true},
  date: {type: Date, default: Date.now},
});

const userSchema = new mongoose.Schema<IUser>({
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},

  plan: {
      type: String,
      enum: ["free", "start", "standard", "pro"],
      default: "free",
      index: true,
    },

  aiLimit: {type: Number, default: 0},
  aiUsed: {type: Number, default: 0},

  stripeCustomerId: { type: String, default: null },
    stripeLastCheckoutSessionId: { type: String, default: null },
    planActivatedAt: { type: Date, default: null },

    
  savedDescriptions: {type: [descriptionSchema], default: []},
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
