export type StyleKeys = 'page' | 'allSteps' | 'cancelButtonText';

export type WizardCreatePageProps = IComponentProps<StyleKeys> & {
  onCompanyChange?: Function;
  onCancel?: Function;
  steps: any[];
  onStepChange?: (steps: any) => void;
  forwardedRef?: any;
};
