import * as React from 'react';
/**
 * Contains the Security configuration for a Kudoo product.
 * For example, we would have an ISecurityConfig that
 * contains all the Menu's and Screens available to that product,
 * as well as what security and licensing is required to access that
 * functionality.
 */
export interface ISecurityConfig {
  product: Product;
  menu: IMenuItem[];
  routes: IRoute[];
}

/**
 * The products that Kudoo currently offers.
 */
export enum Product {
  projects = 'projects',
  manufacturing = 'manufacturing',
  mobile = 'mobile',
  finance = 'finance',
  health = 'health',
  inventory = 'inventory',
}

export type ProductType = {
  // Decide whether product is available to show or not
  isAvailable: boolean;
  // label that will be shown in dropdown
  key: string;
  // value that will be used to store in redux store
  value: Product;
};

/**
 * The Availability of the functionality. This is used in Menu Items, Tabs and SubTabs
 * in order to determine whether the User can access the functionality. One of every
 * condition will need to be true in order for the functionality to be avaialble.
 * For example, the Logged in DAO must match one of the Countries, the Logged in
 * Users role must match one of the Security Roles, the Logged in DAO must
 */
export interface IAvailability {
  /**
   * Some Menu Items will only appear when the logged in DAO is from a specific
   * country. For example Australia has some features that are unique and therefore
   * shouldn't appear for the UK. The string must be a two letter ISO country code
   * to avoid type mismatches with the GraphQL API.
   */
  country?: [string];
  /** Different Security roles will have access to different functionality. Restricting
   * the Menu Items by Security roles, means security becomes a configurable issue,
   * rather than a code issue.
   */
  security?: Array<SecurityRole>;
  /** Currently we can restrict menu items to DAOs that are of a certain Business
   * Type. Currently only "HEALTH" is a supported option.
   */
  businessType?: Array<string>;
}

/**
 * This is just combination of IAvailability & LicensePlan
 * This will be used on IRoute, IMenuItem and ITab
 */
export interface IContentSecurity {
  /**
   * Conditions to determine whether this Item is available to the User and
   * the DAO.
   */
  availability?: Array<IAvailability>;
  /**
   * Conditions to determine whether user needs to upgrade his plan or not
   * Some tabs/menu/routes will be restricted by the License that the dao has. For example, a
   * DAO may be in the FREE plan, but the Tab is only available on the PRO or
   * ENTERPRISE license. In that instance the Tab should still appear, but a message
   * will be displayed to the User to upgrade their DAO plan
   */
  licenseRequired?: LicensePlan[];
}

/**
 * The Menu item appear in the Drawer of the application and allow the User
 * to navigate between sections.
 */
export type IMenuItem = IContentSecurity & {
  name: string;
  /**
   * The order the Menu Item appears in the Drawer
   */
  order: number;
  /**
   * Set Icon
   */
  icon?: () => React.ReactNode;
  /**
   * set url to navigate
   */
  url: string;
  /**
   * set logic to determine whether menu item should be shown as active or not
   * function should return true/false
   */
  isActive?: (pathname: string) => boolean;
};

/**
 * Route will be used to dynamically render all routes
 */
export type IRoute = IContentSecurity & {
  /**
   * This name will be used in header bar title
   */
  name: string;
  /**
   * Path will be used to configure route at specific url
   */
  path: string;
  /**
   * Rendering component for particular route, means that if we ever need to completely
   * replace a page within the application. It becomes as simple as just linking to the
   * new React component. This means theoretically, we can generate our entire application
   * by just configuring the Security Config
   */
  component: any;
  /**
   * An array of the Tabs that need to appear when the Menu Item is clicked
   */
  tabs?: Array<ITab>;
  /**
   * Any route prop, this will be used to provide any custom route prop in case we have some special case
   */
  [key: string]: any;
};

/**
 * A Menu item will link to multiple tabs. Tabs are a further classification of
 * functionality within the Kudoo application.
 */
export type ITab = IContentSecurity & {
  name: string;
  /**
   * Linking the Tabs to the React Component, means that if we ever need to completely
   * replace a Tab within the application. It becomes as simple as just linking to the
   * new React component. This means theoretically, we can generate our entire application
   * by just configuring the Security Config
   */
  reactComponent: React.FC<any>;
  /**
   * Url associated to the tab, this will be used when user click on tab at that time we will
   * redirect that user to particular url. This will be helpful to assign one url per tab so user can
   * easily open any tab with just url in future or user can even bookmark the url
   */
  url: (param?: any) => string;
  /**
   * Sometimes there's too much functionality in a Tab to fit. In that case we have to
   * split the functionality into SubTabs.
   * basically we can keep this key as a "tabs" so we can do unlimited nesting in tabs
   * there is no need to do only 2 level static nesting
   */
  tabs?: Array<ITab>;
  /**
   * Whether rendered tab is secondary tab or tertiary tab
   */
  isTertiaryTab?: boolean;
  /**
   * Any reactComponent specific prop, this will be used to provide any custom component prop in case we have some special case
   */
  [key: string]: any;
};

export enum SecurityRole {
  admin = 'ADMIN',
  user = 'USER',
  root = 'ROOT',
  owner = 'OWNER',
  healthcareProvider = 'HEALTHCARE PROVIDER',
}

export enum LicensePlan {
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
  FREE = 'FREE',
}

export default {};
