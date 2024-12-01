import { components, operations } from './index'

export type PrisonerSearchDto = components['schemas']['PrisonerSearchDto']
export type PagedModelPrisonerSearchDto = components['schemas']['PagedModelPrisonerSearchDto']

export type FindPrisonersByName = Omit<operations['findPrisoners']['parameters']['query'], 'pageRequest'>
export type FindPrisonersByIdentifiers = Omit<
  operations['findPrisonersWithIdentifiers']['parameters']['query'],
  'pageRequest'
>
export type FindPrisonersByAddress = Omit<
  operations['findPrisonersWithAddresses']['parameters']['query'],
  'pageRequest'
>
