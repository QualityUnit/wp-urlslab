import { memo, useEffect, useState, useContext, createContext, useCallback } from 'react';

import { SuggestInputField } from '../../lib/tableImports';
import EditableList from '../../elements/EditableList';
import { postFetch } from '../../api/fetching';
import { fetchLangsForAutocomplete } from '../../api/fetchLangs';
import Loader from '../Loader';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator, {
	contextTypes,
	contextTypesDescription,
} from '../../hooks/useAIGenerator';
import { generateContent, getQueryCluster, getTopUrls, handleGeneratePrompt } from '../../lib/aiGeneratorPanel';
import { createPromptTemplate, getAugmentProcessResult, getPromptTemplates } from '../../api/generatorApi';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import { setNotification } from '../../hooks/useNotifications';
import useTablePanels from '../../hooks/useTablePanels';

import usePromptTemplateQuery from '../../queries/usePromptTemplateQuery';
import { usePromptTypes } from './usePromptTemplateEditorRow';

import { ReactComponent as IconArrow } from '../../assets/images/icons/icon-arrow.svg';
import { ReactComponent as IconStars } from '../../assets/images/icons/icon-stars.svg';

import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import CircularProgress from '@mui/joy/CircularProgress';
import Textarea from '@mui/joy/Textarea';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Autocomplete from '@mui/joy/Autocomplete';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';

import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import DataBox from '../../elements/DataBox';
import { useQueryClient } from '@tanstack/react-query';
import ContentGeneratorEditor from './ContentGeneratorEditor';
import Typography from '@mui/joy/Typography/Typography';

const ManualGeneratorContext = createContext( {} );
const langs = fetchLangsForAutocomplete();

function ContentGeneratorConfigPanelManual( { initialData = {}, useEditor, onGenerateComplete, noPromptTemplate, closeBtn, isFloating } ) {
	const { __ } = useI18n();
	const { isSuccess: promptTemplatesSuccess } = usePromptTemplateQuery();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ step, setStep ] = useState( 0 );

	const stepNext = useCallback( () => {
		setStep( ( s ) => s + 1 );
	}, [] );

	const stepBack = useCallback( () => {
		setStep( ( s ) => s > 0 ? s - 1 : s );
	}, [] );

	const [ internalState, setInternalState ] = useState( {
		isGenerating: false,
		templateName: __( 'Custom' ),
		showPrompt: false,
		showEditor: false,
		useEditor,
	} );

	const [ promptVal, setPromptVal ] = useState( '' );

	//handling the initial loading with preloaded data
	useEffect( () => {
		// setting initial state
		const initialConf = { ...aiGeneratorConfig, ...initialData };
		setAIGeneratorConfig( initialConf );

		const fetchTopUrls = async () => {
			const topUrls = await getTopUrls( initialConf );
			setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, serpUrlsList: topUrls } );
		};

		const fetchQueryCluster = async () => {
			const primaryKeyword = aiGeneratorConfig.keywordsList[ 0 ].q;
			const queryCluster = await getQueryCluster( primaryKeyword );
			setAIGeneratorConfig( {
				...useAIGenerator.getState().aiGeneratorConfig,
				keywordsList: [ { q: primaryKeyword, checked: true }, ...queryCluster ],
			} );
		};

		const getInitialPromptTemplate = async () => {
			const rsp = await getPromptTemplates( [
				{
					col: 'prompt_type',
					op: 'eq',
					val: initialConf.initialPromptType,
				},
			] );

			if ( rsp.ok ) {
				const data = await rsp.json();
				if ( data && data.length > 0 ) {
					setInternalState( { ...internalState, templateName: data[ 0 ].template_name } );
					setAIGeneratorConfig( {
						...useAIGenerator.getState().aiGeneratorConfig,
						promptTemplate: data[ 0 ].prompt_template,
					} );
				}
			}
		};

		if ( initialConf.dataSource === 'SERP_CONTEXT' &&
            initialConf.keywordsList.length > 0 &&
            initialConf.keywordsList[ 0 ].q !== '' &&
            initialConf.serpUrlsList.length <= 0 ) {
			fetchTopUrls();
		}

		if ( initialConf.keywordsList.length > 0 && initialConf.keywordsList[ 0 ].q !== '' ) {
			fetchQueryCluster();
		}

		if ( initialConf.initialPromptType && initialConf.initialPromptType !== 'G' ) {
			getInitialPromptTemplate();
		}
	}, [] );

	useEffect( () => {
		setPromptVal( handleGeneratePrompt( aiGeneratorConfig, aiGeneratorConfig.promptTemplate ) );
	}, [ aiGeneratorConfig ] );

	if ( ! promptTemplatesSuccess ) {
		return <Loader />;
	}

	return (
		<ManualGeneratorContext.Provider
			value={ {
				isFloating,
				noPromptTemplate,
				internalState,
				setInternalState,
				promptVal,
				onGenerateComplete,
				closeBtn,
				step,
				stepBack,
				stepNext,
			} }
		>

			{ step === 0 && <FirstStep /> }
			{ step === 1 && <SecondStep /> }
			{ step === 2 && <ThirdStep /> }

		</ManualGeneratorContext.Provider>
	);
}
const WrappedEditor = () => {
	const { __ } = useI18n();
	const { editorLoading } = useAIGenerator();
	return (
		<DataBox
			title={ __( 'Generated content:' ) }
			loadingText={ __( 'Loading editor…' ) }
			loading={ editorLoading }
			color="primary"
			renderHiddenWhileLoading
		>
			<Box sx={ { p: 2 } }>
				<ContentGeneratorEditor />
			</Box>
		</DataBox>
	);
};

