export default role => async (req, res, next) => {
  try {
    if (!role.includes(req.account.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    next()
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
