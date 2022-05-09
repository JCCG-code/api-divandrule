// General imports
import { Router } from 'express'
import * as superadminController from '../controllers/superadmin.controller'
import { isSuperAdmin } from '../middlewares/roles'


// Initializations
const router = Router()


// Get KYC data for user. Route: api/superadmin/kycVerify
router.get('/kycVerify', isSuperAdmin, superadminController.verifyKYC)
// Receive users verified by admin and update database (KYCState: 2). Route: api/superadmin/kycVerified
router.post('/kycVerified', isSuperAdmin, superadminController.verifiedKYC)
// Receive users denied by admin and update database (KYCState: -1). Route: api/superadmin/kycDenied
router.post('/kycDenied', isSuperAdmin, superadminController.deniedKYC)
// Get all users. Route: api/superadmin/getUsers
router.get('/getUsers', isSuperAdmin, superadminController.getUsers)
// Update user by id
router.post('/updateUser', isSuperAdmin, superadminController.updateUser)
// Remove user by id
router.post('/deleteUser', isSuperAdmin, superadminController.deleteUser)
// Approve asset
router.post('/approveAsset', isSuperAdmin, superadminController.approveAsset)

// Export router
export default router
