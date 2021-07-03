export type StyleKeys = 'page' | 'allSteps' | 'cancelButtonText';

export type WizardCreatePageProps = IComponentProps<StyleKeys> & {
  onDAOChange?: (dao: any) => void;
  onCancel?: Function;
  steps: any[];
  onStepChange?: (steps: any) => void;
  forwardedRef?: any;
};
