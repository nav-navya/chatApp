import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../modules/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req,res)=>{
  // console.log("issss",req.body)
  const {fullName ,email,password } = req.body;
  try{
    if(!fullName || !email || !password){
      return res.status(400).json({message:"all fields are required"})
    } 
    //hash password
    if(password.length < 6){
     return res.status(400).json({message:"password must be atleast 6 character"})
    }

    const user = await User.findOne({email})
    if(user){
      return res.status(400).json({message:"email already exists"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const newUser = new User({
      fullName:fullName,
      email:email,
      password:hashedPassword
    })

    if(newUser){
      //generate jwt 
      generateToken(newUser._id,res)
      await newUser.save()

      res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,
      })


    }else{
      res.status(400).json({message:"Invalid user data"})
    }


  }catch(error){
    console.log("error in signup controller",error.message)
    res.status(500).json({message:"Internal server error"})

  }
  }



  export const login = 
  async (req,res)=>{
    const {email , password } = req.body;
    try{
      const user = await User.findOne({email})
        if(!user){
          return res.status(400).json({message:"invalid credentials"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
          return res.status(400).json({message:"invalid credentials"})

        }
        generateToken(user._id,res)
        res.status(200).json({
          _id:user._id,
          fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic

        })  

    }catch(error){
      console.log("error in the login controller",error.message)
      return res.status(500).json({message:"internal server error"})

    }
    

   
  }



  export const logout = 
  (req,res)=>{
    try{
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json({message:"loggedout successfully"})

    }catch(error){
      console.log("error in logout controller",error.message)
      res.status(500).json({message:"Internal server error"})

    }
   
  }



  export const updateProfile = async(req,res)=>{
    try{
      const {profilePic} = req.body;
      const userId=req.user._id  

      if(!profilePic){
        return res.status(404).status({message:"provide a profile pic"})
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic)

      const userUpdate = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

      res.status(200).json(userUpdate)

    }catch(error){
      console.log("error in updating profile..",error)
      res.status(500).json({message:"internal server error"})


    }

  }

  export const checkAuth =  ((req,res)=>{
    try{
      res.status(200).json(req.user);
    }
    catch(error){
      console.log("error in checkauth controller",error.message);
      res.status(500).json({message:"internal server error"})

    }
  


  })