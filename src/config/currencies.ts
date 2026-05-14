export const currencies = [
  { value: "USD", label: "$ Dollar", symbol: "$", locale: "en-US", color:'#2d6a4f' },
  { value: "EUR", label: "€ Euro", symbol: "€", locale: "de-DE", color:'#F05763' },
  { value: "JPY", label: "¥ Yen", symbol: "¥", locale: "ja-JP", color:'#a47148' },
  { value: "GBP", label: "£ Pound", symbol: "£", locale: "en-GB", color:'#52b69a' },
  { value: "AED", label: "د.إ Emirati Dirham", symbol: "د.إ", locale: "ar-AE", color:'#006d77' },
  { value: "SAR", label: "ر.س Saudi Riyal", symbol: "ر.س", locale: "ar-SA", color:'#a2d2ff' },
  { value: "SYP", label: "£ Syrian Pound", symbol: "£", locale: "ar-SY", color:'#356fbd' },
  { value: "LBP", label: "ل.ل Lebanese Pound", symbol: "ل.ل", locale: "ar-LB", color:'#ffc8dd' },
  { value: "JOD", label: "د.ا Jordanian Dinar", symbol: "د.ا", locale: "ar-JO", color:'#6256B2BF' },
  { value: "IQD", label: "ع.د Iraqi Dinar", symbol: "ع.د", locale: "ar-IQ", color:'#6256B2BF' },
  { value: "CAD", label: "$ Canadian Dollar", symbol: "$", locale: "en-CA", color:'#2d6a4f' },
  { value: "AUD", label: "$ Australian Dollar", symbol: "$", locale: "en-AU", color:'#2d6a4f' },
  { value: "CHF", label: "CHF Swiss Franc", symbol: "CHF", locale: "de-CH", color:'#1b4965' },
  { value: "CNY", label: "¥ Chinese Yuan", symbol: "¥", locale: "zh-CN", color:'#f4d35e' },
  { value: "INR", label: "₹ Indian Rupee", symbol: "₹", locale: "en-IN", color:'#e76f51' },
  { value: "BRL", label: "R$ Brazilian Real", symbol: "R$", locale: "pt-BR", color:'#2d6a4f' },
  { value: "RUB", label: "₽ Russian Ruble", symbol: "₽", locale: "ru-RU", color:'#48cae4' },
  { value: "TRY", label: "₺ Turkish Lira", symbol: "₺", locale: "tr-TR", color:'#9e2a2b' },
  { value: "SEK", label: "kr Swedish Krona", symbol: "kr", locale: "sv-SE", color:'#495057' },
  { value: "NOK", label: "kr Norwegian Krone", symbol: "kr", locale: "nb-NO", color:'#fca311' },
];

export const defaultCurrency = currencies[0];

export type Currency = (typeof currencies)[0];

export const getCurrency = (currency: Currency["value"]) => {
  const currObj = currencies.find((curr) => curr.value === currency) || {
    value: "",
    label: "",
    symbol: "",
    locale: "",
    color: "#f00"
  };
  return currObj;
};
