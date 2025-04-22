export function disambiguateLabel(key: string, value: string | any[]): string {
  switch (key) {
    case "moneySpent":
      return `Money spent is between $${value[0]} and $${value[1]}`;
    case "taggedWith":
      return `Tagged with ${value}`;
    case "accountStatus":
      return (value as string[]).map((val) => `Customer ${val}`).join(", ");
    default:
      return value as string;
  }
}