const FirstStep = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const { isFloating } = useContext( ManualGeneratorContext );
	const [ typingTimeout, setTypingTimeout ] = useState( 0 );
	const [ loadingKeywords, setLoadingKeywords ] = useState( false );

	// handling keyword input, trying to get suggestions
	const handleChangeKeywordInput = ( val ) => {
		if ( val === '' ) {
			setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: [] } );
			return;
		}

		if ( typingTimeout ) {
			clearTimeout( typingTimeout );
		}

		setTypingTimeout(
			setTimeout( async () => {
				setLoadingKeywords( true );
				const queryCluster = await getQueryCluster( val );
				setLoadingKeywords( false );
				setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, keywordsList: [ { q: val, checked: true }, ...queryCluster ] } );
			}, 600 )
		);
	};

	// handling checking checkbox for keywords
	const handleKeywordsCheckboxCheck = ( checked, index ) => {
		const newList = aiGeneratorConfig.keywordsList.map( ( keyword, idx ) => {
			if ( idx === index ) {
				return { ...keyword, checked };
			}
			return keyword;
		} );
		setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: newList } );
	};

	const validateStep = () => {
		const checkedItems = aiGeneratorConfig.keywordsList.filter( ( item ) => item.checked === true );
		return ! loadingKeywords && checkedItems.length > 0 && aiGeneratorConfig.title !== '';
	};

	return (
		<Stack spacing={ 3 }>
			{
				aiGeneratorConfig.mode === 'WITH_INPUT_VAL' && (
					<FormControl>
						<FormLabel>{ __( 'Input value' ) }</FormLabel>
						<Input
							onChange={ ( event ) => setAIGeneratorConfig( { ...aiGeneratorConfig, inputValue: event.target.value } ) }
							required
						/>
						<FormHelperText>{ __( 'Input Value to use in prompt' ) }</FormHelperText>
					</FormControl>
				)
			}

			{
				( aiGeneratorConfig.mode === 'CREATE_POST' || aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' ) && (
					<>
						<FormControl required >
							<FormLabel>{ __( 'Page title' ) }</FormLabel>
							<Input
								defaultValue={ aiGeneratorConfig.title }
								onChange={ ( event ) => setAIGeneratorConfig( { ...aiGeneratorConfig, title: event.target.value } ) }
							/>
							<FormHelperText>{ __( 'Title of new page' ) }</FormHelperText>
						</FormControl>

						<FormControl required>
							<FormLabel>{ __( 'Keyword' ) }</FormLabel>
							<Input
								defaultValue={ aiGeneratorConfig.keywordsList.length > 0 ? aiGeneratorConfig.keywordsList[ 0 ].q : '' }
								onChange={ ( event ) => handleChangeKeywordInput( event.target.value ) }
							/>
							<FormHelperText>{ __( 'Keyword to pick' ) }</FormHelperText>
						</FormControl>
					</>
				)
			}

			<DataBox
				title={ __( 'Loaded keywords:' ) }
				loadingText={ __( 'Loading keywords…' ) }
				loading={ loadingKeywords }
			>
				{ aiGeneratorConfig.keywordsList.length > 0 &&
					<List>
						{ aiGeneratorConfig.keywordsList.map( ( keyword, index ) => {
							return (
								<ListItem key={ keyword.q }>
									<Checkbox
										size="sm"
										label={ keyword.q }
										checked={ keyword.checked }
										onChange={ ( event ) => handleKeywordsCheckboxCheck( event.target.checked, index ) }
										overlay
									/>
								</ListItem>
							);
						} )
						}
					</List>
				}
			</DataBox>

			<NavigationButtons disableNext={ ! validateStep() } />

		</Stack>

	);
};

