import axios from "axios";
const PIXABAY_API_KEY = "43801633-db9c18f422f786dec6582f34e";
const appUrl = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}`;

const formatUrl = (params: any) => {
  let url = appUrl + "&per_page=25&safesearch=true&editors_choice=true";
  if (!params) return url;
  let paramKeys = Object.keys(params);
  paramKeys.map((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  return url;
};
export const apiCall = async (params: any) => {
  try {
    const response = await axios.get(formatUrl(params));
    const { data } = response;
    return { success: true, data };
  } catch (err: unknown) {
    console.log("got error", (err as Error).message);
    return { success: false, msg: (err as Error).message };
  }
};
