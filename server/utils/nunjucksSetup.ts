/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { initialiseName } from './utils'
import { acronymsToUpperCase, spaceHyphens } from './textHelpers'
import config from '../config'
import logger from '../../logger'
import { buildErrorSummaryList, findError } from '../middleware/validationMiddleware'
import { formatDate, getAge } from './dateHelpers'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'HMPPS Historical Prisoner'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/hmpps-connect-dps-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )
  njkEnv.addFilter('buildErrorSummaryList', buildErrorSummaryList)
  njkEnv.addFilter('findError', findError)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('getAge', getAge)
  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('acronymsToUpperCase', acronymsToUpperCase)
  njkEnv.addFilter('spaceHyphens', spaceHyphens)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('categoryFilters', (searchFilters: string[]) => {
    const hrefBase = '/search/results?page=1'
    if (searchFilters === undefined) {
      searchFilters = []
    }
    const categories = [
      {
        heading: {},
        items: [
          {
            href: `${hrefBase}&${filterQuery(searchFilters, 'male')}`,
            text: 'Male',
            selected: searchFilters.includes('male'),
          },
          {
            href: `${hrefBase}&${filterQuery(searchFilters, 'female')}`,
            text: 'Female',
            selected: searchFilters.includes('female'),
          },
          {
            href: `${hrefBase}&${filterQuery(searchFilters, 'lifer')}`,
            text: 'Lifer',
            selected: searchFilters.includes('lifer'),
          },
          {
            href: `${hrefBase}&${filterQuery(searchFilters, 'hdc')}`,
            text: 'HDC',
            selected: searchFilters.includes('hdc'),
          },
        ],
      },
    ]

    return {
      categories: categories.filter(category => category.items),
    }
  })
}

function filterQuery(currentFilters: string[], searchFilter: string): string {
  const searchParams = new URLSearchParams()
  let filters = Array.from(currentFilters)

  if (currentFilters.includes(searchFilter)) {
    // remove it
    filters = filters.filter(item => item !== searchFilter)
  } else {
    filters.push(searchFilter)
  }
  filters.forEach(entry => {
    searchParams.append('filters', entry)
  })
  return searchParams.toString()
}
