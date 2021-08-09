export interface IFormInput {
  id: number
  type: string
  required: boolean
  values?: string[]
  placeholders: string[]
  validators: string[]
  labels: string[]
  inputs?: string[]
}
