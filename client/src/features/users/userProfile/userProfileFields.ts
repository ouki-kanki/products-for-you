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
    name: 'first_name',
    type: 'text'
  },
  {
    label: 'Last Name',
    id: 'last-name',
    name: 'last_name',
    type: 'text'
  },
  {
    label: 'Address One',
    id: 'address-one',
    name: 'address_one',
    type: 'text'
  },
  {
    label: 'Address Two',
    id: 'address-two',
    name: 'address_two',
    type: 'text',
  },
  {
    label: 'Phone Number',
    id: 'phone-number',
    name: 'phone_number',
    type: 'text'
  },
  {
    label: 'Cell Phone',
    id: 'cell-phone',
    name: 'cell_phone_number',
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
