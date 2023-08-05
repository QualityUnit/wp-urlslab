
export default function aiGeneratorReducer( state, action ) {
	switch ( action.type ) {
		case 'setDataSource':
			return {
				...state,
				dataSource: action.key,
			};
		case 'setDomain':
			return {
				...state,
				domain: action.key,
			};
		case 'setKeywordsList':
			return {
				...state,
				keywordsList: action.key,
			};
		case 'setLang':
			return {
				...state,
				lang: action.key,
			};
		case 'setModelName':
			return {
				...state,
				modelName: action.key,
			};
		case 'setPromptVal':
			return {
				...state,
				promptVal: action.key,
			};
		case 'setSelectedPromptTemplate':
			return {
				...state,
				selectedPromptTemplate: action.key,
			};
		case 'setSemanticContext':
			return {
				...state,
				semanticContext: action.key,
			};
		case 'setSerpUrlsList':
			return {
				...state,
				serpUrlsList: action.key,
			};
		case 'setTitle':
			return {
				...state,
				title: action.key,
			};
		case 'setUrlsList':
			return {
				...state,
				urlsList: action.key,
			};
		case 'setInputValue':
			return {
				...state,
				inputValue: action.key,
			};
		default:
			return state;
	}
}
