import { memo, useEffect, useState, useContext } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import { generateContent, handleGeneratePrompt } from '../../../lib/aiGeneratorPanel';
import { getAugmentProcessResult } from '../../../api/generatorApi';
import useAIGenerator from '../../../hooks/useAIGenerator';
import { setNotification } from '../../../hooks/useNotifications';
import useTablePanels from '../../../hooks/useTablePanels';
import { promptTypes } from '../usePromptTemplateEditorRow';

import useAIModelsQuery from '../../../queries/useAIModelsQuery';
import usePromptTemplateQuery from '../../../queries/usePromptTemplateQuery';

import { savePromptTemplate, newPromptDefaults } from '../generatorUtils';
import { ManualGeneratorContext } from './ContentGeneratorManual';

import { ReactComponent as IconStars } from '../../../assets/images/icons/icon-stars.svg';
import ContentGeneratorEditor from '../ContentGeneratorEditor';
import DataBox from '../../../elements/DataBox';
import StepNavigation, { StepNavigationHeader } from '../../StepNavigation';

import Typography from '@mui/joy/Typography/Typography';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import CircularProgress from '@mui/joy/CircularProgress';
import Textarea from '@mui/joy/Textarea';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Chip from '@mui/joy/Chip';

const StepThird = () => {
	const { __ } = useI18n();
	const queryClient = useQueryClient();

	const { aiGeneratorConfig, setAIGeneratorConfig, aiGeneratorManualHelpers, setAIGeneratorManualHelpers } = useAIGenerator();
	const { isFloating, currentStep, setCurrentStep, steps, useEditor, noPromptTemplate, onGenerateComplete, closeBtn } = useContext( ManualGeneratorContext );
	const { data: aiModels, isSuccess: aiModelsSuccess, isFetching: isFetchingAiModels } = useAIModelsQuery();
	const { data: allPromptTemplates, isSuccess: promptTemplatesSuccess, isFetching: isFetchingPromptTemplates } = usePromptTemplateQuery();

	const [ stepState, setStepState ] = useState( {
		promptVal: '',
		showEditor: false,
		isGenerating: false,
		showPrompt: false,
	} );

	useEffect( () => {
		setStepState( ( s ) => ( { ...s, promptVal: handleGeneratePrompt( aiGeneratorConfig ) } ) );
	}, [ aiGeneratorConfig ] );

	const [ newPromptData, setNewPromptData ] = useState( newPromptDefaults );
	// handling prompt template selection
	const handlePromptTemplateSelection = ( selectedTemplate ) => {
		if ( selectedTemplate ) {
			if ( selectedTemplate === 'Custom' ) {
				setAIGeneratorManualHelpers( { templateName: 'Custom' } );
				return;
			}
			setAIGeneratorConfig( { promptTemplate: allPromptTemplates[ selectedTemplate ].prompt_template } );
			setAIGeneratorManualHelpers( { templateName: allPromptTemplates[ selectedTemplate ].template_name } );
		}
	};

	// handling save prompt template
	const handleSavePromptTemplate = () => {
		savePromptTemplate( {
			model_name: aiGeneratorConfig.modelName,
			prompt_template: aiGeneratorConfig.promptTemplate,
			prompt_type: newPromptData.promptType,
			template_name: newPromptData.templateName,
		}, {
			newPromptDataCallback: setNewPromptData,
			aiGeneratorHelpersCallback: setAIGeneratorManualHelpers,
		}, queryClient );
	};

	const showSecondPanel = useTablePanels( ( state ) => state.showSecondPanel );

	const handleClose = () => {
		showSecondPanel();
	};

	const handleGenerateContent = async () => {
		try {
			setStepState( ( s ) => ( { ...s, isGenerating: true, showEditor: false } ) );
			const processId = await generateContent( aiGeneratorConfig, stepState.promptVal );
			const pollForResult = setInterval( async () => {
				try {
					const resultResponse = await getAugmentProcessResult( processId );
					if ( resultResponse.ok ) {
						const generationRes = await resultResponse.json();
						if ( generationRes.status === 'SUCCESS' ) {
							setAIGeneratorManualHelpers( { editorVal: generationRes.response[ 0 ] } );
							if ( onGenerateComplete ) {
								onGenerateComplete( generationRes.response[ 0 ] );
							}
							clearInterval( pollForResult );
							setStepState( ( s ) => ( { ...s, isGenerating: false, showEditor: true } ) );
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
					setStepState( ( s ) => ( { ...s, isGenerating: false, showEditor: false } ) );
				}
			}, 2000 );
		} catch ( e ) {
			setNotification( 1, { message: e.message, status: 'error' } );
			setStepState( ( s ) => ( { ...s, isGenerating: false, showEditor: false } ) );
		}
	};

	const isValidStep = () => stepState.promptVal !== '';

	return (
		<Stack spacing={ 3 }>

			<StepNavigationHeader
				stepData={ { currentStep, setCurrentStep } }
				steps={ steps }
			/>

			<Grid container columnSpacing={ 2 } >
				<Grid xs={ 12 } lg={ 6 } sx={ { pl: 0 } }>

					<FormControl>
						<FormLabel>{ __( 'Choose Prompt Template' ) }</FormLabel>
						<Select
							value={ aiGeneratorManualHelpers.templateName }
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
							value={ aiGeneratorConfig.modelName }
							onChange={ ( event, value ) => setAIGeneratorConfig( { modelName: value } ) }
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
						onClick={ () => setStepState( ( s ) => ( { ...s, showPrompt: ! s.showPrompt } ) ) }
						sx={ ( theme ) => ( { mb: theme.spacing( 0.5 ) } ) }
					>
						{ stepState.showPrompt ? __( 'Hide prompt' ) : __( 'Show prompt' ) }
					</Button>
				</Stack>
				<Textarea
					variant={ stepState.showPrompt ? 'soft' : 'outlined' }
					value={ stepState.showPrompt ? stepState.promptVal : aiGeneratorConfig.promptTemplate }
					minRows={ 5 }
					onChange={ ( event ) => {
						setAIGeneratorConfig( { promptTemplate: event.target.value } );
						if ( aiGeneratorManualHelpers.templateName !== 'Custom' ) {
							setAIGeneratorManualHelpers( { templateName: 'Custom' } );
						}
					} }
					disabled={ stepState.showPrompt }
					sx={ {
						'&.Mui-disabled': {
							color: 'inherit',
						},
					} }
					required
				/>
				<FormHelperText>
					{ __( 'Prompt Template to be used while generating content.' ) }
					<Stack direction="row" alignItems="center" spacing={ 1 }>
						<span>{ __( 'Supported variables:' ) }</span>
						{ [
							'keywords',
							'primary_keyword',
							'title',
							'language',
						].map( ( kw ) => <Chip key={ kw } size="sm" sx={ ( theme ) => ( { color: 'inherit', fontFamily: theme.fontFamily.code } ) }>{ `{${ kw }}` }</Chip> )
						}
					</Stack>

				</FormHelperText>
			</FormControl>

			{
				! noPromptTemplate && aiGeneratorManualHelpers.templateName === 'Custom' && stepState.promptVal !== '' && (
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
								<Typography level="body-sm" color="primary">{ __( 'Prompt changed, you can save it as a new template !' ) }</Typography>
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

			{ useEditor && stepState.showEditor && (
				<DataBox
					title={ __( 'Generated content:' ) }
					loadingText={ __( 'Loading editor…' ) }
					loading={ aiGeneratorManualHelpers.editorLoading }
					color="primary"
					renderHiddenWhileLoading
				>
					<Box sx={ { p: 2 } }>
						<ContentGeneratorEditor />
					</Box>
				</DataBox> )
			}

			<StepNavigation
				stepData={ { currentStep, setCurrentStep } }
				finishButton={ closeBtn
					? <Button onClick={ handleClose }>{ __( 'Close' ) }</Button>
					: <Button
						onClick={ handleGenerateContent }
						loading={ stepState.isGenerating }
						startDecorator={ <IconStars /> }
						disabled={ ! isValidStep() || stepState.isGenerating }
					>
						{ __( 'Generate Text' ) }
					</Button> }
			/>
		</Stack>

	);
};
export default memo( StepThird );
