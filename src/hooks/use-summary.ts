import { ref } from "vue";
import {
  getTemplate,
  type ISmartArtTemplate,
  type TemplateCategory,
} from "../editor/template";
import { summaryToSmartArt } from "../services/api";

const useSummary = () => {
  const summaryTemplates = ref<ISmartArtTemplate[][]>([]);
  const summaryResults = ref<API.SummaryToSmartArtResponse[]>([]);

  const startSummary = async (text: string, types: TemplateCategory[]) => {
    try {
      const results = await Promise.all(
        types.map((item) => summaryToSmartArt(text, item))
      );

      summaryTemplates.value = types.map((type) => {
        const template = getTemplate(type, results[0].data.count);

        console.log("匹配 template", type, template);

        return template || [];
      });

      summaryResults.value = results.map((result) => result.data);
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  };

  return {
    summaryTemplates,
    summaryResults,
    startSummary,
  };
};

export default useSummary;
