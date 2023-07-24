import numeral from "numeral";

export function fCurrency(number: number | string) {
  let parsedNumber = numeral(number).format(
    Number.isInteger(number) ? "$0,0" : "$0,0.00"
  );
  parsedNumber = parsedNumber.replace(/,/g, "-");
  parsedNumber = parsedNumber.replace(/\./g, ",");
  parsedNumber = parsedNumber.replace(/-/g, ".");
  return parsedNumber;
}

export function fPercent(number: number) {
  return numeral(number / 100).format("0.00%");
}

export function fNumber(number: number) {
  return numeral(number).format();
}

export function fData(number: number) {
  return numeral(number).format("0.0 b");
}
