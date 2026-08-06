import mongoose, { Document, Schema } from "mongoose";

export type EventName =
  | "signup"
  | "first_generate"
  | "generate"
  | "paywall_view"
  | "checkout_start"
  | "purchase"
  | "template_selected";

export interface IEvent extends Document {
  userId?: string;
  event: EventName;
  payload?: Record<string, unknown>;
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: { type: String, index: true },
    event: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { collection: "events" }
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
export default Event;
