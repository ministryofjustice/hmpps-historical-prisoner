import express from 'express'

export default function setUpDisclaimer() {
  const router = express.Router()

  router.use((req, res, next) => {
    // ensure that any users to the site have accepted the disclaimer
    if (req.url !== '/disclaimer' && !req.session.disclaimerConfirmed) return res.redirect('/disclaimer')

    return next()
  })

  return router
}
