export const runtime = 'node';
import jwt from 'jsonwebtoken'

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded

      return handler(req, res)
    } catch (error) {
      console.error('Auth error:', error)
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}