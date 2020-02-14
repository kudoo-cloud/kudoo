export interface IClasses {
  form: string;
  page: string;
  content: string;
  pDropDown: string;
  noWrapper: string;
  noMessage: string;
  borderCell: string;
  formFields: string;
  dollarIcon: string;
  balanceCell: string;
  addRowButton: string;
  iconsWrapper: string;
  rowTableHeader: string;
  sectionHeading: string;
  prevNextButton: string;
  tableInputCell: string;
  wizardComponent: string;
  prevNextWrapper: string;
  pDropdownSelect: string;
  cancelButtonText: string;
  noMessageWrapper: string;
  tableInputWrapper: string;
  PurchaseOrderNameCell: string;
  cancelButtonComponent: string;
  purchaseOrderLineTable: string;
  companyLogo: string;
  purchaseOrderName: string;
  purchaseOrderHeader: string;
  purchaseOrderDateWrapper: string;
  purchaseOrderTitleRightPart: string;
  purchaseOrderDateBlock: string;
  purchaseOrderDateLabel: string;
  purchaseOrderDateValue: string;
  purchaseOrderService: string;
  purchaseOrderSectionTitle: string;
  smallTextCell: string;
  mediumWidthCell: string;
  smallWidthCell: string;
  serviceTable: string;
  errorLabel: string;
  bigWidthCell: string;
  includeCheckboxWrapper: string;
  pbsContent: string;
  customExpansion: string;
  pbsPage: string;
  detailBox: string;
  expHeader: string;
  expSecondHeader: string;
}

export interface IActions {
  setSubmitting: ({}) => {};
  updateHeaderTitle: ({}) => {};
}

export interface IHistory {
  push: ({}) => {};
  replace: ({}) => {};
}

export interface IProfile {
  id: string;
  selectedCompany: {
    country: string;
    businessType: string;
    logo: {
      url: string;
    };
    name: string;
  };
}

export interface ITheme {
  palette: {
    primary: {
      color2: string;
    };
    grey: object;
  };
}

export interface IPurchaseOrderPreviewProps {
  theme: ITheme;
  classes: IClasses;
  history: IHistory;
  profile: IProfile;
  actions: IActions;
  initialData: {
    date: string;
    isPbsPO: boolean;
    supplier: { name: string };
    pbsOrganisation: string;
  };
  purchaseOrderLines: {
    data: [];
  };
}
