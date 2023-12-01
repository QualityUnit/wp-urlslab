import React, { useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '@mui/joy/Button';

import useOnboarding from '../../hooks/useOnboarding';

import SvgIcon from '../../elements/SvgIcon';
import Stack from '@mui/joy/Stack';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import CountrySelect from '../../elements/CountrySelect';
import { extractInitialCountry } from '../../lib/helpers';
import Grid from '@mui/joy/Grid';
import DataBox from '../../elements/DataBox';
import { postFetch } from '../../api/fetching';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';

const StepPlanChoice = () => {
	const { __ } = useI18n();
	const { activeStep, setKeywords, userData } = useOnboarding();
	const [ userInitialKeyword, setUserInitialKeyword ] = useState( {
		country: extractInitialCountry(),
		keyword: '',
	} );
	const [ internalData, setInternalData ] = useState( {
		additionalKws: [],
		currentStage: 0,
	} );

	useEffect( () => {
		if ( userInitialKeyword.keyword !== '' ) {
			setInternalData( { ...internalData, currentStage: 1 } );
		} else {
			setInternalData( { ...internalData, currentStage: 0 } );
		}
	}, [ userInitialKeyword ] );

	const makeSerpRequest = async () => {
		const response = await postFetch( `serp-queries/create`, {
			query: userInitialKeyword.keyword,
			serp_original_data: true,
		} );
		if ( response.ok ) {
			const data = await response.json();
			const additionalKws = data.original_data.related_searches.map( ( q ) => {
				return { query: q.query, checked: false };
			} );
			setInternalData( { currentStage: 2, additionalKws } );
		}
	};

	const handleQueryChecked = ( checked, index ) => {
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
		setInternalData( { ...internalData, additionalKws: newList } );
	};

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
								<FormLabel>{ __( 'Main search query' ) }</FormLabel>
								<Input
									defaultValue={ userInitialKeyword.keyword }
									onChange={ ( value ) =>
										setUserInitialKeyword( { ...userInitialKeyword, keyword: value.target.value } )
									}
								/>
							</FormControl>
						</Grid>
						<Grid xs={ 12 } md={ 6 }>
							<FormControl sx={ { width: '100%' } }>
								<FormLabel>{ __( 'Country' ) }</FormLabel>
								<CountrySelect value={ userInitialKeyword.country } onChange={ ( value ) => setUserInitialKeyword( { ...userInitialKeyword, country: value } ) } />
							</FormControl>
						</Grid>
					</Grid>
				</Stack>
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
				<div className="urlslab-onboarding-content-settings-footer flex flex-align-center flex-justify-end">
					{
						( internalData.currentStage === 0 || internalData.currentStage === 1 ) && (
							<Button
								onClick={ () => {
									makeSerpRequest();
									setInternalData( { ...internalData, currentStage: 2 } );
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
								onClick={ () => {} }
								endDecorator={ <SvgIcon name="arrow" /> }
							>
								{ __( 'Apply and next' ) }
							</Button>
						)
					}
				</div>
			</div>
		</div>
	);
};

export default React.memo( StepPlanChoice );
