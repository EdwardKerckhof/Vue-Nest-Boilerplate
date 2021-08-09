import { IFormInput } from '../../../@types/IFormInput'

export const registerFormFields: IFormInput[] = [
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
    type: 'group',
    name: 'nameGroup',
    required: true,
    inputs: ['text', 'text'],
    values: ['', ''],
    labels: ['Full name'],
    placeholders: ['first name', 'last name'],
    validators: ['required']
  },
  {
    id: 2,
    type: 'group',
    name: 'passwordGroup',
    required: true,
    inputs: ['password', 'password'],
    values: ['', ''],
    labels: ['Password'],
    placeholders: ['password', 'repeat password'],
    validators: ['required']
  }
]
