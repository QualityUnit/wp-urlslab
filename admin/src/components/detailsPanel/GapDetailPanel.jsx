import { memo, useCallback, useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';
import { getQueryUrls } from '../../lib/serpQueries';

import SvgIcon from '../../elements/SvgIcon';
import IconButton from '../../elements/IconButton';
import CountrySelect from '../../elements/CountrySelect';

import { Box, FormControl, FormLabel, Input, Stack, Tooltip, Checkbox as MuiCheckbox, IconButton as MuiIconButton, CircularProgress } from '@mui/joy';
import { delay } from '../../lib/helpers';
import { MainWrapper, SettingsWrapper } from '../styledComponents/gapDetail';

const maxGapUrls = 15;

function GapDetailPanel( { slug } ) {
	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const [ loadingUrls, setLoadingUrls ] = useState( false );

	// handle updating of fetchOptions
	const updateFetchOptions = useCallback( ( data ) => {
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...data } );
	}, [ setFetchOptions ] );

	// handle updating of fetchOptions and append flag to run urls preprocess
	const updateFetchOptionsAndRunProcessing = useCallback( ( data ) => {
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...data, forceUrlsProcessing: true, processedUrls: {} } );
	}, [ setFetchOptions ] );

	const loadUrls = useCallback( async ( ) => {
		setLoadingUrls( true );
		const urls = await getQueryUrls( { query: fetchOptions.query, country: fetchOptions.country, limit: maxGapUrls } );
		if ( urls ) {
			let filteredUrlFields = { };
			Object.values( urls ).map( ( url, index ) => {
				return filteredUrlFields = { ...filteredUrlFields, [ `url_${ index }` ]: url.url_name };
			} );
			updateFetchOptionsAndRunProcessing( { urls: filteredUrlFields } );
		}
		setLoadingUrls( false );
	}, [ fetchOptions, updateFetchOptionsAndRunProcessing ] );

	const onUrlsChange = useCallback( ( newUrls ) => {
		const urlsCount = Object.keys( fetchOptions.urls ).length;
		const newUrlsCount = Object.keys( newUrls ).length;

		if ( newUrlsCount > urlsCount ) {
			//just added new input, only update, do not run processing
			updateFetchOptions( { urls: newUrls } );
			return;
		}

		updateFetchOptionsAndRunProcessing( { urls: newUrls } );
	}, [ fetchOptions.urls, updateFetchOptions, updateFetchOptionsAndRunProcessing ] );

	// fill fetch options on first load, when data was not provided, ie. from Queries table
	useEffect( () => {
		if ( Object.keys( fetchOptions ).length === 0 ) {
			setFetchOptions( {
				urls: { url_0: '' },
				matching_urls: 5,
				max_position: 10,
				compare_domains: false,
				parse_headers: false,
				show_keyword_cluster: false,
				country: 'us',
				processedUrls: {},
			} );
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	// update tables fetchOptions store with current data
	useEffect( () => {
		if ( Object.keys( fetchOptions ).length ) {
			let opts = { ...fetchOptions };
			// delete fetch options not related for table query
			delete opts.processedUrls;
			delete opts.forceUrlsProcessing;

			opts = { ...opts, urls: Object.values( opts?.urls ).filter( ( url ) => url !== '' ) };

			useTableStore.setState( () => (
				{
					tables: {
						...useTableStore.getState().tables,
						[ slug ]: {
							...useTableStore.getState().tables[ slug ],
							fetchOptions: opts,
						} },
				}
			) );
		}
	}, [ fetchOptions, slug ] );

	return (
		<Box sx={ ( theme ) => ( { backgroundColor: theme.vars.palette.common.white, padding: '1em 1.625em', borderBottom: `1px solid ${ theme.vars.palette.divider }` } ) }>

			{ ( fetchOptions && Object.keys( fetchOptions ).length ) &&
				<MainWrapper>
					<SettingsWrapper>

						<Box>
							<Stack spacing={ 1 }>

								<FormControl orientation="horizontal" sx={ { justifyContent: 'flex-end' } }>
									<FormLabel flexNoWrap textNoWrap>
										{ __( 'Query' ) }
										<Tooltip
											//title={ __( '' ) }
											placement="bottom"
										>
											<Box>
												<IconButton className="ml-s info-grey">
													<SvgIcon name="info" />
												</IconButton>
											</Box>
										</Tooltip>
									</FormLabel>
									<Input
										key={ fetchOptions.query }
										defaultValue={ fetchOptions.query }
										// simulate our liveUpdate, until custom mui Input component isn't available
										onChange={ ( event ) => delay( () => updateFetchOptionsAndRunProcessing( { query: event.target.value } ), 800 )() }
										onBlur={ ( event ) => event.target.value !== fetchOptions.query ? updateFetchOptionsAndRunProcessing( { query: event.target.value } ) : null }
										sx={ { width: 250 } }
									/>
								</FormControl>

								<FormControl orientation="horizontal" sx={ { justifyContent: 'flex-end' } }>
									<FormLabel>{ __( 'Country' ) }</FormLabel>
									<CountrySelect
										value={ fetchOptions.country }
										onChange={ ( val ) => updateFetchOptionsAndRunProcessing( { country: val } ) }
										inputStyles={ { width: 250 } }
									/>
								</FormControl>

								<div className="flex flex-justify-end limit">
									<Button
										disabled={ ! fetchOptions?.query }
										onClick={ loadUrls }
										loading={ loadingUrls }
										wider
									>
										{ __( 'Load URLs' ) }
									</Button>
								</div>
							</Stack>
						</Box>

						<Box>
							<Stack spacing={ 1 }>
								<FormControl orientation="horizontal" >
									<MuiCheckbox
										size="sm"
										checked={ fetchOptions.show_keyword_cluster }
										onChange={ ( event ) => updateFetchOptionsAndRunProcessing( { show_keyword_cluster: event.target.checked } ) }
										label={ __( 'Show just queries from Keyword Cluster' ) }
										sx={ ( theme ) => ( { color: theme.palette.urlslabColors.greyDarker } ) }
										textNoWrap
									/>
									<Tooltip
										title={
											<>
												<strong>{ __( 'What is keyword cluster?' ) }</strong>
												<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.' ) }</p>
												<p>{ __( 'Based on entered query we identify all other best matching keywords from the cluster.' ) }</p>
												<p>{ __( 'If this option is selected, keywords included in page, but not found in SERP data will not be included in the table.' ) }</p>
											</>
										}
										placement="bottom"
										sx={ { maxWidth: '45rem' } }
									>
										<Box>
											<IconButton className="ml-s info-grey">
												<SvgIcon name="info" />
											</IconButton>
										</Box>
									</Tooltip>
								</FormControl>

								<FormControl orientation="horizontal" >
									<MuiCheckbox
										size="sm"
										checked={ fetchOptions.compare_domains }
										onChange={ ( event ) => updateFetchOptionsAndRunProcessing( { compare_domains: event.target.checked } ) }
										label={ __( 'Compare domains of URLs' ) }
										sx={ ( theme ) => ( { color: theme.palette.urlslabColors.greyDarker } ) }
										textNoWrap
									/>
									<Tooltip
										title={
											<>
												<strong>{ __( 'How does domain comparison work?' ) }</strong>
												<p>{ __( 'From given URLs we extract domain name and compare from those domains all queries where given domain rank in top positions on Google. Evaluated are just processed queries, more queries your process, better results you get (e.g. 10k queries recommended). If we discover, that for given domain ranks better other URL of the domain (for specific query), we will show notification about it. This could help you to identify other URLs of domain, which rank better as select URL. This information could be helpful if you are building content clusters to identify duplicate pages with same intent or new opportunities found in competitor website. If you select this option, computation will take much longer as significantly more queries needs to be considered.' ) }</p>
											</>
										}
										placement="bottom"
										sx={ { maxWidth: '45rem' } }
									>
										<Box>
											<IconButton className="ml-s info-grey">
												<SvgIcon name="info" />
											</IconButton>
										</Box>
									</Tooltip>
								</FormControl>
								<FormControl orientation="horizontal" >
									<MuiCheckbox
										size="sm"
										checked={ fetchOptions.parse_headers }
										onChange={ ( event ) => updateFetchOptionsAndRunProcessing( { parse_headers: event.target.checked } ) }
										label={ __( 'Parse just headers (TITLE, H1…H6)' ) }
										sx={ ( theme ) => ( { color: theme.palette.urlslabColors.greyDarker } ) }
										textNoWrap
									/>
									<Tooltip
										title={
											<>
												<strong>{ __( 'How parsing works?' ) }</strong>
												<p>{ __( 'Text elements from specified URLs will be extracted and compared for phrase matching. Checking this box allows for parsing text strictly from headers, i.e. H1 … H6 tags, and TITLE tags. This is a useful option as copywriters often use the most important keywords in titles and headers, thus enabling the identification of keyword frequency based on headings alone.' ) }</p>
											</>
										}
										placement="bottom"
										sx={ { maxWidth: '45rem' } }
									>
										<Box>
											<IconButton className="ml-s info-grey">
												<SvgIcon name="info" />
											</IconButton>
										</Box>
									</Tooltip>
								</FormControl>

								{ ( fetchOptions?.query && fetchOptions.show_keyword_cluster ) &&
								<Stack direction="row" spacing={ 1 } >
									<FormControl sx={ { marginBottom: 1, width: '50%' } }>
										<FormLabel>{ __( 'Clustering level' ) }</FormLabel>
										<Input
											type="number"
											defaultValue={ fetchOptions.matching_urls }
											// simulate our liveUpdate, until custom mui Input component isn't available
											onChange={ ( event ) => delay( () => updateFetchOptionsAndRunProcessing( { matching_urls: event.target.value } ), 800 )() }
											onBlur={ ( event ) => event.target.value !== fetchOptions.matching_urls ? updateFetchOptionsAndRunProcessing( { matching_urls: event.target.value } ) : null }
											sx={ { width: 120 } }
										/>
									</FormControl>
									<FormControl sx={ { marginBottom: 1, width: '50%' } }>
										<FormLabel>{ __( 'Max position' ) }</FormLabel>
										<Input
											type="number"
											defaultValue={ fetchOptions.max_position }
											// simulate our liveUpdate, until custom mui Input component isn't available
											onChange={ ( event ) => delay( () => updateFetchOptionsAndRunProcessing( { max_position: event.target.value } ), 800 )() }
											onBlur={ ( event ) => event.target.value !== fetchOptions.max_position ? updateFetchOptionsAndRunProcessing( { max_position: event.target.value } ) : null }
											sx={ { width: 120 } }
										/>
									</FormControl>
								</Stack>
								}
							</Stack>
						</Box>

					</SettingsWrapper>

					<GapUrlsManager urls={ fetchOptions.urls } processing={ fetchOptions.processing } processedUrls={ fetchOptions.processedUrls } onChange={ ( newUrls ) => onUrlsChange( newUrls ) } />

				</MainWrapper>
			}
		</Box>
	);
}

const GapUrlsManager = memo( ( { urls, processing, processedUrls, onChange } ) => {
	const isMaxUrls = maxGapUrls <= Object.keys( urls ).length;
	const removeUrl = useCallback( ( urlKey ) => {
		const newUrls = {};
		let customIndex = 0;
		Object.entries( urls ).forEach( ( [ key, url ] ) => {
			if ( urlKey !== key ) {
				newUrls[ `url_${ customIndex }` ] = url;
				customIndex++;
			}
		} );
		onChange( newUrls );
	}, [ onChange, urls ] );

	const updateUrl = useCallback( ( newValue, urlKey ) => {
		const newUrls = { ...urls };
		newUrls[ urlKey ] = newValue;
		onChange( newUrls );
	}, [ onChange, urls ] );

	const addNewInput = useCallback( () => {
		const newUrl = { [ `url_${ Object.keys( urls ).length }` ]: '' };
		onChange( { ...urls, ...newUrl } );
	}, [ onChange, urls ] );

	const renderUrlOption = useCallback( ( optionData ) => {
		return Object.entries( optionData ).map( ( [ key, url ] ) => {
			const processedUrlData = processedUrls[ key ];
			const isError = processedUrlData && processedUrlData.status === 'error';
			const title = `${ __( 'URL' ) } ${ +key.replace( 'url_', '' ) + 1 }`;
			return (
				<FormControl
					key={ key + url }
					orientation="horizontal"
					sx={ ( theme ) => ( {
						mb: 1, pr: 2, justifyContent: 'flex-end',
						width: 340,
						[ theme.breakpoints.down( 'xxxl' ) ]: {
							width: '50%',
						},
						[ theme.breakpoints.down( 'xl' ) ]: {
							width: '33.3%',
						},
						[ theme.breakpoints.down( 'lg' ) ]: {
							width: '50%',
						},
					} ) }
				>
					<FormLabel
						textNoWrap
						sx={ { width: 65 } }
					>{ title }</FormLabel>
					<Tooltip
						color={ isError ? 'danger' : 'neutral' }
						title={
							( processedUrlData && processedUrlData.status === 'error' )
								? <>{ processedUrlData.message }<br />{ url }</>
								: url
						}
					>
						<Input
							className="limit"
							defaultValue={ url }
							// simulate our liveUpdate, until custom mui Input component isn't available
							onChange={ ( event ) => delay( () => updateUrl( event.target.value, key ), 800 )() }
							onBlur={ ( event ) => event.target.value !== url ? updateUrl( event.target.value, key ) : null }
							startDecorator={
								<>
									{ processing &&
									<MuiIconButton
										size="xs"
										variant="soft"
										color="neutral"
										sx={ { pointerEvents: 'none' } }
									>
										<CircularProgress size="sm" sx={ { '--CircularProgress-size': '17px', '--CircularProgress-thickness': '2px' } } />
									</MuiIconButton>
									}

									{ ( ! processing && processedUrlData && processedUrlData.status === 'error' ) &&
									<MuiIconButton
										size="xs"
										variant="soft"
										color="danger"
										sx={ { pointerEvents: 'none' } }
									>
										<SvgIcon name="disable" />
									</MuiIconButton>
									}
									{ ( ! processing && processedUrlData && processedUrlData.status === 'ok' ) &&
									<MuiIconButton
										size="xs"
										variant="soft"
										color="success"
										sx={ { pointerEvents: 'none' } }
									>
										<SvgIcon name="checkmark-circle" />
									</MuiIconButton>
									}
								</>
							}
						/>
					</Tooltip>
					{
						Object.keys( urls ).length > 1 &&
						<IconButton className="ml-s info-grey-darker" onClick={ () => removeUrl( key ) }>
							<Tooltip title={
								// translators: %s is generated text, do not change it
								__( 'Remove %s' ).replace( '%s', title )
							} >
								<Box display="flex" alignItems="center">
									<SvgIcon name="minus-circle" />
								</Box>
							</Tooltip>
						</IconButton>
					}
				</FormControl>
			);
		} );
	}, [ processedUrls, processing, urls, updateUrl, removeUrl ] );

	return (
		<Box className="limit">
			<Stack direction="row" flexWrap="wrap">
				{ Object.keys( urls ).length > 0 &&
					renderUrlOption( urls )
				}
			</Stack>

			<Box sx={ { mt: 2 } }>
				<Button

					variant="plain"
					disabled={ isMaxUrls }
					onClick={ addNewInput }
					startDecorator={ ! isMaxUrls && <SvgIcon name="plus" /> }
					sx={ ( theme ) => ( { '--Icon-fontSize': theme.vars.fontSize.sm } ) }
				>
					{ isMaxUrls
						? (
							// translators: %i is generated number, do not change it
							__( 'Max %i URLs allowed' ).replace( '%i', maxGapUrls )
						)
						: __( 'Add another URL' )
					}
				</Button>
			</Box>

		</Box>
	);
} );

export default memo( GapDetailPanel );
