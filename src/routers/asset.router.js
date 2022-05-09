// General imports
import { Router } from 'express'
import * as assetController from '../controllers/asset.controller'


// Local middlewares
import { verifyToken } from '../middlewares/tokenVerify'
import { isInvestor, isPromoter } from '../middlewares/roles'
import multer from '../libs/multer'


// Initializations
const router = Router()


// Get the assets from contracts. Route: /api/assets
router.get('/', verifyToken, assetController.getAssets)
// Create new asset. Route: /api/assets. Required: Promoter rol and token authentication
router.post('/newAsset', verifyToken, isPromoter, multer.fields([{name: 'whitepaper'},{name: 'brochure'},{name: 'legacy_docs'}]), assetController.newAsset)
// Deploy token
router.post('/deployToken', verifyToken, isPromoter, assetController.deployToken)
// Buy token and register transaction in our local database.
router.post('/buyTokens', verifyToken, isInvestor, assetController.buyTokenByAsset)
// Claim tokens and update database
router.post('/claimTokens', verifyToken, isInvestor, assetController.claimTokenByAsset)


// Export router
export default router