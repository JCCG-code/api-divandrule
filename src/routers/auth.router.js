// General imports
import { Router } from 'express'
import * as authController from '../controllers/auth.controller'


// Initializations
const router = Router()


// Auth Sign In. Route: /api/auth/signIn
router.post('/signIn', authController.signIn)
// Auth Sign Up. Route: /api/auth/signUp
router.post('/signUp', authController.signUp)
// Verify authentication and return user: /api/auth/user
router.post('/user', authController.getUserByToken)

// Export router
export default router