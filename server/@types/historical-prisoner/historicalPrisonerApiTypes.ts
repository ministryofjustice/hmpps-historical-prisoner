import { components, operations } from './index'

export type PagedModelPrisonerSearchDto = components['schemas']['PagedModelPrisonerSearchDto']
export type PrisonerDetailDto = components['schemas']['PrisonerDetailDto']
export type PageMetaData = components['schemas']['PageMetadata']

export type FindPrisonersByName = Omit<operations['findPrisoners']['parameters']['query'], 'pageRequest'>
export type FindPrisonersByIdentifiers = Omit<
  operations['findPrisonersWithIdentifiers']['parameters']['query'],
  'pageRequest'
>
export type FindPrisonersByAddress = Omit<
  operations['findPrisonersWithAddresses']['parameters']['query'],
  'pageRequest'
>
export type GetPrisonerDetail = operations['getDetail']['parameters']['path']
