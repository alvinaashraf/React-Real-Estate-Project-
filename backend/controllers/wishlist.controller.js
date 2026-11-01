import WishList  from "../models/wishlist.models.js ";

// add to property to wishlist 

export const addWishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const existing = await WishList.findOne({
            user: req.user._id,
            property: propertyId
        })

        if(existing){
            return res.status(200).json({
                success: true, 
                message: "Already in Wishlist"
            })
        }

        await WishList.create({
               user: req.user._id,
            property: propertyId
        })

        res.status(200).json({
            success: true, 
            message:"Added to WishList"
        })
    }  
    
    catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error adding wishlist  ",

    });
    }
}



// get proprrty inside wishlist 

export const getWishlist = async (req, res) =>{
    try {
        const data = await WishList.find({
            user: req.user._id 
        }).populate("property")

           res.status(200).json({
            success: true, 
            data, 
            message:"Wishlist Successfully Rendered"
        })
        
    } catch (error) {
            res.status(500).json({
      success: false,
      message: error.message || "Error getting  wishlist  ",

    });
    }
}



// remove from wishlist 

export const removeWishlist = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const result = await WishList.findOneAndDelete({
                 user: req.user._id,
            property: propertyId
        })


        if(!result){
            return res.status(404).json({
                success: false, 
                message: "Wishlist not Found "
            })


        }


            res.status(200).json({
            success: true, 
            data, 
            message:"Wishlist Removed Successfully"
        })


    } 
    
    catch (error) {
             res.status(500).json({
      success: false,
      message: error.message || "Error removing   wishlist  ",

    });
    }
}