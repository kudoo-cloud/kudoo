import idx from 'idx';
import { IAvailability, LicensePlan } from 'src/store/types/security';

export const isFeatureAvailable = (dao, availability: IAvailability[] = []) => {
  const arr: IAvailability[] = ([] as IAvailability[]).concat(availability);
  // Whether dao satifies all availability test
  // then dao is eligible to view particular feature
  return arr.every((item = {}) => {
    let found = true;
    if (item.businessType && found) {
      found = item.businessType.indexOf(dao.businessType) > -1;
    }
    if (item.country && found) {
      found = item.country.indexOf(dao.country) > -1;
    }
    if (item.security && found) {
      found = item.security.indexOf(idx(dao, (x) => x.role)) > -1;
    }
    return found;
  });
};

export const needsLicenseUpgrade = (dao, licenseRequired: LicensePlan[]) => {
  if (!licenseRequired || licenseRequired.length <= 0) {
    return false;
  }
  return (
    (licenseRequired || []).indexOf(idx(dao, (x) => x.activePlan.type)) <= -1
  );
};
