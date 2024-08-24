import { Request, Response } from "express";
import CashIn from "../models/cashin.model";

export const getAllCashIn = async (req: Request, res: Response) => {
  try {
    const cashins = await CashIn.find();
    res.status(200).json(cashins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCashInById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cashin = await CashIn.findById(id);
    if (!cashin) {
      return res.status(404).json({ message: 'Cashin request not found' });
    }
    res.status(200).json(cashin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createCashIn = async (req: Request, res: Response) => {
  try {
    const { amount, agentId, requesterId } = req.body;
    const cashin = new CashIn({ amount, agentId, requesterId });
    await cashin.save();
    res.status(201).json(cashin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCashInStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const cashin = await CashIn.findByIdAndUpdate(id, { status }, { new: true });
    if (!cashin) {
      return res.status(404).json({ message: 'Cashin request not found' });
    }
    res.status(200).json(cashin);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteCashIn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cashin = await CashIn.findByIdAndDelete(id);
    if (!cashin) {
      return res.status(404).json({ message: 'Cashin request not found' });
    }
    res.status(200).json({ message: 'Cashin request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};