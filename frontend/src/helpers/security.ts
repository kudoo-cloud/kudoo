import idx from 'idx';
import { IAvailability, LicensePlan } from '@client/store/types/security';

export const isFeatureAvailable = (
  company,
  availability: IAvailability[] = []
) => {
  const arr: IAvailability[] = ([] as IAvailability[]).concat(availability);
  // Whether company satifies all availability test
  // then company is eligible to view particular feature
  return arr.every((item = {}) => {
    let found = true;
    if (item.businessType && found) {
      found = item.businessType.indexOf(company.businessType) > -1;
    }
    if (item.country && found) {
      found = item.country.indexOf(company.country) > -1;
    }
    if (item.security && found) {
      found = item.security.indexOf(idx(company, x => x.role)) > -1;
    }
    return found;
  });
};

export const needsLicenseUpgrade = (
  company,
  licenseRequired: LicensePlan[]
) => {
  if (!licenseRequired || licenseRequired.length <= 0) {
    return false;
  }
  return (
    (licenseRequired || []).indexOf(idx(company, x => x.activePlan.type)) <= -1
  );
};
