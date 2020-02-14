import stripe from "stripe";
import idx from "idx";
import { findIndex } from "lodash";
import { PlanName } from "./constants";
import find from "lodash/find";

type PlansByKey = { [key in PlanName]: stripe.plans.IPlan[] };

type ChangeSubscribtionPlanData = {
  type: "PLAN_CHANGE" | "QUANTITY_UPDATE";
  toPlanName?: PlanName;
  quantity?: number;
};

type TaxRate = {
  id: string;
  object: "tax_rate";
  active: boolean;
  created: number;
  description: string;
  display_name: string;
  inclusive: boolean;
  jurisdiction: string;
  livemode: boolean;
  metadata: any;
  percentage: number;
};

const DEFAULT_TAX_RATES = [
  {
    displayName: "Sales Tax",
    percentage: 10,
    jurisdiction: "AU",
    inclusive: false,
    description: "Australian GST",
    metadata: {
      type: "au_abn",
    },
  },
];

class KudooStripe {
  stripe: stripe;
  plans: PlansByKey;
  taxRates: TaxRate[];

  constructor() {
    this.stripe = new stripe(process.env.STRIPE_SECRET);
    this.getTaxRates();
    this.getAllPlans();
  }

  async getTaxRates() {
    // here we are using any, because we dont have taxRates support in typescript stripe package yet.
    const res = await (this.stripe as any).taxRates.list();
    const list: TaxRate[] = idx(res, x => x.data) || [];
    for (let index = 0; index < DEFAULT_TAX_RATES.length; index++) {
      const defaultTaxRate = DEFAULT_TAX_RATES[index];
      const pos = findIndex(list, {
        metadata: { type: idx(defaultTaxRate, x => x.metadata.type) },
      });

      if (pos <= -1) {
        // tax rates doesn't exist
        // create it
        await (this.stripe as any).taxRates.create({
          display_name: defaultTaxRate.displayName,
          description: defaultTaxRate.description,
          jurisdiction: defaultTaxRate.jurisdiction,
          inclusive: defaultTaxRate.inclusive,
          percentage: defaultTaxRate.percentage,
          active: true,
          metadata: defaultTaxRate.metadata,
        });
      } else {
        // tax rates exist,
        // check whether it is active or not , if not then make it active
        const taxRate = list[pos];
        await (this.stripe as any).taxRates.update(taxRate.id, {
          active: true,
        });
      }
    }
    // get fresh all tax rates
    const newTaxRates = await (this.stripe as any).taxRates.list();
    this.taxRates = idx(newTaxRates, x => x.data) || [];
  }

  /**
   * This method is mainly used to get all plans and product
   * We are calling this method on initiate of this class
   */
  async getAllPlans() {
    try {
      const plans = await this.stripe.plans.list({
        limit: 10,
        expand: ["data.product"],
      });
      let plansByKey = {} as PlansByKey;
      const plansData = idx(plans, x => x.data) || [];
      for (let index = 0; index < plansData.length; index++) {
        const plan = plansData[index];
        const product = plan.product as stripe.products.IProduct;
        let productPlans = plansByKey[product.name] || [];
        productPlans = [...productPlans, plan];
        plansByKey[product.name] = productPlans;
      }
      this.plans = plansByKey;
    } catch (error) {
      console.log(error);
    }
  }

  getTaxIdInformation(country: string, govNumber: string): any {
    let taxIdData;
    if (country === "AU" && govNumber) {
      taxIdData = {
        type: "au_abn",
        value: govNumber,
      };
    }

    return taxIdData ? [taxIdData] : undefined;
  }

  getTaxRateFromTaxId(tax: stripe.customerTaxIds.ITaxId) {
    const type = idx(tax, x => x.type);
    if (type === "au_abn") {
      return find(this.taxRates, { metadata: { type: "au_abn" } });
    }
    return undefined;
  }

  /**
   * This method is useful to create customer
   * For e.g. On company creation we are creating new customer in stripe system
   */
  createCustomer(data: stripe.customers.ICustomerCreationOptions) {
    return this.stripe.customers.create(data);
  }

  /**
   * This method is used to get stripe customer using id
   * For e.g. this will be useful when we want to customer subscriptions, customer stored card info etc
   */
  getCustomer(id: string) {
    return this.stripe.customers.retrieve(id, {
      expand: ["subscriptions.data.plan.product"],
    });
  }

