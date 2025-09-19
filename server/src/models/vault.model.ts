import { Document, model, Schema, Types } from "mongoose";

interface IVault extends Document {
  user: Types.ObjectId;
  data: string;
}

const vaultSchema = new Schema<IVault>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    data: String,
  },
  { timestamps: true }
);

export const Vault = model<IVault>("Vault", vaultSchema);
