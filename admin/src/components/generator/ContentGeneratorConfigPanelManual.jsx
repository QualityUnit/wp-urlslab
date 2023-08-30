import { memo, useEffect, useState, useContext, createContext, useCallback, useMemo } from 'react';

import { InputField, SingleSelectMenu, SuggestInputField } from '../../lib/tableImports';
import CheckboxCustom from '../../elements/Checkbox';
import EditableList from '../../elements/EditableList';
import { postFetch } from '../../api/fetching';
import { fetchLangs } from '../../api/fetchLangs';
import TextAreaEditable from '../../elements/TextAreaEditable';
import Loader from '../Loader';
import { useI18n } from '@wordpress/react-i18n';
import useAIGenerator, {
	contextTypePromptPlaceholder,
	contextTypes,
	contextTypesDescription,
} from '../../hooks/useAIGenerator';
import '../../assets/styles/components/_ContentGeneratorPanel.scss';
import { generateContent, getQueryCluster, getTopUrls, handleGeneratePrompt } from '../../lib/aiGeneratorPanel';
import { getAugmentProcessResult, getPromptTemplates } from '../../api/generatorApi';
import useAIModelsQuery from '../../queries/useAIModelsQuery';
import { setNotification } from '../../hooks/useNotifications';
import useTablePanels from '../../hooks/useTablePanels';

import EditRowPanel from '../EditRowPanel';
import usePromptTemplateQuery from '../../queries/usePromptTemplateQuery';
import usePromptTemplateEditorRow from './usePromptTemplateEditorRow';

import { ReactComponent as IconArrow } from '../../assets/images/icons/icon-arrow.svg';
import { ReactComponent as IconStars } from '../../assets/images/icons/icon-stars.svg';

import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';

const ManualGeneratorContext = createContext( {} );

function ContentGeneratorConfigPanelManual( { initialData = {}, onGenerateComplete, noPromptTemplate, closeBtn, isFloating } ) {
	const { __ } = useI18n();
	const { isSuccess: promptTemplatesSuccess } = usePromptTemplateQuery();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const [ step, setStep ] = useState( 0 );
	console.log( aiGeneratorConfig );
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
		addPromptTemplate: false,
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
				setAIGeneratorConfig( { ...aiGeneratorConfig, keywordsList: [ { q: val, checked: true }, ...queryCluster ] } );
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
		return checkedItems.length > 0 && aiGeneratorConfig.title !== '';
	};

	return (
		<>

			{
				aiGeneratorConfig.mode === 'WITH_INPUT_VAL' && (
					<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
						<FormControl>
							<FormLabel>{ __( 'Input value' ) }</FormLabel>
							<Input
								onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, inputValue: val } ) }
							/>
							<FormHelperText>{ __( 'Input Value to use in prompt' ) }</FormHelperText>
						</FormControl>
					</div>
				)
			}

			{
				( aiGeneratorConfig.mode === 'CREATE_POST' || aiGeneratorConfig.mode === 'CREATE_POST_WITH_SCALABLE_OPTION' ) && (
					<>

						<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
							<FormControl>
								<FormLabel>{ __( 'Page title' ) }</FormLabel>
								<Input
									defaultValue={ aiGeneratorConfig.title }
									onChange={ ( event ) => setAIGeneratorConfig( { ...aiGeneratorConfig, title: event.target.value } ) }
								/>
								<FormHelperText>{ __( 'Title of new page' ) }</FormHelperText>
							</FormControl>

						</div>

						<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
							<FormControl>
								<FormLabel>{ __( 'Keyword' ) }</FormLabel>
								<Input
									defaultValue={ aiGeneratorConfig.keywordsList.length > 0 ? aiGeneratorConfig.keywordsList[ 0 ].q : '' }
									onChange={ ( event ) => handleChangeKeywordInput( event.target.value ) }
								/>
								<FormHelperText>{ __( 'Keyword to pick' ) }</FormHelperText>
							</FormControl>
						</div>
					</>
				)
			}

			{
				loadingKeywords
					? <Sheet variant="outlined" className="flex flex-align-center flex-justify-center fs-m" sx={ { p: 2 } }><CircularProgress size="sm" sx={ { mr: 1 } } />{ __( 'Loading keywords' ) }</Sheet>
					: aiGeneratorConfig.keywordsList.length > 0 &&
						<Sheet variant="outlined" sx={ { p: 1 } }>
							<Typography level="body-xs" sx={ { textTransform: 'uppercase', fontWeight: 600 } }>{ __( 'Loaded keywords:' ) }</Typography>
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
						</Sheet>
			}

			<NavigationButtons disableNext={ ! validateStep() } />
		</>

	);
};

