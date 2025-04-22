import type {
  RunInput,
  FunctionRunResult,
  FunctionError,
} from "../generated/api";

export function run(input: RunInput): FunctionRunResult {
  const errors: FunctionError[] = [];
  const warningMessages = input.shop?.metafield?.value;
  const shopLimitations = input.shop?.shopLimitations?.value;

  let parsedMessages = {
    min: "You must select at least {{minimum_quantity}} {{product_title}}",
    max: "You can only select a maximum of {{maximum_quantity}} {{product_title}}"
  };

  try {
    if (warningMessages) {
      const parsed = JSON.parse(warningMessages);
      if (parsed.min && parsed.max) {
        parsedMessages = parsed;
      }
    }
  } catch (error) {
    console.error("Error parsing warning messages:", error);
  }

  let limitations;

  try {
    limitations = shopLimitations ? JSON.parse(shopLimitations) : { vs: {}, ss: {} };
  } catch (error) {
    console.error("Error parsing shop limitations:", error);
    return { errors };
  }

  input.cart.lines.forEach(line => {
    if ('product' in line.merchandise) {
      const variantId = line.merchandise.id;
      const productTitle = line.merchandise.product.title+` (${line.merchandise.title})`;
      const sku = line.merchandise.sku;
      let limitation = null;

      if (sku && limitations.ss && limitations.ss[sku]) {
        limitation = limitations.ss[sku];
      } else if (limitations.vs && limitations.vs[variantId]) {
        limitation = limitations.vs[variantId];
      }

      if (limitation) {
        const quantity = line.quantity;
        const min = parseInt(limitation.min);
        const max = parseInt(limitation.max);

        if (quantity < min) {
          errors.push({
            localizedMessage: parsedMessages.min.replace("{{minimum_quantity}}", min.toString()).replace("{{product_title}}", productTitle),
            target: "$.cart.lines"
          });
        }

        if (quantity > max) {
          errors.push({
            localizedMessage: parsedMessages.max.replace("{{maximum_quantity}}", max.toString()).replace("{{product_title}}", productTitle),
            target: "$.cart.lines"
          });
        }
      }
    }
  });

  return { errors };
}
