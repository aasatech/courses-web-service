
import User from "../models/User"

export const register = (req, res) => {
  console.log(req.body)
  res.status(200).json({})
}

export const login  = (req, res) => {
  console.log(req.body)
  res.status(200).json({mgs: "ok" })

}

