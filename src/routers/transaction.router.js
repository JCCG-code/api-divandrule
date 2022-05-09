// General imports
import { Router } from 'express'
import * as transactionController from '../controllers/transaction.controller'


// Local middlewares
import { verifyToken } from '../middlewares/tokenVerify'
import { isInvestor } from '../middlewares/roles'
import multer from '../libs/multer'


// Initializations
const router = Router()


// Get the transactions from contracts. Route: /api/transactions
router.get('/', verifyToken, isInvestor, transactionController.getTransactions)


// Export router
export default router