const SecondStep = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const { isFloating } = useContext( ManualGeneratorContext );
	const [ loadingTopUrls, setLoadingTopUrls ] = useState( false );

	// handling serpUrlCheckboxCheck
	const handleSerpUrlCheckboxCheck = ( checked, index ) => {
		const newList = aiGeneratorConfig.serpUrlsList.map( ( url, idx ) => {
			if ( idx === index ) {
				return { ...url, checked };
			}
			return url;
		} );
		setAIGeneratorConfig( { ...aiGeneratorConfig, serpUrlsList: newList } );
	};

	// handling data source selection serp
	const handleDataSourceSelection = async ( val ) => {
		setAIGeneratorConfig( { ...aiGeneratorConfig, dataSource: val } );
		if ( val === 'SERP_CONTEXT' ) {
			setLoadingTopUrls( true );
			const topUrls = await getTopUrls( aiGeneratorConfig );
			setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, serpUrlsList: topUrls } );
			setLoadingTopUrls( false );
		}
	};

	const validateStep = () => {
		switch ( aiGeneratorConfig.dataSource ) {
			case 'URL_CONTEXT':
				return aiGeneratorConfig.urlsList?.length > 0;

			case 'DOMAIN_CONTEXT':
				return aiGeneratorConfig.semanticContext !== '';

			case 'SERP_CONTEXT':
				return aiGeneratorConfig.serpUrlsList.filter( ( item ) => item.checked ).length > 0;
			default:
				return true;
		}
	};

	return (
		<Stack spacing={ 3 }>

			<FormControl>
				<FormLabel>{ __( 'Data source' ) }</FormLabel>
				<Select
					defaultValue={ aiGeneratorConfig.dataSource }
					onChange={ ( event, value ) => handleDataSourceSelection( value ) }
				>
					{ Object.entries( contextTypes ).map( ( [ key, value ] ) => {
						return <Option key={ key } value={ key }>{ value }</Option>;
					} ) }
				</Select>
				<FormHelperText>{ contextTypesDescription[ aiGeneratorConfig.dataSource ] }</FormHelperText>
			</FormControl>

			{ aiGeneratorConfig.dataSource === 'URL_CONTEXT' && (
				<DataBox title={ __( 'Chosen URLs:' ) }>
					<EditableList
						inputPlaceholder={ __( 'Add url…' ) }
						items={ aiGeneratorConfig.urlsList }
						addItemCallback={ ( item ) => {
							if ( ! aiGeneratorConfig.urlsList.includes( item ) ) {
								setAIGeneratorConfig( {
									...aiGeneratorConfig,
									urlsList: [ ...aiGeneratorConfig.urlsList, item ],
								} );
							}
						} }
						removeItemCallback={ ( removingItem ) =>
							setAIGeneratorConfig( {
								...aiGeneratorConfig,
								urlsList: aiGeneratorConfig.urlsList.filter( ( item ) => item !== removingItem ),
							} )
						}
					/>
				</DataBox>
			) }

			{ aiGeneratorConfig.dataSource === 'DOMAIN_CONTEXT' && (
				<>
					<FormControl>
						<FormLabel>{ __( 'Domain to use' ) }</FormLabel>
						<SuggestInputField
							suggestInput=""
							liveUpdate
							onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, domain: [ val ] } ) }
							showInputAsSuggestion={ false }
							placeholder={ __( 'Type domain…' ) }
							postFetchRequest={ async ( val ) => {
								return await postFetch( 'schedule/suggest', {
									count: val.count,
									url: val.input,
								} );
							} }
						/>
					</FormControl>

					<FormControl required>
						<FormLabel>{ __( 'Semantic Context' ) }</FormLabel>
						<Input
							onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, semanticContext: val } ) }
							required
						/>
						<FormHelperText>{ __( 'What piece of data you are looking for in your domain' ) }</FormHelperText>
					</FormControl>
				</>

			) }

			{ aiGeneratorConfig.dataSource === 'SERP_CONTEXT' && (
				<DataBox
					title={ __( 'Loaded urls:' ) }
					loadingText={ __( 'Loading urls…' ) }
					loading={ loadingTopUrls }
				>
					{ aiGeneratorConfig.serpUrlsList.length > 0 &&
						<List>
							{ aiGeneratorConfig.serpUrlsList.map( ( url, index ) => {
								return (
									<ListItem key={ url.url_name }>
										<Checkbox
											size="sm"
											label={ url.url_name }
											onChange={ ( event ) => handleSerpUrlCheckboxCheck( event.target.checked, index ) }
											overlay
										/>
									</ListItem>
								);
							} )
							}
						</List>
					}
				</DataBox>
			) }

			<FormControl >
				<FormLabel>{ __( 'Language' ) }</FormLabel>
				<Autocomplete
					placeholder={ __( 'Choose a language' ) }
					options={ Object.values( langs ) }
					defaultValue={ langs[ aiGeneratorConfig.lang ] }
					onChange={ ( event, newValue ) => setAIGeneratorConfig( { ...aiGeneratorConfig, lang: newValue.id } ) }
					disableClearable

				/>
			</FormControl>

			<NavigationButtons disableNext={ ! validateStep() } />

		</Stack>
	);
};

