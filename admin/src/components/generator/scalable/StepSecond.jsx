import { memo, useState, useContext, useRef } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { promptTypes } from '../usePromptTemplateEditorRow';
import usePostTypesQuery from '../../../queries/usePostTypesQuery';
import useAIModelsQuery from '../../../queries/useAIModelsQuery';
import usePromptTemplateQuery from '../../../queries/usePromptTemplateQuery';
import useAIGenerator, {
	contextTypePromptPlaceholder,
	contextTypes,
	contextTypesDescription,
} from '../../../hooks/useAIGenerator';

import { scalableGeneratorImportKeywords, newPromptDefaults, savePromptTemplate } from '../generatorUtils';
import { ScalableGeneratorContext } from './ContentGeneratorScalable';

import { ReactComponent as IconStars } from '../../../assets/images/icons/icon-stars.svg';
import DataBox from '../../../elements/DataBox';
import StepNavigation from '../../StepNavigation';

import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import CircularProgress from '@mui/joy/CircularProgress';
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import LinearProgress from '@mui/joy/LinearProgress';
import Box from '@mui/joy/Box';

const StepSecond = () => {
	const { __ } = useI18n();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const stopImport = useRef( false );
	const { isFloating, currentStep, setCurrentStep } = useContext( ScalableGeneratorContext );
	const [ newPromptData, setNewPromptData ] = useState( newPromptDefaults );
	const { aiGeneratorConfig, setAIGeneratorConfig, aiGeneratorScalableHelpers, setAIGeneratorScalableHelpers } = useAIGenerator();

	const { data: aiModels, isSuccess: isSuccessAiModels, isFetching: isFetchingAiModels } = useAIModelsQuery();
	const { data: promptTemplates, isSuccess: isSuccessPromptTemplates, isFetching: isFetchingPromptTemplates } = usePromptTemplateQuery();
	const { data: postTypes, isSuccess: isSuccessPostTypes, isFetching: isFetchingPostTypes } = usePostTypesQuery();

	// handling prompt template selection
	const handlePromptTemplateSelection = ( selectedTemplate ) => {
		if ( selectedTemplate ) {
			if ( selectedTemplate === 'Custom' ) {
				setAIGeneratorScalableHelpers( { templateName: 'Custom' } );

				return;
			}
			setAIGeneratorConfig( { promptTemplate: promptTemplates[ selectedTemplate ].prompt_template } );
			setAIGeneratorScalableHelpers( { templateName: promptTemplates[ selectedTemplate ].template_name } );
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
			aiGeneratorHelpersCallback: setAIGeneratorScalableHelpers,
		}, queryClient );
	};

	const handleImportKeywords = () => {
		scalableGeneratorImportKeywords( {
			aiGeneratorScalableHelpers,
			setAIGeneratorScalableHelpers,
			aiGeneratorConfig,
			stopImport,
			queryClient,
			finishCallback: () => {
				setAIGeneratorScalableHelpers( { importStatus: 0 } );
				navigate( '/Generator/processes' );
			},
		} );
	};

	const isValidStep = () => aiGeneratorScalableHelpers.importStatus === 0 && aiGeneratorConfig.promptTemplate !== '';

	return (
		<Stack spacing={ 3 }>
			<Grid container columnSpacing={ 2 } >
				<Grid xs={ 12 } lg={ 6 } sx={ { pl: 0 } }>

					<FormControl>
						<FormLabel>{ __( 'Select Post Type' ) }</FormLabel>
						<Select
							value={ aiGeneratorScalableHelpers.postType }
							onChange={ ( event, value ) => setAIGeneratorScalableHelpers( { postType: value } ) }
							endDecorator={ isFetchingPostTypes ? <CircularProgress size="sm" sx={ { mr: 1 } } /> : null }
							disabled={ isFetchingPostTypes }
						>
							{ isSuccessPostTypes &&
								Object.entries( postTypes ).map( ( [ key, value ] ) => {
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
							{ isSuccessAiModels &&
								Object.entries( aiModels ).map( ( [ key, value ] ) => {
									return <Option key={ key } value={ key }>{ value }</Option>;
								} )
							}
						</Select>
					</FormControl>

				</Grid>
			</Grid>

			<FormControl>
				<FormLabel>{ __( 'Data source' ) }</FormLabel>
				<Select
					value={ aiGeneratorScalableHelpers.dataSource }
					onChange={ ( event, value ) => setAIGeneratorScalableHelpers( { dataSource: value } ) }
				>
					{ Object.entries( contextTypes ).map( ( [ key, value ] ) => {
						return key === 'NO_CONTEXT' || key === 'SERP_CONTEXT'
							? <Option key={ key } value={ key }>{ value }</Option>
							: null;
					} ) }
				</Select>
				<FormHelperText>{ contextTypesDescription[ aiGeneratorScalableHelpers.dataSource ] }</FormHelperText>
			</FormControl>

			<FormControl>
				<FormLabel>{ __( 'Choose Prompt Template' ) }</FormLabel>
				<Select
					value={ aiGeneratorScalableHelpers.templateName }
					onChange={ ( event, value ) => handlePromptTemplateSelection( value ) }
					endDecorator={ isFetchingPromptTemplates ? <CircularProgress size="sm" sx={ { mr: 1 } } /> : null }
					disabled={ isFetchingPromptTemplates }
				>
					{ isSuccessPromptTemplates &&
							Object.entries( {
								...Object.keys( promptTemplates ).reduce(
									( acc, key ) => {
										acc[ key ] = promptTemplates[ key ].template_name;
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

			<FormControl required>
				<FormLabel>{ __( 'Prompt Template' ) }</FormLabel>
				<Textarea
					value={ aiGeneratorConfig.promptTemplate }
					placeholder={ contextTypePromptPlaceholder[ aiGeneratorScalableHelpers.dataSource ] }
					minRows={ 5 }
					onChange={ ( event ) => {
						setAIGeneratorConfig( { promptTemplate: event.target.value } );
						if ( aiGeneratorScalableHelpers.templateName !== 'Custom' ) {
							setAIGeneratorScalableHelpers( { templateName: 'Custom' } );
						}
					} }
					required
				/>
				<FormHelperText>
					{ __( 'Prompt Template to be used while generating content.' ) }

					<Stack direction="row" alignItems="center" spacing={ 1 }>
						<span>{ __( 'Supported variable:' ) }</span>
						<Chip size="sm" sx={ ( theme ) => ( { color: 'inherit', fontFamily: theme.fontFamily.code } ) }>{ '{keyword}' }</Chip>
					</Stack>
				</FormHelperText>
			</FormControl>

			{
				aiGeneratorScalableHelpers.templateName === 'Custom' && aiGeneratorConfig.promptTemplate !== '' && (
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

			{ aiGeneratorScalableHelpers.importStatus
				? <Box>
					<Typography color="primary" size="sm" textAlign="center" fontWeight="md">{ __( 'Generating posts…' ) }</Typography>
					<LinearProgress determinate value={ aiGeneratorScalableHelpers.importStatus } sx={ { mt: 1 } } />
				</Box>
				: null
			}

			<StepNavigation
				stepData={ { currentStep, setCurrentStep } }
				finishButton={
					<Button
						loading={ aiGeneratorScalableHelpers.importStatus > 0 }
						disabled={ ! isValidStep() } onClick={ handleImportKeywords }
						startDecorator={ <IconStars /> }
					>
						{ `Generate ${ aiGeneratorScalableHelpers.keywords.length } posts` }
					</Button>
				}
			/>

		</Stack>

	);
};

export default memo( StepSecond );
