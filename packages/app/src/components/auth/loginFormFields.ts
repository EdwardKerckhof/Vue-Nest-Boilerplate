import { IFormInput } from '../../@types/IFormInput'

export const loginFormFields: IFormInput[] = [
  {
    id: 0,
    type: 'email',
    name: 'email',
    required: true,
    inputs: [],
    values: [''],
    labels: ['Email'],
    placeholders: [],
    validators: ['required', 'email']
  },
  {
    id: 1,
    type: 'password',
    name: 'password',
    required: true,
    inputs: [],
    values: [''],
    labels: ['Password'],
    placeholders: [],
    validators: ['required']
  }
]
