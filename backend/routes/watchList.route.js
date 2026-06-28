import {Router} from 'express'
import * as watchListController from '../controllers/watchList.controller.js'
import { authMiddleware } from '../utils/auth.utils.js'

const router = Router()

router.get('/all',authMiddleware, watchListController.getWatchList)
router.get('/:id',authMiddleware, watchListController.getWatchListById)
router.post('/:id',authMiddleware, watchListController.addWatchList)
router.patch('/:id',authMiddleware, watchListController.updateWatchList)

export default router