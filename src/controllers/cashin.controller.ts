import { Request, Response } from "express";
import CashIn from "../models/cashin.model";
import { isValidObjectId } from "mongoose";

export const getAllCashIn = async (req: Request, res: Response) => {
  try {
    const cashins = await CashIn.find();

    if (!cashins || cashins.length === 0) {
      return res.status(200).json([]);
    };

    res.status(200).json(cashins);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching cashins', error });
  }
};

export const getCashInById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // if id is not provided then it will hit get all cashin api

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        message: 'Cashin ID is not valid! Please enter a valid cashin id' 
      });
    }

    const cashin = await CashIn.findById(id);
    if (!cashin) {
      return res.status(404).json({ message: 'Cashin request not found' });
    }
    res.status(200).json(cashin);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching cashin', error });
  }
};

export const createCashIn = async (req: Request, res: Response) => {
  try {
    const { amount, agentId, requesterId } = req.body;
    
    if (!amount || !agentId || !requesterId) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cashin = new CashIn({ amount, agentId, requesterId });
    if (!cashin) {
      return res.status(400).json({ message: 'Cashin request not created' });
    }
    await cashin.save();
    res.status(201).json(cashin);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating cashin', error });
  }
};

export const updateCashInStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Cashin ID is not valid! Please enter a valid cashin id'
      });
    }

    const cashin = await CashIn.findByIdAndUpdate(id, { status }, { new: true });
    if (!cashin) {
      return res.status(404).json({ message: 'Cashin request not found' });
    }
    res.status(200).json(cashin);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating cashin', error });
  }
};

export const deleteCashIn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) { 
      return res.status(400).json({
        message: 'Cashin ID is not valid! Please enter a valid cashin id'
      });
    }

    const cashin = await CashIn.findByIdAndDelete(id);
    if (!cashin) {
      return res.status(404).json({ message: 'Cashin request not found' });
    }
    res.status(200).json({ message: 'Cashin request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};