
/// <reference types="vite/client" />

interface KkiapayOptions {
  key: string;
  amount: number;
  callback: string;
  theme?: string;
  name?: string;
  description?: string;
}

interface Kkiapay {
  initialize: (options: KkiapayOptions) => void;
  openPaymentWidget: () => void;
}

interface Window {
  Kkiapay?: Kkiapay;
}