  /**
   * This method is useful to update stripe customer details
   * For e.g. this will be useful when user provide his card details and we want to update the source, or user update contact or address
   */
  updateCustomer(id: string, data: stripe.customers.ICustomerUpdateOptions) {
    return this.stripe.customers.update(id, data);
  }

  /**
   * decode stripe card token and get all card related information
   */
  retriveToken(token: string) {
    return this.stripe.tokens.retrieve(token);
  }

  /**
   * This method is useful to create subscription for given customer
   * For e.g. We subscribe every new company to FREE plan on company creation
   */
  createSubscriptionPlan({
    customerId,
    planName,
    quantity,
    metadata,
  }: {
    customerId: string;
    planName: PlanName;
    quantity: number;
    metadata?: any;
  }) {
    const planId = this.plans[planName][0].id;
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          plan: planId,
          quantity,
        },
      ],
      metadata,
      prorate: false,
    });
  }

  /**
   * This method is useful to upgrade subscription for given customer
   * For e.g. This will be usefull
   * 1. When User upgrade plan from FREE to PRO or downgrade plan from PRO to FREE
   * 2. When user add/remove company member at that time we update the quantity in current plan
   *
   * data is ChangeSubscribtionPlanData type
   * - type value is 'PLAN_CHANGE' OR 'QUANTITY_UPDATE'. PLAN_CHANGE means user want to upgrade/downgrade plan. QUANTITY_UPDATE means user want to add/remove company member
   */

  async changeSubscribtionPlan(
    customerId: string,
    data: ChangeSubscribtionPlanData
  ) {
    const { type, toPlanName, quantity } = data;

    const customer = await this.getCustomer(customerId);
    const taxId = idx(customer, x => x.tax_ids.data[0]);
    const taxRate = this.getTaxRateFromTaxId(taxId);
    const subscriptionId = idx(customer, x => x.subscriptions.data[0].id);
    const currentItemId = idx(
      customer,
      x => x.subscriptions.data[0].items.data[0].id
    );
    const currentPlanId = idx(customer, x => x.subscriptions.data[0].plan.id);

    let finalQuantity = idx(customer, x => x.subscriptions.data[0].quantity);
    let finalPlanId = currentPlanId;
    let items = [];

    if (type === "QUANTITY_UPDATE") {
      // Update subscription quantity
      if (!quantity) {
        throw new Error("quantity is required when type is QUANTITY_UPDATE");
      } else {
        finalQuantity = quantity;
      }
      finalPlanId = currentPlanId;

      // create subscription items array with current plan and new quantity
      items = [
        {
          id: currentItemId,
          plan: finalPlanId,
          quantity: finalQuantity,
        },
      ];
    } else if (type === "PLAN_CHANGE") {
      if (quantity) {
        finalQuantity = quantity;
      }

      if (!toPlanName) {
        throw new Error("toPlanName is required when type is PLAN_CHANGE");
      } else {
        finalPlanId = this.plans[toPlanName][0].id;
      }

      // create subscription items array with current plan deleted and new plan with new/existing quantity
      items = [
        {
          // delete old plan
          id: currentItemId,
          deleted: true,
          plan: currentPlanId,
        },
        {
          // subscribe to new plan
          plan: finalPlanId,
          quantity: finalQuantity,
        },
      ];
    }
    // here keeping as any as default_tax_rates is not supported by @types/stripe yet
    return this.stripe.subscriptions.update(subscriptionId, {
      items,
      default_tax_rates: taxRate ? [idx(taxRate, x => x.id)] : undefined,
    } as any);
  }

  // async testInvoice() {
  //   const res = await this.stripe.invoices.retrieveUpcoming({
  //     customer: 'cus_FpzH0v8XzKvGzM',
  //     subscription: 'sub_FpzHyZX58QjlsH',
  //     subscription_items: [
  //       {
  //         id: 'si_FqnTcwoABGSLe0',
  //         deleted: true,
  //         plan: 'plan_FUYXqUGt5i4Ng5',
  //       },
  //       {
  //         plan: 'plan_FUYY4qRW2X0xCS',
  //         quantity: 1,
  //       },
  //     ],
  //     subscription_proration_date: 1571653781,
  //     subscription_prorate: true,
  //   });
  //   console.log(JSON.stringify(res));
  // }
}

export default new KudooStripe();
