import mongoose, { Schema } from "mongoose";

type CashIn = {
    amount: number;
    agentId: string;
    requesterId: string;
    status: string;
    requestedAt: Date;
    approvedAt: Date;
};

const CashInSchema = new Schema<CashIn>({
  amount: { type: Number, required: true },
  agentId: { type: String, required: true },
  requesterId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
});

const CashIn = mongoose.model<CashIn>('CashIn', CashInSchema);
export default CashIn;