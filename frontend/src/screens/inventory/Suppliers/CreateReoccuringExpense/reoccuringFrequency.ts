import { PolicyPaymentFrequency } from 'src/generated/graphql';

export const REOCCURING_FREQUENCY = [
  {
    value: PolicyPaymentFrequency.Monthly,
    label: 'Monthly',
  },
  {
    value: PolicyPaymentFrequency.Fortnightly,
    label: 'Fortnightly',
  },
];