const ThirdStep = () => {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const promptTypes = usePromptTypes();
	const { aiGeneratorConfig, setAIGeneratorConfig, setEditorVal } = useAIGenerator();
	const { isFloating, noPromptTemplate, internalState, setInternalState, promptVal, onGenerateComplete, closeBtn } = useContext( ManualGeneratorContext );
	const { data: aiModels, isSuccess: aiModelsSuccess, isFetching: isFetchingAiModels } = useAIModelsQuery();
	const { data: allPromptTemplates, isSuccess: promptTemplatesSuccess, isFetching: isFetchingPromptTemplates } = usePromptTemplateQuery();

	const newPromptDefaults = {
		promptType: 'G',
		templateName: '',
		saving: false,
		showSaveForm: false,
	};

	const [ newPromptData, setNewPromptData ] = useState( newPromptDefaults );
	// handling prompt template selection
	const handlePromptTemplateSelection = ( selectedTemplate ) => {
		if ( selectedTemplate ) {
			if ( selectedTemplate === 'Custom' ) {
				setInternalState( { ...internalState, templateName: 'Custom' } );
				return;
			}
			setAIGeneratorConfig( {
				...aiGeneratorConfig,
				promptTemplate: allPromptTemplates[ selectedTemplate ].prompt_template,
			} );
			setInternalState( { ...internalState, templateName: allPromptTemplates[ selectedTemplate ].template_name } );
		}
	};

	// handling save prompt template
	const handleSavePromptTemplate = async () => {
		if ( ! promptVal ) {
			return;
		}

		setNewPromptData( ( state ) => ( { ...state, saving: true } ) );
		setNotification( 'new-prompt-template', { message: __( 'Saving template…' ), status: 'info' } );

		const response = await createPromptTemplate( {
			model_name: aiGeneratorConfig.modelName,
			prompt_template: aiGeneratorConfig.promptTemplate,
			prompt_type: newPromptData.promptType,
			template_name: newPromptData.templateName,
		} );

		if ( response.ok ) {
			setNotification( 'new-prompt-template', { message: __( 'Template saved successfully.' ), status: 'success' } );
			queryClient.invalidateQueries( [ 'prompt-template' ] );
			setInternalState( ( state ) => ( { ...state, templateName: newPromptData.templateName } ) );
			setNewPromptData( newPromptDefaults );
			return;
		}
		setNewPromptData( ( state ) => ( { ...state, saving: false } ) );
		setNotification( 'new-prompt-template', { message: __( 'Template saving failed.' ), status: 'error' } );
	};

	const showSecondPanel = useTablePanels( ( state ) => state.showSecondPanel );

	const handleClose = () => {
		showSecondPanel();
	};

	const handleGenerateContent = async () => {
		try {
			setInternalState( { ...internalState, isGenerating: true, showEditor: false } );
			const processId = await generateContent( aiGeneratorConfig, promptVal );
			const pollForResult = setInterval( async () => {
				try {
					const resultResponse = await getAugmentProcessResult( processId );
					if ( resultResponse.ok ) {
						const generationRes = await resultResponse.json();
						if ( generationRes.status === 'SUCCESS' ) {
							setEditorVal( generationRes.response[ 0 ] );
							if ( onGenerateComplete ) {
								onGenerateComplete( generationRes.response[ 0 ] );
							}
							clearInterval( pollForResult );
							setInternalState( { ...internalState, isGenerating: false, showEditor: true } );
						}
					} else {
						if ( resultResponse.status === 400 ) {
							const generationRes = await resultResponse.json();
							throw new Error( generationRes.message );
						}
						throw new Error( 'Failed to generate result. try again...' );
					}
				} catch ( error ) {
					clearInterval( pollForResult );
					setNotification( 1, { message: error.message, status: 'error' } );
					setInternalState( { ...internalState, isGenerating: false, showEditor: false } );
				}
			}, 2000 );
		} catch ( e ) {
			setNotification( 1, { message: e.message, status: 'error' } );
			setInternalState( { ...internalState, isGenerating: false, showEditor: false } );
		}
	};

	const validateStep = () => {
		return promptVal !== '';
	};

	return (
		<Stack spacing={ 3 }>

			<Grid container columnSpacing={ 2 } >
				<Grid xs={ 12 } lg={ 6 } sx={ { pl: 0 } }>

					<FormControl>
						<FormLabel>{ __( 'Choose Prompt Template' ) }</FormLabel>
						<Select
							value={ internalState.templateName }
							onChange={ ( event, value ) => handlePromptTemplateSelection( value ) }
							endDecorator={ isFetchingPromptTemplates ? <CircularProgress size="sm" sx={ { mr: 1 } } /> : null }
							disabled={ isFetchingPromptTemplates }
						>
							{
								promptTemplatesSuccess &&
								Object.entries( {
									...Object.keys( allPromptTemplates ).reduce(
										( acc, key ) => {
											acc[ key ] = allPromptTemplates[ key ].template_name;
											return acc;
										}, {}
									),
									Custom: __( 'Custom' ),
								} ).map( ( [ key, value ] ) => {
									return <Option key={ key } value={ key }>{ value }</Option>;
								} )
							}
						</Select>
					</FormControl>
				</Grid>
				<Grid xs={ 12 } lg={ 6 } sx={ { pr: 0 } }>

					<FormControl>
						<FormLabel>{ __( 'AI Model' ) }</FormLabel>
						<Select
							defaultValue={ aiGeneratorConfig.modelName }
							onChange={ ( event, value ) => setAIGeneratorConfig( { ...aiGeneratorConfig, modelName: value } ) }
							endDecorator={ isFetchingAiModels ? <CircularProgress size="sm" sx={ { mr: 1 } } /> : null }
							disabled={ isFetchingAiModels }
						>
							{
								aiModelsSuccess &&
								Object.entries( aiModels ).map( ( [ key, value ] ) => {
									return <Option key={ key } value={ key }>{ value }</Option>;
								} )
							}
						</Select>
					</FormControl>
				</Grid>

			</Grid>

			<FormControl required>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-end">
					<Box>
						<FormLabel>{ __( 'Prompt Template' ) }</FormLabel>
					</Box>
					<Button
						size="xs"
						variant="plain"
						onClick={ () => setInternalState( {
							...internalState,
							showPrompt: ! internalState.showPrompt,
						} ) }
						sx={ ( theme ) => ( { mb: theme.spacing( 0.5 ) } ) }
					>
						{ internalState.showPrompt ? __( 'Hide prompt' ) : __( 'Show prompt' ) }
					</Button>
				</Stack>
				<Textarea
					variant={ internalState.showPrompt ? 'soft' : 'outlined' }
					value={ internalState.showPrompt ? promptVal : aiGeneratorConfig.promptTemplate }
					minRows={ 5 }
					onChange={ ( event ) => {
						setAIGeneratorConfig( { ...aiGeneratorConfig, promptTemplate: event.target.value } );
						if ( internalState.templateName !== 'Custom' ) {
							setInternalState( { ...internalState, templateName: 'Custom' } );
						}
					} }
					disabled={ internalState.showPrompt }
					sx={ {
						'&.Mui-disabled': {
							color: 'inherit',
						},
					} }
					required
				/>
				<FormHelperText>{ __( 'Prompt template to be used while generating content. supported variables are {keywords}, {primary_keyword}, {title}, {language}' ) }</FormHelperText>
			</FormControl>

			{
				! noPromptTemplate && internalState.templateName === 'Custom' && promptVal !== '' && (
					<DataBox color="primary" variant="soft" title={ newPromptData.showSaveForm ? __( 'Save current prompt:' ) : '' }>
						{ newPromptData.showSaveForm
							? <>
								<FormControl>
									<Grid container alignItems="center" columnSpacing={ 2 } >
										<Grid xs={ 12 } lg={ 6 }>

											<Select
												value={ newPromptData.promptType }
												onChange={ ( event, value ) => setNewPromptData( { ...newPromptData, promptType: value } ) }
											>
												{
													Object.entries( promptTypes ).map( ( [ key, value ] ) => {
														return <Option key={ key } value={ key }>{ value }</Option>;
													} )
												}
											</Select>
										</Grid>
										<Grid xs={ 12 } lg={ 6 }>
											<FormHelperText sx={ { mt: 0 } }>{ __( 'The Type of task that the prompt can be used in' ) }</FormHelperText>
										</Grid>
									</Grid>
								</FormControl>
								<Input
									value={ newPromptData.templateName }
									placeholder={ __( 'New template name…' ) }
									onChange={ ( event ) => setNewPromptData( { ...newPromptData, templateName: event.target.value } ) }
									endDecorator={
										<Button
											disabled={ newPromptData.templateName === '' }
											loading={ newPromptData.saving }
											size="sm"
											onClick={ handleSavePromptTemplate }
										>
											{ __( 'Save' ) }
										</Button>
									}
									sx={ { mt: 2 } }
								/>
							</>
							: <Stack direction="row" spacing={ 2 } alignItems="center" justifyContent="flex-end">
								<Typography level="body-sm" color="primary">{ __( 'Selected prompt changed, you can save it as a new template !' ) }</Typography>
								<Button
									size="sm"
									onClick={ () => setNewPromptData( ( s ) => ( { ...s, showSaveForm: true } ) ) }
								>
									{ __( 'Save template' ) }
								</Button>
							</Stack>
						}
					</DataBox>

				)
			}

			{ internalState.useEditor && internalState.showEditor && <WrappedEditor /> }

			<NavigationButtons
				finishButton={ closeBtn
					? <Button onClick={ handleClose }>{ __( 'Close' ) }</Button>
					: <Button
						onClick={ handleGenerateContent }
						loading={ internalState.isGenerating }
						startDecorator={ <IconStars /> }
						disabled={ ! validateStep() || internalState.isGenerating }
					>
						{ __( 'Generate Text' ) }
					</Button> }
			/>
		</Stack>

	);
};

const NavigationButtons = ( { finishButton, disableBack, disableNext } ) => {
	const { __ } = useI18n();
	const { step, stepBack, stepNext } = useContext( ManualGeneratorContext );
	return (
		<Box>
			<Divider sx={ ( theme ) => ( {
				marginY: theme.spacing( 2 ),
			} ) } />
			<Stack
				direction="row"
				justifyContent={ 'end' }
				alignItems="center"
				spacing={ 1 }
			>
				{ ( step > 0 ) && <Button variant="soft" color="neutral" disabled={ disableBack === true } onClick={ stepBack }>{ __( 'Go back' ) }</Button> }
				{ finishButton ? finishButton : <Button endDecorator={ <IconArrow /> } disabled={ disableNext === true } onClick={ stepNext }>{ __( 'Next' ) }</Button> }
			</Stack>
		</Box>
	);
};
export default memo( ContentGeneratorConfigPanelManual );
