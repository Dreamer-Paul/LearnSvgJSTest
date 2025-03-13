import { getToken } from "../utils/auth";

const getHeaders = () => {
  const token = getToken();

  if (!token) {
    return undefined;
  }

  return {
    Authorization: token,
  };
};

export async function evaluateText(
  content: string
): Promise<API.Response<API.EvaluateResponse>> {
  const response = await fetch(
    `${import.meta.env.APP_API_BASEURL}/smart/art/evaluate`,
    {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function summaryToSmartArt(
  text: string,
  cate: string
): Promise<API.Response<API.SummaryToSmartArtResponse>> {
  const response = await fetch(
    `${import.meta.env.APP_API_BASEURL}/smart/art/summary`,
    {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, cate }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
