import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function fDate(date: string | number | Date) {
  return format(new Date(date), "dd MMMM yyyy", { locale: es });
}

export function fMinimal(date: string | number | Date) {
  return format(new Date(date), "dd-MM-yyyy", { locale: es });
}

export function fMonthNameYear(date: string | number | Date) {
  return format(new Date(date), "MMM yyyy", { locale: es });
}

export function fShortMonth(date: string | number | Date) {
  return format(new Date(date), "MMM", { locale: es });
}

export function fLongMonth(date: string | number | Date) {
  return format(new Date(date), "MMMM", { locale: es });
}

export function fDateTime(date: string | number | Date) {
  return format(new Date(date), "dd MMMM yyyy HH:mm", { locale: es });
}

export function fDateTimeSuffix(date: string | number | Date) {
  return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function formatFromDate(date: Date) {
  return `${date.toISOString().split("T")[0]}T00:00:00-0000`;
}

export function formatToDate(date: Date) {
  return `${date.toISOString().split("T")[0]}T23:59:59-0000`;
}

export function fToNow(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: es,
  });
}
