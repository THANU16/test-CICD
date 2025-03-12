export interface CheckoutData {
  type: "data-package" | "topup";
  price: string;
  quantity?: number;
  planName?: string;
  gb?: string;
  dataText?: string;
  validityText?: string;
  features?: string[];
  phoneNumber?: string;
  isInternational?: boolean;
  isManual?: boolean;
}

export interface PaymentDetails {
  email?: string;
  phoneNumber?: string;
  selectedPayment: string;
  quantity: number;
  checkoutData: CheckoutData;
  timestamp: string;
  reference: string;
}
