import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import sendEmail from '../utils/sendEmail.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
// register 

export const register = async (req, res) => {
    try{

        const {name, email, password, role} = req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({message:"User Already Exists "})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            verificationToken,
            isApproved : role === "seller" ? false : true
        });

        try {
            await sendEmail({
                email, 
                subject: "Verify your Email ", 
                message: `<p> Your verification code is : <b>${verificationToken}</b></p>`
            })
        } catch (error) {
            console.error("Error sending verification email:", error);
        }
         res.status(201).json(
            {message: "User created successfully check email for verifiction code ", user, 

              user:{
            email: user.email, 
            name: user.name, 
            role: user.role
         }

         });

       


    }
 catch(err){
        res.status(500).json({message: err.message})
    }


}
       

   
// login user 

export const login = async (req, res) => {

    try {

        const {email, password } = req.body; 
        if(!email || !password){
            return res.status(400).json({message:"Please provide email and password "})
        }

        const user = await User.findOne({email}); 
        if(!user){
            return res.status(400).json({message:"Invalid Credentials "})
        }

        if(!user.isVerified){
            return res.status(400).json({message:"Please verify your email first "})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials "})
        }

        if(user.isBlocked ){
            return res.status(403).json({message:"Your account has been blocked. Please contact support for assistance."})
        }

        // token generation 

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.json({message:"Login Successful ", token, user:{
            email: user.email, 
            name: user.name, 
            role: user.role
         }})


    } catch (error) {
        res.status(500).json({message: error.message})
    }
}




// to get profile of user which is already created 
export const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select('-password ');
        if(!user){
            return res.status(404).json({message:"User not found "})
        }
        res.json({success: true,message:"Profile retrieved successfully ", user})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// verify email 

export const verifyEmail = async(req, res) => {

    try {
        const {email, code } = req.body; 
        if(!email || !code){
            return res.status(400).json({message: "Email and Verification Code are Required "})
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not Found  "})
        }
        if(user.isVerified){
            return res.status(400).json({message: "User is already verified "})
        }

        if(user.verificationToken !== code){
            return res.status(400).json({message: "Invalid Verification Code "})
        }

        user.isVerified = true;
        user.verificationToken = undefined; 
        await user.save();
        res.status(200).json({message: "Email Verified Successfully ", success: true })



    } catch (error) {
           res.status(500).json({message: error.message})
    }
}

//forgot password 

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No user found with that email address" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        const clientUrl = "http://localhost:5173";
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
        const message = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click on the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>This link will expire in 15 minutes.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset - Real Estate Platform",
                message,
            });
            res.status(200).json({ message: "Password reset email sent", success: true });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: "Could not send email", success: false });
        }
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
};


// reset password 

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params; 
        const {password } = req.body; 
        const resetPasswordToken =  crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}
        });

        if(!user) {
            return res.status(400).json({message: "INvalid or expired password toekn  ", success: false})
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpire = undefined; 
        await user.save();

        res.status(200).json({message: "Password reset successful ", success: true})
    } 
    
    catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}