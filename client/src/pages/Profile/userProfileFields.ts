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
    label: 'Email',
    id: 'email',
    name: 'email',
    type: 'email'
  },
  {
    label: 'Shipping Address',
    id: 'address-one',
    name: 'addressOne',
    type: 'text'
  },
  {
    label: 'Billing Address',
    id: 'address-two',
    name: 'addressTwo',
    type: 'text',
  },
  {
    label: 'City',
    id: 'city',
    name: 'city',
    type: 'text',
  },
  {
    label: 'Zip code',
    id: 'zip',
    name: 'postalCode',
    type: 'text',
  },
  {
    label: 'Country',
    id: 'country',
    name: 'country',
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
    label: 'image',
    id: 'image',
    name: 'image',
    type: 'file',
  },
]
