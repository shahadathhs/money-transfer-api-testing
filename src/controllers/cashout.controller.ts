import { Request, Response } from "express";
import CashOut from "../models/cashout.model";
import { isValidObjectId } from "mongoose";

// Get all cashout requests
export const getAllCashOuts = async (req: Request, res: Response) => {
  try {
    const cashouts = await CashOut.find();

    if (!cashouts || cashouts.length === 0) {
      return res.status(404).json({ message: "No cashout requests found" });
    }

    res.status(200).json(cashouts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a cashout request by ID
export const getCashOutById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Cashout ID is not valid! Please enter a valid cashout id",
      });
    }

    const cashout = await CashOut.findById(id);
    if (!cashout) {
      return res.status(404).json({ message: "Cashout request not found" });
    }
    res.status(200).json(cashout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a cashout request
export const createCashOut = async (req: Request, res: Response) => {
  try {
    const  { amount, agentId, requesterId } = req.body;
    if (!amount || !agentId || !requesterId) {
      return res.status(400).json({ message: "All fields are required" });
    };

    const cashout = await CashOut.create(req.body);
    res.status(201).json(cashout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
// Update cashout status
export const updateCashOutStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Cashout ID is not valid! Please enter a valid cashout id",
      });
    };

    if (!status) {
      return res.status(401).json({ message: "Status is required" });
    }

    const cashout = await CashOut.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!cashout) {
      return res.status(404).json({ message: "Cashout request not found" });
    }
    res.status(200).json(cashout);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a cashout request
export const deleteCashOut = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "Cashout ID is not valid! Please enter a valid cashout id",
      });
    };

    const cashout = await CashOut.findByIdAndDelete(id);
    if (!cashout) {
      return res.status(404).json({ message: "Cashout request not found" });
    }
    res.status(200).json({ message: "Cashout request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
