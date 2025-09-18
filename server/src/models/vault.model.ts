import { Document, model, Schema, Types } from "mongoose";

interface IVault extends Document {
  userId: Types.ObjectId;
  data: string;
}

const vaultSchema = new Schema<IVault>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    data: String,
  },
  { timestamps: true }
);

export const Vault = model<IVault>("Vault", vaultSchema);
