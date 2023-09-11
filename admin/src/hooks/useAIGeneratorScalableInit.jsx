import usePromptTemplateQuery from '../queries/usePromptTemplateQuery';
import useAIModelsQuery from '../queries/useAIModelsQuery';
import usePostTypesQuery from '../queries/usePostTypesQuery';

const useAIGeneratorScalableInit = () => {
	// preload queries to possibly show values inside related step immediately
	usePostTypesQuery();
	useAIModelsQuery();
	usePromptTemplateQuery();
};

export default useAIGeneratorScalableInit;
