export type CustomerObject = {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postCode: string;
  };
  contact: {
    landlineCode: string;
    landlineNumber: string;
    mobileCode: string;
    mobileNumber: string;
  };
};
