import { PolicyPaymentFrequency } from 'src/generated/graphql';

export const PAYMENT_FREQUENCY = [
  {
    value: PolicyPaymentFrequency.Esd,
    label: 'Employment Start Date',
  },
  {
    value: PolicyPaymentFrequency.Monthly,
    label: 'Monthly',
  },
  {
    value: PolicyPaymentFrequency.Fortnightly,
    label: 'Fortnightly',
  },
];
