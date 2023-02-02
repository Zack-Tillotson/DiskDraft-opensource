export const columnTypes = [
  'Text',
  'Number',
  'Draft ID',
  'Image',
  'Height',
  'Weight',
  'Gender',
  'Image & Name'
];

const defaultColumnValue = {
  id: '',
  display: '',
  required: false,
  visible: true,
  primary: false,
  type: 'Text',
  order: 10000,
  include: undefined
};

export const vector = {
  id: 'vector',
  display: 'Vector',
  required: true,
  visible: true,
  primary: true,
  type: 'Number',
  order: 11.5,
  include: true
};

let order = 0;

export const defaultColumnValues = {
  player: {
    ...defaultColumnValue,
    required: true,
    type: 'Image & Name',
    visible: true,
    primary: true,
    include: true,
    order: order++
  },
  id: {
    ...defaultColumnValue,
    required: true,
    type: 'TopScore ID',
    primary: true,
    visible: false,
    include: true,
    order: order++
  },
  draft_id: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    summary: true,
    type: 'Draft ID',
    display: 'ID',
    order: order++
  },
  registration_id: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    type: 'Registration ID',
    visible: false,
    order: order++
  },
  image: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    display: 'Photo',
    type: 'Image',
    visible: false,
    order: order++
  },
  first_name: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    display: 'First',
    visible: false,
    order: order++
  },
  nickname: {
    ...defaultColumnValue,
    required: true,
    type: 'Nickname',
    order: order++
  },
  last_name: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    display: 'Last',
    visible: false,
    order: order++
  },
  gender: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    type: 'Gender',
    order: order++
  },
  age: {
    ...defaultColumnValue,
    primary: true,
    type: 'Number',
    display: 'Age',
    order: order++
  },
  height: {
    ...defaultColumnValue,
    primary: true,
    required: true,
    type: 'Height',
    order: order++
  },
  weight: {
    ...defaultColumnValue,
    type: 'Weight',
    order: order++
  },
  vector,
  email_address: {
    ...defaultColumnValue,
    type: 'Text',
    display: 'Email',
    order: order++
  },
  baggage_group_id: {
    ...defaultColumnValue,
    required: true,
    primary: true,
    visible: false,
    type: 'Baggage Group ID',
    order: order++
  },
  status: {
    ...defaultColumnValue,
    include: false
  },
  is_baggage_owner_approved: {
    ...defaultColumnValue,
    include: false
  },
  is_baggage_user_approved: {
    ...defaultColumnValue,
    include: false
  },
  role: {
    ...defaultColumnValue,
    include: false
  },
  team_id: {
    ...defaultColumnValue,
    include: false
  },
  type: {
    ...defaultColumnValue,
    include: false
  },
  address_1: {
    ...defaultColumnValue,
    include: false
  },
  address_2: {
    ...defaultColumnValue,
    include: false
  },
  locality: {
    ...defaultColumnValue,
    include: false
  },
  region: {
    ...defaultColumnValue,
    include: false
  },
  postal_code: {
    ...defaultColumnValue,
    include: false
  },
  country: {
    ...defaultColumnValue,
    include: false
  },
  primary_phone_number: {
    ...defaultColumnValue,
    include: false
  },
  shirt_size: {
    ...defaultColumnValue,
    include: false
  },
  emergency_contact: {
    ...defaultColumnValue,
    include: false
  },
  team_name: {
    ...defaultColumnValue,
    include: false
  },
  roles: {
    ...defaultColumnValue,
    include: false
  },
  uniform_number: {
    ...defaultColumnValue,
    include: false
  },
  registered_at: {
    ...defaultColumnValue,
    include: false
  },
  registered_by: {
    ...defaultColumnValue,
    include: false
  },
  memo: {
    ...defaultColumnValue,
    include: false
  },
  is_opted_in: {
    ...defaultColumnValue,
    include: false
  },
  photo_url: {
    ...defaultColumnValue,
    include: false
  },
  baggage: {
    ...defaultColumnValue,
    include: false
  },
  coupons: {
    ...defaultColumnValue,
    include: false
  },
  products: {
    ...defaultColumnValue,
    include: false
  },
  __products__: {
    // Special ID that will be used for any column who's id starts with "Product "
    ...defaultColumnValue,
    include: false
  },
  event_cost: {
    ...defaultColumnValue,
    include: false
  },
  purchase_paid_status: {
    ...defaultColumnValue,
    include: false
  },
  transaction_status: {
    ...defaultColumnValue,
    include: false
  },
  payment_types: {
    ...defaultColumnValue,
    include: false
  },
  transaction_total: {
    ...defaultColumnValue,
    include: false
  },
  total_due: {
    ...defaultColumnValue,
    include: false
  },
  donations_collected: {
    ...defaultColumnValue,
    include: false
  },
  default: defaultColumnValue
};
