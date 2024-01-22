import expressip from 'express-ip'
import routers from '../routes'

require('express-async-errors')

export default app => {
  app.use(expressip().getIpInfoMiddleware)
  app.use('/api/v1', routers)

  app.use((req, res, next) => {
    return res.status(404).json({ message: 'Not found' })
  })

  app.use((err, req, res, next) => {
    return res.status(500).json({ message: err.message })
  })
}
