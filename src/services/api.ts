export async function evaluateText(
  text: string
): Promise<API.Response<API.EvaluateResponse>> {
  const response = await fetch(`${import.meta.env.APP_API_BASEURL}/ai/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function summaryToSmartArt(
  text: string,
  type: string
): Promise<API.Response<API.SummaryToSmartArtResponse>> {
  const response = await fetch(`${import.meta.env.APP_API_BASEURL}/ai/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, type }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
