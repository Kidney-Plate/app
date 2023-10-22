import createClient from "openapi-fetch";
import type { paths } from "./v1";

const client = createClient<paths>({
  baseUrl: "https://api.nal.usda.gov/fdc/",
  headers: {
    "x-api-key": process.env.EXPO_PUBLIC_FOOD_API_KEY,
  },
});

export default client;
