import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';
import { getQueryUrls } from '../../lib/serpQueries';

import SvgIcon from '../../elements/SvgIcon';
import IconButton from '../../elements/IconButton';
import CountrySelect from '../../elements/CountrySelect';
import MultiSelectBox from '../../elements/MultiSelectBox';

import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';
import MuiCheckbox from '@mui/joy/Checkbox';
import MuiIconButton from '@mui/joy/IconButton';
import CircularProgress from '@mui/joy/CircularProgress';

import { delay } from '../../lib/helpers';
import { emptyUrls, preprocessUrls } from '../../lib/serpContentGapHelpers';
import { MainWrapper, SettingsWrapper } from '../styledComponents/gapDetail';
import useSelectRows from '../../hooks/useSelectRows';

const maxGapUrls = 15;
const defaultFetchOptions = {
	query: '',
	urls: { url_0: '' },
	matching_urls: 5,
	max_position: 10,
	compare_domains: false,
	parse_headers: [ 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
	show_keyword_cluster: false,
	country: 'us',
	ngrams: [ 1, 2, 3, 4, 5 ],
	// data for preprocessing
	processedUrls: {},
	forceUrlsProcessing: false,
	processing: false,
};
const parseHeadersValues = {
	title: __( 'Title' ),
	h1: 'H1',
	h2: 'H2',
	h3: 'H3',
	h4: 'H4',
	h5: 'H5',
	h6: 'H6',
	p: __( 'Paragraphs' ),
};

const ngramsValues = [ 1, 2, 3, 4, 5 ];

function GapDetailPanel( { slug } ) {
	const [ loadingUrls, setLoadingUrls ] = useState( false );
	const preprocessController = useRef( null );
	const setSelectedRows = useSelectRows( ( state ) => state.setSelectedRows );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	let fetchOptions = useTablePanels( ( state ) => state.fetchOptions );
	fetchOptions = fetchOptions ? { ...defaultFetchOptions, ...fetchOptions } : defaultFetchOptions;

	const cancelPreprocess = useCallback( () => preprocessController.current ? preprocessController.current.abort() : null, [] );

	const updateFetchOptions = useCallback( ( data ) => {
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...data } );
	}, [ setFetchOptions ] );

	const updateAndProcess = useCallback( ( data ) => {
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...data, forceUrlsProcessing: true, processedUrls: {}, processing: true } );
	}, [ setFetchOptions ] );

	const updateQuery = useCallback( ( query ) => {
		if ( query === '' ) {
			updateFetchOptions( { query, urls: defaultFetchOptions.urls, processedUrls: {} } );
			return false;
		}
		updateFetchOptions( { query } );
	}, [ updateFetchOptions ] );

	const loadUrls = useCallback( async ( ) => {
		setLoadingUrls( true );
		updateFetchOptions( { urls: {} } );
		const queryUrls = await getQueryUrls( { query: fetchOptions.query, country: fetchOptions.country, limit: maxGapUrls } );
		if ( queryUrls ) {
			const indexedUrlsList = {};
			Object.values( queryUrls ).forEach( ( value, index ) => {
				indexedUrlsList[ `url_${ index }` ] = value.url_name;
			} );
			updateAndProcess( { urls: indexedUrlsList } );
		}
		setLoadingUrls( false );
	}, [ fetchOptions.country, fetchOptions.query, updateAndProcess, updateFetchOptions ] );

	const onUrlsChange = useCallback( ( newUrls ) => {
		const urlsCount = Object.keys( fetchOptions.urls ).length;
		const newUrlsCount = Object.keys( newUrls ).length;

		if ( newUrlsCount > urlsCount ) {
			//just added new input, only update, do not run processing
			updateFetchOptions( { urls: newUrls } );
			return;
		}
		updateAndProcess( { urls: newUrls } );
	}, [ fetchOptions.urls, updateAndProcess, updateFetchOptions ] );

	useEffect( () => {
		if ( fetchOptions.forceUrlsProcessing && fetchOptions.query && ! emptyUrls( fetchOptions.urls ) ) {
			cancelPreprocess();
			preprocessController.current = new AbortController();

			const runProcessing = async () => {
				const results = await preprocessUrls( { urls: fetchOptions.urls, parse_headers: fetchOptions.parse_headers, ngrams: fetchOptions.ngrams }, 0, preprocessController.current.signal );
				// if prepare query was cancelled by new one, do nothing
				if ( results !== false ) {
					const indexedUrlsList = {};
					Object.entries( results ).forEach( ( [ key, value ] ) => {
						indexedUrlsList[ key ] = value.url;
					} );
					updateFetchOptions( {
						urls: indexedUrlsList,
						processedUrls: results,
						forceUrlsProcessing: false,
						processing: false,
					} );
					return false;
				}
			};

			runProcessing();
		}
	}, [ fetchOptions.forceUrlsProcessing, fetchOptions.parse_headers, fetchOptions.query, fetchOptions.urls, fetchOptions.ngrams, updateFetchOptions, cancelPreprocess ] );

	// update tables fetchOptions to show table
	useEffect( () => {
		if ( ! fetchOptions.processing && fetchOptions.query && ! emptyUrls( fetchOptions.urls ) ) {
			setSelectedRows( {} );
			let opts = { ...fetchOptions };

			// remove options not related to api fetch
			delete opts.forceUrlsProcessing;
			delete opts.processedUrls;
			delete opts.processing;

			//do not pass empty urls
			opts = { ...opts, urls: Object.values( opts?.urls ).filter( ( url ) => url !== '' ) };

			useTableStore.setState( () => (
				{
					tables: {
						...useTableStore.getState().tables,
						[ slug ]: {
							...useTableStore.getState().tables[ slug ],
							fetchOptions: opts,
							allowCountFetchAbort: true,
							allowTableFetchAbort: true,
						} },
				}
			) );
		}
	}, [ fetchOptions, slug, setSelectedRows ] );

	return (
		<Box sx={ ( theme ) => ( { backgroundColor: theme.vars.palette.common.white, padding: '1em 1.625em', borderBottom: `1px solid ${ theme.vars.palette.divider }` } ) }>

			<MainWrapper>
				<SettingsWrapper>

					<Box>
						<Stack spacing={ 1 }>

							<FormControl >
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
									onChange={ ( event ) => delay( () => updateQuery( event.target.value ), 800 )() }
									onBlur={ ( event ) => event.target.value !== fetchOptions.query ? updateQuery( event.target.value ) : null }
									sx={ ( theme ) => ( {
										width: 250,
										[ theme.breakpoints.between( 'xl', 'xxl' ) ]: {
											width: '100%',
										},
									} ) }
								/>
							</FormControl>

							<FormControl >
								<FormLabel>{ __( 'Country' ) }</FormLabel>
								<CountrySelect
									value={ fetchOptions.country }
									onChange={ ( val ) => updateFetchOptions( { country: val } ) }
									inputStyles={ ( theme ) => ( {
										width: 250,
										[ theme.breakpoints.between( 'xl', 'xxl' ) ]: {
											width: '100%',
										},
									} ) }
								/>
							</FormControl>

							<div className="flex flex-justify-end limit">
								<Button
									disabled={ ! fetchOptions.query }
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
							<FormControl>
								<FormLabel flexNoWrap textNoWrap>
									{ __( 'Parse text from' ) }
									<Tooltip
										title={
											<>
												<strong>{ __( 'How parsing works?' ) }</strong>
												<p>{ __( 'Text elements from specified URLs will be extracted and compared for phrase matching. Checking this box allows for parsing text strictly from headers, i.e. H1 … H5 tags, and TITLE tags. This is a useful option as copywriters often use the most important keywords in titles and headers, thus enabling the identification of keyword frequency based on headings alone.' ) }</p>
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
								</FormLabel>
								<Box>
									<MultiSelectBox
										items={ parseHeadersValues }
										selected={ fetchOptions.parse_headers }
										onChange={ ( value ) => updateAndProcess( { parse_headers: value } ) }
										fitItems
									/>
								</Box>

							</FormControl>
							<FormControl>
								<FormLabel flexNoWrap textNoWrap>
									{ __( 'Word combinations' ) }
									<Tooltip
										title={ __( 'The "n-grams" field specifies the maximum number of words that are grouped together to form a compound keyword for search queries. For instance: 1-gram (unigram) consists of a single word (e.g., "apple"), a 2-gram (bigram) incorporates a pair of words (e.g., "fresh apple"), etc.' ) }
										placement="bottom"
										sx={ { maxWidth: '45rem' } }
									>
										<Box>
											<IconButton className="ml-s info-grey">
												<SvgIcon name="info" />
											</IconButton>
										</Box>
									</Tooltip>
								</FormLabel>
								<Box>
									<MultiSelectBox
										items={ ngramsValues }
										selected={ fetchOptions.ngrams }
										onChange={ ( value ) => updateAndProcess( { ngrams: value } ) }
										fitItems
										fitWidth
									/>
								</Box>

							</FormControl>
							<FormControl orientation="horizontal">
								<MuiCheckbox
									size="sm"
									checked={ fetchOptions.show_keyword_cluster }
									onChange={ ( event ) => updateFetchOptions( { show_keyword_cluster: event.target.checked } ) }
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
									onChange={ ( event ) => updateFetchOptions( { compare_domains: event.target.checked } ) }
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

							{ ( fetchOptions.show_keyword_cluster ) &&
								<Stack direction="row" spacing={ 1 } >
									<FormControl sx={ { marginBottom: 1, width: '50%' } }>
										<FormLabel>{ __( 'Clustering level' ) }</FormLabel>
										<Input
											type="number"
											defaultValue={ fetchOptions.matching_urls }
											// simulate our liveUpdate, until custom mui Input component isn't available
											onChange={ ( event ) => delay( () => updateFetchOptions( { matching_urls: event.target.value } ), 800 )() }
											onBlur={ ( event ) => event.target.value !== fetchOptions.matching_urls ? updateFetchOptions( { matching_urls: event.target.value } ) : null }
											sx={ { width: 120 } }
										/>
									</FormControl>
									<FormControl sx={ { marginBottom: 1, width: '50%' } }>
										<FormLabel>{ __( 'Max position' ) }</FormLabel>
										<Input
											type="number"
											defaultValue={ fetchOptions.max_position }
											// simulate our liveUpdate, until custom mui Input component isn't available
											onChange={ ( event ) => delay( () => updateFetchOptions( { max_position: event.target.value } ), 800 )() }
											onBlur={ ( event ) => event.target.value !== fetchOptions.max_position ? updateFetchOptions( { max_position: event.target.value } ) : null }
											sx={ { width: 120 } }
										/>
									</FormControl>
								</Stack>
							}
						</Stack>
					</Box>

				</SettingsWrapper>

				{ ! loadingUrls
					? <GapUrlsManager urls={ fetchOptions.urls } onChange={ ( newUrls ) => onUrlsChange( newUrls ) } />
					: <Box className="limit flex flex-align-center flex-justify-center">
						<CircularProgress />
					</Box>
				}

			</MainWrapper>

		</Box>
	);
}

const GapUrlsManager = memo( ( { urls, onChange } ) => {
	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );

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
		const processedUrls = fetchOptions?.processedUrls ? fetchOptions.processedUrls : {};
		const processing = fetchOptions?.processing ? fetchOptions.processing : false;
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
	}, [ fetchOptions.processedUrls, fetchOptions.processing, removeUrl, updateUrl, urls ] );

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
