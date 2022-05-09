// General imports
import { Router } from 'express'
import multer from '../libs/multer'
import * as userController from '../controllers/user.controller'


// Initializations
const router = Router()


// Get KYC data for user
router.post('/kyc', multer.fields([{name: 'obverseDNI'},{name: 'reverseDNI'},{name: 'selfie'}]), userController.getKYC)


// Export router
export default router