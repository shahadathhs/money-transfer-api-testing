import express from 'express';
import { deleteSendMoneyTransaction, getAllSendMoneyTransactions, getSendMoneyTransactionById, sendMoney } from '../controllers/sendmoney.controller';

const router = express.Router();

router.post('/', sendMoney);
router.get('/', getAllSendMoneyTransactions);
router.get('/:id', getSendMoneyTransactionById);
router.delete('/:id', deleteSendMoneyTransaction);

export default router;