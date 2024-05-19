export interface ShippingAddress {
  _id?: string;
  user?: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  street2?: string;
  city: string;
  postalCode: string;
  country: string;
}
