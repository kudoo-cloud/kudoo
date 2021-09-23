import { SupplierTermsOfPayment } from 'src/generated/graphql';

export const TERMS_OF_PAYMENT = [
  {
    value: SupplierTermsOfPayment.Cod,
    label: 'COD',
  },
  {
    value: SupplierTermsOfPayment.Days_14,
    label: '14 Days',
  },
  {
    value: SupplierTermsOfPayment.Days_30,
    label: '30 Days',
  },
  {
    value: SupplierTermsOfPayment.Days_60,
    label: '60 Days',
  },
];
