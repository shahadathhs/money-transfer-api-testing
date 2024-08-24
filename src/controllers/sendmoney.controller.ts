import { Request, Response } from 'express';
import SendMoney from '../models/sendmoney.model';

// Send money
export const sendMoney = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverId, amount } = req.body;
        const sendMoney = new SendMoney({
            sender: senderId,
            receiver: receiverId,
            amount,
        });
        await sendMoney.save();
        res.status(201).json(sendMoney);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all send money transactions
export const getAllSendMoneyTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await SendMoney.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a send money transaction by ID
export const getSendMoneyTransactionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transaction = await SendMoney.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Delete a send money transaction
export const deleteSendMoneyTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transaction = await SendMoney.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};