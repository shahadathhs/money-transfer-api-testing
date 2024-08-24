import mongoose, { Schema } from "mongoose";

type SendMoney = {
  receiverId: string;
  senderId: string;
  amountSent: number;
  fee: number;
  sentAt: Date;
}

const SendMoneySchema = new Schema<SendMoney>({
  receiverId: { type: String, required: true },
  senderId: { type: String, required: true },
  amountSent: { type: Number, required: true },
  fee: { type: Number, required: true },
  sentAt: { type: Date, default: Date.now },
});

const SendMoney = mongoose.model<SendMoney>('SendMoney', SendMoneySchema);
export default SendMoney;