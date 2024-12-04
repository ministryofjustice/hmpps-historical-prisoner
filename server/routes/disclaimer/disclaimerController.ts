import { Request, Response } from 'express'
import HmppsError from '../../interfaces/HmppsError'

export default class DisclaimerController {
  constructor() {}

  async getDisclaimer(req: Request, res: Response): Promise<void> {
    if (req.session.disclaimerConfirmed) return res.redirect('/search')

    return res.render('pages/disclaimer')
  }

  async postDisclaimer(req: Request, res: Response): Promise<void> {
    if (!req.body.disclaimer) {
      res.status(400)
      const errors: HmppsError[] = [
        { href: '#disclaimer', text: 'You must confirm that you understand the disclaimer' },
      ]
      return res.render('pages/disclaimer', { errors })
    }

    req.session.disclaimerConfirmed = true
    return res.redirect('/search')
  }
}
