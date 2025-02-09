import jwt from 'jsonwebtoken'
import User from '../modules/user.model.js'

export const protectRoute = async (req,res,next) =>{
  try{
    const token = req.cookies.jwt

    if(!token) {
      return res.status(401).json({message:"un-authorized  user"})   }

      const decoded = jwt.verify(token,process.env.JWT_SECRET)

      if(!decoded){
        return res.status(401).json({message:"unauthorized -Invalid tokken"})
      }

      const user = await User.findById(decoded.userId).select("-password");

      if(!user){
        return res.status(404).json({message:"User not found"})
      }

      req.user = user
      next()

  }catch(error){
    console.log("error in protecting route middleware",error.message)
    return res.status(404).json({message:"internal server error"})

  }
}