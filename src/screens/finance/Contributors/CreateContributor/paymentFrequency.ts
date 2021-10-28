import { PaymentFrequency } from 'src/generated/graphql';

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
