
import User from "../models/User"
import {generateToken} from "../../config/jwt"
import {validationResult} from "express-validator"
import _ from "lodash"

export const register = async (req, res) => {
  try{
    const {name,username, email, password, password_confirmation} = req.body

    const result = validationResult(req)

    // console.log(result)
    if(!result.isEmpty()){
      return res.status(400).json({errors: _.groupBy(result.array(), 'path')})
    }

    if(!password) return res.status(400).json({msg: "Password is missing"})
    
    if(password !== password_confirmation) return res.status(400).json({msg: "Password is not match"})

    const encryptedPassword = await User.generatePassword(password)

    const user = await User.query().insert({
      name,
      username,
      email,
      password_encrypted: encryptedPassword
    })

    res.status(200).json(user)
  }catch(error){
    res.status(500).json({error: error.message})
  }
}


export const login  =async (req, res) => {
  try {
    const {email, password} = req.body
    
    const user = await User.query().findOne({email})

    if(!user) return res.status(400).json({msg: "Invalid email 1 or password"})

    const isValid = await user.comparePassword(password)

    if(!isValid) return res.status(400).json({msg: "Invalid email  2or password"})

    const token = await generateToken(user)

    res.status(200).json({token})

  } catch (error) {
    res.status(500).json({error: error.message})    
  }
}

