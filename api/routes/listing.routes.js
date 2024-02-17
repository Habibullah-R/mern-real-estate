import express from 'express'
import { createListing , deleteListing , updateListing ,getListings } from '../controllers/listing.controller.js'
import { verifyToken } from '../utills/verifyUser.js'

const router = express.Router()

router.post('/create', verifyToken , createListing)
router.delete('/delete/:id', verifyToken , deleteListing)
router.post('/update/:id', verifyToken , updateListing)
router.get('/get/:id',getListings)

export default router;