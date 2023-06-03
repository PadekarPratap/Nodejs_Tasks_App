import express from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/user.js'
import { isAuthenticated } from '../middleware/auth.js'


const router = express.Router()

// to create a new user
router.post('/new',registerUser )

// to login an existing user
router.post('/login', loginUser)

// to get the profile details
router.get('/profile', isAuthenticated, getUserProfile)

// to logout the user
router.get('/logout', logoutUser)

export default router