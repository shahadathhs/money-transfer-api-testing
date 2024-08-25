import { Request, Response } from 'express';
import User from '../models/user.model';
import { Document, isValidObjectId, Types } from 'mongoose';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Server error while fetching users',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get user by id
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        
        // if (!userId) {
        //     return res.status(400).json({ message: 'User ID is required' });
        // }
        // if there is no id it will hit get all users api

        if(!isValidObjectId(userId)){
            return res.status(400).json({ 
                message: 'User ID is not valid! Please enter a valid user id' 
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Server error while fetching the user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        if(!isValidObjectId(userId)){
            return res.status(400).json({
                message: 'User ID is not valid! Please enter a valid user id'
            });
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(401).json({ message: 'Update data is required' });
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true })

        if (!user) {
            return res.status(404).json({ message: 'User not found or update failed' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Server error while updating the user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Server error while deleting the user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
