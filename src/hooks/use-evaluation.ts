import { ref } from "vue";
import type { TemplateCategory } from "../editor/template";
import { evaluateText } from "../services/api";

const useEvaluation = () => {
  const evaluationResult = ref<TemplateCategory[]>([]);
  const evaluationResultJson = ref("");

  const startEvaluation = async (text: string) => {
    try {
      const result = await evaluateText(text);
      evaluationResultJson.value = JSON.stringify(result, null, 2);
      evaluationResult.value = result.data.scores as TemplateCategory[];
    } catch (error) {
      console.error("Error evaluating text:", error);
      evaluationResultJson.value = "Error evaluating text.";
    }
  }

  return {
    evaluationResult,
    evaluationResultJson,
    startEvaluation,
  };
}

export default useEvaluation;