const SecondStep = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const { isFloating } = useContext( ManualGeneratorContext );

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
			const topUrls = await getTopUrls( aiGeneratorConfig );
			setAIGeneratorConfig( { ...useAIGenerator.getState().aiGeneratorConfig, serpUrlsList: topUrls } );
		}
	};

	return (
		<>
			<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
				<SingleSelectMenu
					key={ aiGeneratorConfig.dataSource }
					items={ contextTypes }
					name="context_menu"
					defaultAccept
					description={ contextTypesDescription[ aiGeneratorConfig.dataSource ] }
					autoClose
					defaultValue={ aiGeneratorConfig.dataSource }
					onChange={ handleDataSourceSelection }
				/>
			</div>

			{
				aiGeneratorConfig.dataSource && aiGeneratorConfig.dataSource === 'URL_CONTEXT' && (
					<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
						<div className="urlslab-content-gen-panel-control-item-container">
							<EditableList
								placeholder="URLs to use..."
								itemList={ aiGeneratorConfig.urlsList }
								addItemCallback={ ( item ) => setAIGeneratorConfig( {
									...aiGeneratorConfig,
									urlsList: [ ...aiGeneratorConfig.urlsList, item ],
								} ) }
								removeItemCallback={ ( removingItem ) =>
									setAIGeneratorConfig( {
										...aiGeneratorConfig,
										urlsList: aiGeneratorConfig.urlsList.filter( ( item ) => item !== removingItem ),
									} )
								}
							/>
						</div>
					</div>
				)
			}

			{
				aiGeneratorConfig.dataSource && aiGeneratorConfig.dataSource === 'DOMAIN_CONTEXT' && (
					<div>
						<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
							<div className="urlslab-content-gen-panel-control-item-container">
								<SuggestInputField
									suggestInput=""
									liveUpdate
									onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, domain: val } ) }
									required
									showInputAsSuggestion={ false }
									description={ __( 'Domain to use' ) }
									postFetchRequest={ async ( val ) => {
										return await postFetch( 'schedule/suggest', {
											count: val.count,
											url: val.input,
										} );
									} }
								/>
							</div>
						</div>
						<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
							<div className="urlslab-content-gen-panel-control-item-container">
								<InputField
									liveUpdate
									defaultValue=""
									description={ __( 'What piece of data you are looking for in your domain' ) }
									label={ __( 'Semantic Context' ) }
									onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, semanticContext: val } ) }
									required
								/>
							</div>
						</div>
					</div>
				)
			}

			{
				aiGeneratorConfig.dataSource && aiGeneratorConfig.dataSource === 'SERP_CONTEXT' && (
					<div className="urlslab-content-gen-panel-control-item-list">
						{
							aiGeneratorConfig.serpUrlsList.map( ( url, idx ) => {
								return (
									<div key={ url.url_name }>
										<CheckboxCustom
											defaultValue={ false }
											onChange={ ( checked ) => handleSerpUrlCheckboxCheck( checked, idx ) }
										/> <span>{ url.url_name }</span>
									</div>
								);
							} )
						}
					</div>
				)
			}

			<SingleSelectMenu
				className="mb-l"
				key={ aiGeneratorConfig.lang }
				items={ fetchLangs() }
				name="lang_menu"
				defaultAccept
				autoClose
				defaultValue={ aiGeneratorConfig.lang }
				onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, lang: val } ) }
			>{ __( 'Language' ) }</SingleSelectMenu>

			<NavigationButtons />
		</>
	);
};

