export type ClassesKeys = 'formFields' | 'gstCheckbox';

export type Props = IRouteProps<ClassesKeys> & {
  createService: Function;
  updateService: Function;
  profile: Record<string, any>;
  initialData: {
    name: string;
    billingType: string;
    totalAmount: number;
    includeConsTax: boolean;
    timeBasedType: string;
    isTemplate: boolean;
    id: string;
  };
  i18n: any;
};
