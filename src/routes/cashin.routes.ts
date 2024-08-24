import express from 'express';
import { 
  createCashIn, 
  deleteCashIn, 
  getAllCashIn, 
  getCashInById, 
  updateCashInStatus 
} from '../controllers/cashin.controller';

const router = express.Router();

router.get('/', getAllCashIn);
router.get('/:id', getCashInById);
router.post('/', createCashIn);
router.put('/:id', updateCashInStatus);
router.delete('/:id', deleteCashIn);

export default router;