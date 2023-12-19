import { memo, useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useAIGenerator from '../../../hooks/useAIGenerator';
import { getQueryCluster } from '../../../lib/aiGeneratorPanel';

import DataBox from '../../../elements/DataBox';
import StepNavigation, { StepNavigationHeader } from '../../StepNavigation';
import CountrySelect from '../../../elements/CountrySelect';

import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';

import { ManualGeneratorContext } from './ContentGeneratorManual';

const StepFirst = () => {
	const { __ } = useI18n();
	const { aiGeneratorConfig, setAIGeneratorConfig, aiGeneratorManualHelpers, setAIGeneratorManualHelpers } = useAIGenerator();
	const { currentStep, setCurrentStep, steps } = useContext( ManualGeneratorContext );
	const [ loadingKeywords, setLoadingKeywords ] = useState( false );
	const typingTimeoutRef = useRef( null );
	const [ currentUserKeyword, setCurrentUserKeyword ] = useState( aiGeneratorConfig.keywordsList.length > 0 ? aiGeneratorConfig.keywordsList[ 0 ].q : '' );

	useEffect( () => {
		const fetchQueryClusterData = async () => {
			setLoadingKeywords( true );
			const queryCluster = await getQueryCluster( { query: currentUserKeyword, country: aiGeneratorManualHelpers.country } );
			setLoadingKeywords( false );
			setAIGeneratorConfig( { keywordsList: [ { q: currentUserKeyword, checked: true }, ...queryCluster ] } );
		};
		if ( currentUserKeyword !== '' ) {
			fetchQueryClusterData();
		}
	}, [ aiGeneratorManualHelpers.country, currentUserKeyword, setAIGeneratorConfig ] );

	const handleChangeKeywordInput = useCallback( ( val ) => {
		if ( val === '' ) {
			setCurrentUserKeyword( val );
			setAIGeneratorConfig( { keywordsList: [] } );
			return;
		}

		if ( typingTimeoutRef.current ) {
			clearTimeout( typingTimeoutRef.current );
		}

		typingTimeoutRef.current = setTimeout( async () => {
			setCurrentUserKeyword( val );
		}, 600 );
	}, [ setAIGeneratorConfig ] );

	// handling checking checkbox for keywords
	const handleKeywordsCheckboxCheck = useCallback( ( checked, index, checkAll ) => {
		const newList = aiGeneratorConfig.keywordsList.map( ( keyword, idx ) => {
			if ( idx === index ) {
				return { ...keyword, checked };
			}
			if ( checkAll ) {
				const checkedEvery = ! aiGeneratorConfig.keywordsList.every( ( key ) => key.checked );
				return { ...keyword, checked: checkedEvery };
			}
			return keyword;
		} );
		setAIGeneratorConfig( { keywordsList: newList } );
	}, [ aiGeneratorConfig.keywordsList, setAIGeneratorConfig ] );

	const isValidStep = () => {
		const checkedItems = aiGeneratorConfig.keywordsList.filter( ( item ) => item.checked === true );
		return ! loadingKeywords && checkedItems.length > 0 && aiGeneratorConfig.title !== '';
	};

	return (
		<Stack spacing={ 3 }>

			<StepNavigationHeader
				stepData={ { currentStep, setCurrentStep } }
				disableNext={ ! isValidStep() }
				steps={ steps }
			/>

			{
				aiGeneratorConfig.mode === 'WITH_INPUT_VAL' && (
					<FormControl>
						<FormLabel>{ __( 'Input value' ) }</FormLabel>
						<Input
							onChange={ ( event ) => setAIGeneratorConfig( { inputValue: event.target.value } ) }
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
								onChange={ ( event ) => setAIGeneratorConfig( { title: event.target.value } ) }
							/>
							<FormHelperText>{ __( 'Title of new page' ) }</FormHelperText>
						</FormControl>
						<Grid container columnSpacing={ 2 } >
							<Grid xs={ 12 } lg={ 6 } sx={ { pl: 0 } }>
								<FormControl required>
									<FormLabel>{ __( 'Keyword' ) }</FormLabel>
									<Input
										defaultValue={ currentUserKeyword }
										onChange={ ( event ) => handleChangeKeywordInput( event.target.value ) }
									/>
									<FormHelperText>{ __( 'Keyword to pick' ) }</FormHelperText>
								</FormControl>

							</Grid>
							<Grid xs={ 12 } lg={ 6 } sx={ { pr: 0 } }>
								<FormControl>
									<FormLabel>{ __( 'Country' ) }</FormLabel>
									<CountrySelect value={ aiGeneratorManualHelpers.country } onChange={ ( value ) => setAIGeneratorManualHelpers( { country: value } ) } />
								</FormControl>
							</Grid>

						</Grid>

					</>
				)
			}

			<DataBox
				title={ __( 'Loaded keywords:' ) }
				loadingText={ __( 'Loading keywords…' ) }
				loading={ loadingKeywords }
			>
				{ aiGeneratorConfig.keywordsList.length > 0 &&
				<>
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
					{
						! loadingKeywords &&
						<div className="flex flex-justify-center">
							<Button sx={ { mt: 1 } } onClick={ () => handleKeywordsCheckboxCheck( true, false, true ) }>{
								! aiGeneratorConfig.keywordsList.every( ( key ) => key.checked )
									? __( 'Select All' )
									: __( 'Deselect All' )
							}</Button>
						</div>
					}
				</>
				}
			</DataBox>

			<StepNavigation stepData={ { currentStep, setCurrentStep, aiGeneratorConfig } } disableNext={ ! isValidStep() } />

		</Stack>

	);
};

export default memo( StepFirst );
