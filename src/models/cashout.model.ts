import mongoose, { Schema } from "mongoose";

type CashOut = {
    amount: number;
    agentId: string;
    requesterId: string;
    status: string;
    requestedAt: Date;
    approvedAt: Date;
};

const CashOutSchema = new Schema<CashOut>({
  amount: { type: Number, required: true },
  agentId: { type: String, required: true },
  requesterId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

const CashOut = mongoose.model<CashOut>('CashOut', CashOutSchema);
export default CashOut;