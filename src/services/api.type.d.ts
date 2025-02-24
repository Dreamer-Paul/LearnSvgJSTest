declare namespace API {
  interface Response<D> {
    code: string;
    message: string;
    data: D;
  }

  interface EvaluateResponse {
    scores: string[];
  }

  interface SummaryToSmartArtResponse {
    summary: Record<string, any>;
  }
}
