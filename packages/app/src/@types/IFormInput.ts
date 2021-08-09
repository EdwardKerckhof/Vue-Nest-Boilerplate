export interface IFormInput {
  type: string
  required: boolean
  value?: string
  placeholders: string[]
  validators: string[]
  labels: string[]
  inputs?: string[]
}
