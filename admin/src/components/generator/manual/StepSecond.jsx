import { memo, useContext } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { SuggestInputField } from '../../../lib/tableImports';
import { fetchLangsForAutocomplete } from '../../../api/fetchLangs';
import useAIGenerator, {
	contextTypes,
	contextTypesDescription,
} from '../../../hooks/useAIGenerator';
import { getTopUrls } from '../../../lib/aiGeneratorPanel';

import EditableList from '../../../elements/EditableList';
import DataBox from '../../../elements/DataBox';
import StepNavigation, { StepNavigationHeader } from '../../StepNavigation';

import { ManualGeneratorContext } from './ContentGeneratorManual';

import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Autocomplete from '@mui/joy/Autocomplete';

const langs = fetchLangsForAutocomplete();

const StepSecond = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig, aiGeneratorManualHelpers, setAIGeneratorManualHelpers } = useAIGenerator();
	const { currentStep, setCurrentStep, steps } = useContext( ManualGeneratorContext );

	// handling serpUrlCheckboxCheck
	const handleSerpUrlCheckboxCheck = ( checked, index ) => {
		const newList = aiGeneratorConfig.serpUrlsList.map( ( url, idx ) => {
			if ( idx === index ) {
				return { ...url, checked };
			}
			return url;
		} );
		setAIGeneratorConfig( { serpUrlsList: newList } );
	};

	// handling data source selection serp
	const handleDataSourceSelection = async ( val ) => {
		setAIGeneratorConfig( { dataSource: val } );

		if ( val === 'SERP_CONTEXT' ) {
			setAIGeneratorManualHelpers( { loadingTopUrls: true } );
			const topUrls = await getTopUrls( aiGeneratorConfig.keywordsList );
			setAIGeneratorConfig( { serpUrlsList: topUrls } );
			setAIGeneratorManualHelpers( { loadingTopUrls: false } );
		}
	};

	const isValidStep = () => {
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

			<StepNavigationHeader
				stepData={ { currentStep, setCurrentStep } }
				disableNext={ ! isValidStep() }
				steps={ steps }
			/>

			<FormControl>
				<FormLabel>{ __( 'Data source' ) }</FormLabel>
				<Select
					value={ aiGeneratorConfig.dataSource }
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
								setAIGeneratorConfig( { urlsList: [ ...aiGeneratorConfig.urlsList, item ] } );
							}
						} }
						removeItemCallback={ ( removingItem ) =>
							setAIGeneratorConfig( { urlsList: aiGeneratorConfig.urlsList.filter( ( item ) => item !== removingItem ) } )
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
							onChange={ ( val ) => setAIGeneratorConfig( { domain: [ val ] } ) }
							showInputAsSuggestion={ false }
							placeholder={ __( 'Type domain…' ) }
							fetchUrl="schedule/suggest"
						/>
					</FormControl>

					<FormControl required>
						<FormLabel>{ __( 'Semantic Context' ) }</FormLabel>
						<Input
							onChange={ ( val ) => setAIGeneratorConfig( { semanticContext: val } ) }
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
					loading={ aiGeneratorManualHelpers.loadingTopUrls }
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
											ellipsis
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
					options={ Object.values( langs ) }
					value={ langs[ aiGeneratorConfig.lang ] }
					onChange={ ( event, newValue ) => setAIGeneratorConfig( { lang: newValue.id } ) }
					disableClearable

				/>
			</FormControl>

			<StepNavigation stepData={ { currentStep, setCurrentStep } } disableNext={ ! isValidStep() } />

		</Stack>
	);
};

export default memo( StepSecond );