const ThirdStep = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig } = useAIGenerator();
	const { isFloating, noPromptTemplate, internalState, setInternalState, promptVal, onGenerateComplete, closeBtn } = useContext( ManualGeneratorContext );
	const { rowEditorCells, rowToEdit } = usePromptTemplateEditorRow();
	const { data: aiModels, isSuccess: aiModelsSuccess } = useAIModelsQuery();
	const { data: allPromptTemplates, isSuccess: promptTemplatesSuccess } = usePromptTemplateQuery();

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
		setInternalState( { ...internalState, addPromptTemplate: true } );
	};

	const showSecondPanel = useTablePanels( ( state ) => state.showSecondPanel );

	const handleClose = () => {
		showSecondPanel();
	};

	const handleGenerateContent = async () => {
		try {
			setInternalState( { ...internalState, isGenerating: true } );
			const processId = await generateContent( aiGeneratorConfig, promptVal );
			const pollForResult = setInterval( async () => {
				try {
					const resultResponse = await getAugmentProcessResult( processId );
					if ( resultResponse.ok ) {
						const generationRes = await resultResponse.json();
						if ( generationRes.status === 'SUCCESS' ) {
							clearInterval( pollForResult );
							onGenerateComplete( generationRes.response[ 0 ] );
							setInternalState( { ...internalState, isGenerating: false } );
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
					setInternalState( { ...internalState, isGenerating: false } );
				}
			}, 2000 );
		} catch ( e ) {
			setNotification( 1, { message: e.message, status: 'error' } );
			setInternalState( { ...internalState, isGenerating: false } );
		}
	};

	return (
		<>
			<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>

				{
					promptTemplatesSuccess && (
						<SingleSelectMenu
							className="mb-l"
							autoClose
							defaultValue={ internalState.templateName }
							key={ internalState.templateName }
							items={ {
								...Object.keys( allPromptTemplates ).reduce( ( acc, key ) => {
									acc[ key ] = allPromptTemplates[ key ].template_name;
									return acc;
								}, {} ), Custom: 'Custom',
							} }
							liveUpdate
							onChange={ handlePromptTemplateSelection }
							showInputAsSuggestion={ false }
						>{ __( 'Choose Prompt Template' ) }</SingleSelectMenu>
					)
				}

				<SingleSelectMenu
					key={ aiGeneratorConfig.modelName }
					items={ aiModelsSuccess ? aiModels : {} }
					name="mode_name_menu"
					defaultAccept
					autoClose
					defaultValue={ aiGeneratorConfig.modelName }
					onChange={ ( val ) => setAIGeneratorConfig( { ...aiGeneratorConfig, modelName: val } ) }
				/>
			</div>

			<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
				<TextAreaEditable
					liveUpdate
					val={ aiGeneratorConfig.promptTemplate }
					defaultValue=""
					label={ __( 'Prompt Template' ) }
					rows={ 5 }
					allowResize
					onChange={ ( promptTemplate ) => {
						setAIGeneratorConfig( { ...aiGeneratorConfig, promptTemplate } );
						if ( internalState.templateName !== 'Custom' ) {
							setInternalState( { ...internalState, templateName: 'Custom' } );
						}
					} }
					required
					placeholder={ contextTypePromptPlaceholder[ aiGeneratorConfig.dataSource ] }
					description={ __( 'Prompt Template to be used while generating content. supported variables are {keywords}, {primary_keyword}, {title}, {language}' ) } />

				<div className="flex mt-m">

					<Button
						onClick={ () => setInternalState( {
							...internalState,
							showPrompt: ! internalState.showPrompt,
						} ) }
					>
						{ internalState.showPrompt ? __( 'Hide Prompt' ) : __( 'Show Prompt' ) }
					</Button>
					{
						! noPromptTemplate && internalState.templateName === 'Custom' && promptVal !== '' && (
							<Button onClick={ handleSavePromptTemplate }>{ __( 'Save Template' ) }</Button>
						)
					}
				</div>
				{
					! noPromptTemplate && internalState.addPromptTemplate && (
						<EditRowPanel slug="prompt-template" rowEditorCells={ rowEditorCells } rowToEdit={ rowToEdit }
							title="Add Prompt Template"
							handlePanel={ () => setInternalState( { ...internalState, addPromptTemplate: false } ) }
						/>
					)
				}
			</div>
			{
				internalState.showPrompt && (
					<div className={ `${ isFloating ? 'urlslab-panel-content__item' : '' } mb-l` }>
						<TextAreaEditable
							liveUpdate
							val={ promptVal }
							label={ __( 'Prompt' ) }
							rows={ 5 }
							readonly
							description={ __( 'Prompt to be used' ) } />
					</div>
				)
			}

			<NavigationButtons
				finishButton={ closeBtn
					? <Button onClick={ handleClose }>{ __( 'Close' ) }</Button>
					: <Button
						onClick={ handleGenerateContent }
						loading={ internalState.isGenerating }
						startDecorator={ <IconStars /> }
					>
						{ __( 'Generate Text' ) }
					</Button> }
			/>
		</>

	);
};

const NavigationButtons = ( { finishButton, disableBack, disableNext } ) => {
	const { __ } = useI18n();
	const { step, stepBack, stepNext } = useContext( ManualGeneratorContext );
	return (
		<>
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
		</>
	);
};
export default memo( ContentGeneratorConfigPanelManual );
