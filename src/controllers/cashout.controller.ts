import { Request, Response } from 'express';
import CashOut from '../models/cashout.model';

// Get all cashout requests
export const getAllCashOuts = async (req: Request, res: Response) => {
    try {
        const cashouts = await CashOut.find();
        res.status(200).json(cashouts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a cashout request by ID
export const getCashOutById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cashout = await CashOut.findById(id);
        if (!cashout) {
            return res.status(404).json({ message: 'Cashout request not found' });
        }
        res.status(200).json(cashout);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a cashout request
export const createCashOut = async (req: Request, res: Response) => {
    try {
        const { userId, amount } = req.body;
        const cashout = new CashOut({
            user: userId,
            amount,
            status: 'pending'
        });
        await cashout.save();
        res.status(201).json(cashout);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update cashout status
export const updateCashOutStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const cashout = await CashOut.findByIdAndUpdate(id, { status }, { new: true });
        if (!cashout) {
            return res.status(404).json({ message: 'Cashout request not found' });
        }
        res.status(200).json(cashout);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a cashout request
export const deleteCashOut = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cashout = await CashOut.findByIdAndDelete(id);
        if (!cashout) {
            return res.status(404).json({ message: 'Cashout request not found' });
        }
        res.status(200).json({ message: 'Cashout request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
