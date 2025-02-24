export async function evaluateText(
  text: string
): Promise<API.Response<API.EvaluateResponse>> {
  const response = await fetch("http://10.0.1.123:5888/api/ai/evaluate", {
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
  const response = await fetch("http://10.0.1.123:5888/api/ai/summary", {
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
