import express from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import { addWishlist, getWishlist, removeWishlist } from '../controllers/wishlist.controller.js'


const wishListRouter = express.Router()

wishListRouter.post("/:propertyId", protect, addWishlist)
wishListRouter.get("/", protect, getWishlist)
wishListRouter.delete("/:propertyId", protect, removeWishlist)

export default wishListRouter   