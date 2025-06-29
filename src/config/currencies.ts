export const currencies = [
  { value: "USD", label: "$ Dollar", symbol: "$", locale: "en-US" },
  { value: "EUR", label: "€ Euro", symbol: "€", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", symbol: "¥", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", symbol: "£", locale: "en-GB" },
  { value: "AED", label: "د.إ Emirati Dirham", symbol: "د.إ", locale: "ar-AE" },
  { value: "SAR", label: "ر.س Saudi Riyal", symbol: "ر.س", locale: "ar-SA" },
  { value: "SYP", label: "£ Syrian Pound", symbol: "£", locale: "ar-SY" },
  { value: "LBP", label: "ل.ل Lebanese Pound", symbol: "ل.ل", locale: "ar-LB" },
  { value: "JOD", label: "د.ا Jordanian Dinar", symbol: "د.ا", locale: "ar-JO" },
  { value: "IQD", label: "ع.د Iraqi Dinar", symbol: "ع.د", locale: "ar-IQ" },
  { value: "CAD", label: "$ Canadian Dollar", symbol: "$", locale: "en-CA" },
  { value: "AUD", label: "$ Australian Dollar", symbol: "$", locale: "en-AU" },
  { value: "CHF", label: "CHF Swiss Franc", symbol: "CHF", locale: "de-CH" },
  { value: "CNY", label: "¥ Chinese Yuan", symbol: "¥", locale: "zh-CN" },
  { value: "INR", label: "₹ Indian Rupee", symbol: "₹", locale: "en-IN" },
  { value: "BRL", label: "R$ Brazilian Real", symbol: "R$", locale: "pt-BR" },
  { value: "RUB", label: "₽ Russian Ruble", symbol: "₽", locale: "ru-RU" },
  { value: "TRY", label: "₺ Turkish Lira", symbol: "₺", locale: "tr-TR" },
  { value: "SEK", label: "kr Swedish Krona", symbol: "kr", locale: "sv-SE" },
  { value: "NOK", label: "kr Norwegian Krone", symbol: "kr", locale: "nb-NO" },
];

export const defaultCurrency = currencies[0];

export type Currency = (typeof currencies)[0];
