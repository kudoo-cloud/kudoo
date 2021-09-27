import {
  SupplierTermsOfPayment,
  PaymentFrequency,
  SupplierType,
} from 'src/generated/graphql';

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

export const SUPPLIER_TYPE = [
  {
    value: SupplierType.Dev,
    label: 'Dev',
  },
  {
    value: SupplierType.Mod,
    label: 'Mod',
  },
  {
    value: SupplierType.Intern,
    label: SupplierType.Intern,
  },
  {
    value: SupplierType.Advisor,
    label: 'Advisor',
  },
];

export const PAYMENT_FREQUENCY = [
  {
    value: PaymentFrequency.Monthly,
    label: 'Monthly',
  },
  {
    value: PaymentFrequency.Fortnightly,
    label: 'Fortnightly',
  },
];
