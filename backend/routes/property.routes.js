import express from 'express'
import { getAllProperties } from '../controllers/property.controller.js ';
import { authorize, protect } from '../middlewares/auth.middleware';
import { addProperty, deleteProperty, getMyProperties, getPropertyCount, getPropertyDetails, getSellerDashboard, updateProperty, updatePropertyStatus } from '../controllers/property.controller';



const propertyRouter = express.Router();

propertyRouter.get("/", getAllProperties)

// protected routes 

propertyRouter.post("/", protect, authorize("seller"), upload.array("images", 10), addProperty)
propertyRouter.get("/my", protect, authorize("seller"), getMyProperties)
propertyRouter.put("/:id" , protect, authorize("seller"), upload.array("images", 10), updateProperty)
propertyRouter.delete("/:id", protect, authorize("seller"),deleteProperty )
propertyRouter.patch("/:id/status", protect, authorize("seller"), updatePropertyStatus )
propertyRouter.get("/counts", getPropertyCount)
propertyRouter.get('/:id', getPropertyDetails)
propertyRouter.get("/seller/dashboard", protect, authorize("seller"), getSellerDashboard)


export default propertyRouter