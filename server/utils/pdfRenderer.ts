import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'

import GotenbergClient, { PdfMargins } from '../data/gotenbergClient'
import logger from '../../logger'

export type PdfPageData = { adjudicationsUrl: string } & Record<string, unknown>
export type PdfHeaderData = Record<string, unknown>
export type PdfFooterData = Record<string, unknown>

export function pdfRenderer(client: GotenbergClient) {
  function readAssetCss() {
    try {
      // have to go to the manifest to translate to the real path of the css file e.g. /assets/css/app.ESCUP4HF.css
      const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
      const assetManifest: Record<string, string> = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
      const cssPath = '/assets/css/app.css'
      const realCssPath = assetManifest[cssPath] || cssPath
      // and then read the file. This saves gotenberg then having to fetch the css file from the node instance
      return fs.readFileSync(path.resolve(__dirname, `../../${realCssPath}`), 'utf8')
    } catch (e) {
      if (process.env.NODE_ENV !== 'test') {
        logger.error(e, 'Could not read asset css file')
      }
      return null
    }
  }

  return (_req: Request, res: Response, next: NextFunction) => {
    res.renderPdf = (
      pageView: string,
      pageData: PdfPageData,
      headerView: string,
      headerData: PdfHeaderData,
      footerView: string,
      footerData: PdfFooterData,
      options: { filename: string; pdfMargins: PdfMargins },
    ) => {
      res.render(headerView, headerData, (headerError: Error, headerHtml: string) => {
        if (headerError) {
          throw headerError
        }
        res.render(footerView, footerData, (footerError: Error, footerHtml: string) => {
          if (footerError) {
            throw footerError
          }
          res.render(pageView, pageData, (bodyError: Error, pageHtml: string) => {
            if (bodyError) {
              throw bodyError
            }

            client
              .renderPdfFromHtml(pageHtml, headerHtml, footerHtml, readAssetCss(), options?.pdfMargins)
              .then(buffer => {
                res.header('Content-Type', 'application/pdf')
                res.header('Content-Transfer-Encoding', 'binary')
                res.header('Content-Disposition', `attachment; filename=${options.filename}`)
                res.send(buffer)
              })
              .catch(error => {
                next(error)
              })
          })
        })
      })
    }
    next()
  }
}
