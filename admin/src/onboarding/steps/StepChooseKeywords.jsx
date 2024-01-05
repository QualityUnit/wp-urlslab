import React, { useCallback, useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';

import Button from '@mui/joy/Button';

import { arrayToTextLines, extractInitialCountry, textLinesToArray } from '../../lib/helpers';
import useOnboarding from '../../hooks/useOnboarding';
import { setSettings } from '../../api/settings';
import { postFetch } from '../../api/fetching';

import SvgIcon from '../../elements/SvgIcon';
import CountrySelect from '../../elements/CountrySelect';
import DataBox from '../../elements/DataBox';

import Stack from '@mui/joy/Stack';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import FormControl from '@mui/joy/FormControl';
import Grid from '@mui/joy/Grid';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';

const StepChooseKeywords = () => {
	const [ updating, setUpdating ] = useState( false );
	const { activeStep, setKeywords, userData, setNextStep, setActiveStep } = useOnboarding();
	const [ userInitialKeyword, setUserInitialKeyword ] = useState( {
		country: extractInitialCountry(),
		keywords: [],
	} );

	const [ internalData, setInternalData ] = useState( {
		additionalKws: [],
		currentStage: 0,
	} );

	useEffect( () => {
		if ( userInitialKeyword.keywords.length ) {
			setInternalData( ( s ) => ( { ...s, currentStage: 1 } ) );
		} else {
			setInternalData( ( s ) => ( { ...s, currentStage: 0 } ) );
		}
	}, [ userInitialKeyword.keywords ] );

	const makeSerpRequest = useCallback( async () => {
		const response = await postFetch( `serp-queries/create`, {
			query: userInitialKeyword.keywords[ 0 ], // use only the first query from textarea
			country: userInitialKeyword.country,
			serp_original_data: true,
		} );
		if ( response.ok ) {
			const data = await response.json();
			const relatedSearches = data.original_data?.related_searches;
			const additionalKws = ( relatedSearches && Array.isArray( relatedSearches ) )
				? relatedSearches.map( ( q ) => {
					return { query: q.query, checked: false };
				} )
				: [];
			setInternalData( { currentStage: 2, additionalKws } );
			return true;
		}
		setInternalData( ( s ) => ( { ...s, currentStage: 2 } ) );
		return false;
	}, [ userInitialKeyword.country, userInitialKeyword.keywords ] );
	/* temporary disabled selection of more keywords
	const handleQueryChecked = useCallback( ( checked, index ) => {
		const newList = internalData.additionalKws.map( ( kw, idx ) => {
			if ( idx === index ) {
				if ( checked && ! userData.keywords.includes( kw.query ) ) {
					setKeywords( [ ...userData.keywords, kw.query ] );
				} else if ( ! checked && userData.keywords.includes( kw.query ) ) {
					setKeywords( userData.keywords.filter( ( k ) => k !== kw.query ) );
				}
				return { ...kw, checked };
			}
			return { ...kw };
		} );
		setInternalData( ( s ) => ( { ...s, additionalKws: newList } ) );
	}, [ internalData.additionalKws, setKeywords, userData.keywords ] );
	*/

	const submitData = useCallback( async () => {
		setUpdating( true );
		const serpRequestStatus = await makeSerpRequest();
		const settingsResponse = await setSettings( 'serp/urlslab-gsc-countries', { value: [ userInitialKeyword.country.toUpperCase() ] } );

		if ( serpRequestStatus && settingsResponse.ok ) {
			setNextStep();
		}

		setUpdating( false );
	}, [ makeSerpRequest, setNextStep, userInitialKeyword.country ] );

	const textAreaCallback = useCallback( ( textArray ) => {
		setUserInitialKeyword( ( s ) => ( { ...s, keywords: textArray } ) );
		// added temporary while keywords list is disabled
		setKeywords( textArray );
	}, [ setKeywords ] );

	return (
		<div className={ `urlslab-onboarding-content-wrapper large-wrapper fadeInto step-${ activeStep }` }>

			<div className="urlslab-onboarding-content-heading">
				<h1 className="heading-title">{ __( 'What are the search queries you want to rank for?' ) }</h1>
				<p className="heading-description">
					{ __( 'Give more insight to URLsLab plugin on keywords you want your website to rank for. This will help the plugin to get you started with SEO Insights module' ) }
				</p>
			</div>

			<div className="urlslab-onboarding-content-settings">
				<Stack direction="row" flexWrap="wrap">
					<Grid container spacing={ 2 } sx={ { flexGrow: 1 } }>
						<Grid xs={ 12 } md={ 6 }>
							<FormControl sx={ { width: '100%' } }>
								<FormLabel>{ __( 'Search query' ) }</FormLabel>
								{ /*
								<Input
									defaultValue={ userInitialKeyword.keywords }
									onChange={ ( value ) => {
										setUserInitialKeyword( ( s ) => ( { ...s, keywords: value.target.value } ) );
										// added temporary while keywords list is disabled
										setKeywords( value.target.value === '' ? [] : [ value.target.value ] );
									}
									}
								/>
								*/ }
								<TextAreaArray
									initialKeywords={ userData.keywords }
									callback={ ( textArray ) => textAreaCallback( textArray ) }
								/>
							</FormControl>
						</Grid>
						<Grid xs={ 12 } md={ 6 }>
							<FormControl sx={ { width: '100%' } }>
								<FormLabel>{ __( 'Country' ) }</FormLabel>
								<CountrySelect value={ userInitialKeyword.country } onChange={ ( value ) => setUserInitialKeyword( ( s ) => ( { ...s, country: value } ) ) } />
							</FormControl>
						</Grid>
					</Grid>
				</Stack>

				{ /* temporary disabled selection of more keywords
				<Stack sx={ { mt: 2 } }>
					{
						internalData.currentStage === 2 && (
							<DataBox
								title={ internalData.additionalKws?.length > 0 ? __( 'Additional Search queries:' ) : null }
								loadingText={ __( 'Loading additional search queries…' ) }
								loading={ internalData.additionalKws?.length <= 0 }
							>
								{
									internalData.additionalKws?.length > 0 && (
										<List>
											{ internalData.additionalKws.map( ( kw, index ) => {
												return (
													<ListItem key={ kw.query }>
														<Checkbox
															size="sm"
															label={ kw.query }
															onChange={ ( event ) => handleQueryChecked( event.target.checked, index ) }
															overlay
															ellipsis
														/>
													</ListItem>
												);
											} )
											}
										</List>
									)
								}
							</DataBox>
						)
					}
				</Stack>
				*/ }

				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-end">
					{ /* temporary disabled selection of more keywords
					{
						( internalData.currentStage === 0 || internalData.currentStage === 1 ) && (
							<Button
								onClick={ () => {
									makeSerpRequest();
									setInternalData( ( s ) => ( { ...s, currentStage: 2 } ) );
									setKeywords( [ userInitialKeyword.keyword ] );
								} }
								disabled={ internalData.currentStage === 0 }
							>
								{ __( 'Suggest more search queries' ) }
							</Button>
						)
					}
					{
						internalData.currentStage === 2 && (
							<Button
								loading={ updating }
								onClick={ () => submitData() }
								endDecorator={ <SvgIcon name="arrow" /> }
							>
								{ __( 'Apply and next' ) }
							</Button>
						)
					}
					*/ }
					<Stack direction="row" gap={ 1 }>
						<Button
							variant="plain"
							color="neutral"
							onClick={ () => setActiveStep( 'modules' ) }
						>
							{ __( 'Skip' ) }
						</Button>
						<Button
							disabled={ userData.keywords?.length === 0 }
							loading={ updating }
							onClick={ () => submitData() }
							endDecorator={ <SvgIcon name="arrow" /> }
						>
							{ __( 'Apply and next' ) }
						</Button>
					</Stack>

				</div>
			</div>
		</div>
	);
};

const TextAreaArray = React.memo( ( { initialKeywords, callback } ) => {
	const [ textareaKeywords, setTextareaKeywords ] = useState( arrayToTextLines( initialKeywords ) );

	// on textarea change save validated array
	useEffect( () => {
		const textArray = textLinesToArray( textareaKeywords );
		callback( textArray );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ textareaKeywords ] );

	return (
		<Textarea
			value={ textareaKeywords }
			placeholder={ __( 'Keywords' ) }
			minRows={ 5 }
			maxRows={ 5 }
			onChange={ ( event ) => setTextareaKeywords( event.target.value ) }
			required
		/>
	);
} );
export default React.memo( StepChooseKeywords );
