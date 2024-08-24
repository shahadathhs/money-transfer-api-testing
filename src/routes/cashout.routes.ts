import express from "express";
import { 
  createCashOut, 
  deleteCashOut, 
  getAllCashOuts, 
  getCashOutById, 
  updateCashOutStatus 
} from "../controllers/cashout.controller";

const router = express.Router();

router.get("/", getAllCashOuts);
router.get("/:id", getCashOutById);
router.post("/", createCashOut);
router.put("/:id", updateCashOutStatus);
router.delete("/:id", deleteCashOut);

export default router;