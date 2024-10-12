interface UserProfileField {
  label: string;
  id: string;
  name: string;
  type: string;
}


export const userProfileFields: UserProfileField[] = [
  {
    label: 'First Name',
    id: 'first-name',
    name: 'firstName',
    type: 'text'
  },
  {
    label: 'Last Name',
    id: 'last-name',
    name: 'lastName',
    type: 'text'
  },
  {
    label: 'Address One',
    id: 'address-one',
    name: 'addressOne',
    type: 'text'
  },
  {
    label: 'Address Two',
    id: 'address-two',
    name: 'addressTwo',
    type: 'text',
  },
  {
    label: 'Phone Number',
    id: 'phone-number',
    name: 'phoneNumber',
    type: 'text'
  },
  {
    label: 'Cell Phone',
    id: 'cell-phone',
    name: 'cellPhoneNumber',
    type: 'text',
  },
  {
    label: 'city',
    id: 'city',
    name: 'city',
    type: 'text',
  },
  {
    label: 'country',
    id: 'country',
    name: 'country',
    type: 'text',
  },
  {
    label: 'image',
    id: 'image',
    name: 'image',
    type: 'file',
  },
]
