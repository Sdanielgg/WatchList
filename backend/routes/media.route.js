import {Router} from 'express'
import * as mediaController from '../controllers/media.controller.js'
import { authMiddleware } from '../utils/auth.utils.js'

const router = Router()

router.get('/all',authMiddleware, mediaController.getAllMedia)
router.get('/:id',authMiddleware, mediaController.getMediaById)
router.post('/',authMiddleware, mediaController.createMedia)
router.patch('/:id',authMiddleware, mediaController.patchMedia)

export default router