import { DomainEnum } from "@/types/enums";

export const DOMAINS = Object.values(DomainEnum);

export function getDomainOptions() {
  return DOMAINS.map((d) => ({ label: d, value: d }));
}
