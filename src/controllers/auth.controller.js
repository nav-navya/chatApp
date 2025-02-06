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
  (req,res)=>{
    res.send("login route")
  }

  export const logout = 
  (req,res)=>{
    res.send("logout route")
  }