import { verifyToken } from '../config/jwt'
import User from '../app/models/User'

export default async (req, res, next) => {
  const authorization = req.headers['authorization']

  const token = authorization?.replace('Bearer ', '')

  try {
    const decoded = await verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorize' })
    }

    const user = await User.query().findOne({
      id: decoded.id,
      email: decoded.email
    })

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.decoded = decoded
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorize' })
  }

  next()
}
