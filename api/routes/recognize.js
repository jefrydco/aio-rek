import { Router } from 'express'
import { recognize } from '../utils/multer'
import { get, post } from '../controllers/recognize'

const router = Router()

router.get('/recognize', get)
router.post('/recognize', recognize, post)

export default router
