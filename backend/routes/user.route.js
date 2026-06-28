import {Router} from 'express'
import * as userController from '../controllers/user.controller.js'
import { authMiddleware } from '../utils/auth.utils.js'

const router = Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/all',authMiddleware, userController.getAllUsers)
router.patch('/me',authMiddleware, userController.patchUser)


export default router