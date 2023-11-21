import { createContext, memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
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

import { emptyUrls, preprocessUrls } from '../../lib/serpContentGapHelpers';
import { MainWrapper, SettingsWrapper } from '../styledComponents/gapDetail';

const maxGapUrls = 15;
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

// option keys that trigger necessary urls preprocess on next options submit
const processingTriggers = [ 'ngrams', 'parse_headers', 'urls' ];

const ContentGapContext = createContext( {} );

function GapDetailPanel() {
	const preprocessController = useRef( null );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const setContentGapOptions = useTablePanels( ( state ) => state.setContentGapOptions );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );

	const [ loadingUrls, setLoadingUrls ] = useState( false );

	// handle condition if submit button should be visible after change of options
	const showSubmitButton = useCallback( () => {
		return ! loadingUrls && contentGapOptions.allowUpdateResults && contentGapOptions.query && ! emptyUrls( contentGapOptions.urls );
	}, [ contentGapOptions.allowUpdateResults, loadingUrls, contentGapOptions.query, contentGapOptions.urls ] );

	// handle update of options and decide if is necesarry run processing before next table update
	const updateOptions = useCallback( ( option ) => {
		let willProcessing = false;
		Object.keys( option ).forEach( ( optionKey ) => {
			if ( processingTriggers.includes( optionKey ) ) {
				willProcessing = true;
			}
		} );
		setContentGapOptions( { ...option, allowUpdateResults: true, willProcessing } );
	}, [ setContentGapOptions ] );

	// update finally prepared options to fetchOptions and render table with new data
	const updateFetchOptions = useCallback( () => {
		let opts = { ...contentGapOptions };

		// remove options not related to api fetch
		delete opts.willProcessing;
		delete opts.allowUpdateResults;
		delete opts.forceUrlsProcessing;
		delete opts.processedUrls;
		delete opts.processingUrls;

		//do not pass empty urls
		opts = { ...opts, urls: Object.values( opts?.urls ).filter( ( url ) => url !== '' ) };
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...opts } );
	}, [ contentGapOptions, setFetchOptions ] );

	const runProcessing = useCallback( async () => {
		if ( preprocessController.current ) {
			preprocessController.current.abort();
		}
		preprocessController.current = new AbortController();
		setContentGapOptions( { forceUrlsProcessing: false, processedUrls: {}, processingUrls: true, allowUpdateResults: false, willProcessing: false } );

		const results = await preprocessUrls( {
			urls: contentGapOptions.urls,
			parse_headers: contentGapOptions.parse_headers,
			ngrams: contentGapOptions.ngrams,
		}, 0, preprocessController.current.signal );

		// if prepare query was cancelled by new one, do nothing
		if ( results !== false ) {
			const indexedUrlsList = {};
			Object.entries( results ).forEach( ( [ key, value ] ) => {
				indexedUrlsList[ key ] = value.url;
			} );

			setContentGapOptions( {
				urls: indexedUrlsList,
				processedUrls: results,
				processingUrls: false,
			} );

			updateFetchOptions();
		}
	}, [ contentGapOptions, setContentGapOptions, updateFetchOptions ] );

	const runUpdateResults = useCallback( () => {
		// was updated option used in 'prepare' query, run processing and then update table
		if ( contentGapOptions.willProcessing ) {
			runProcessing();
			return;
		}

		// simply update only table
		setContentGapOptions( { allowUpdateResults: false, willProcessing: false } );
		updateFetchOptions();
	}, [ contentGapOptions.willProcessing, runProcessing, setContentGapOptions, updateFetchOptions ] );

	const loadUrls = useCallback( async ( ) => {
		setLoadingUrls( true );
		const queryUrls = await getQueryUrls( { query: contentGapOptions.query, country: contentGapOptions.country, limit: maxGapUrls } );

		if ( queryUrls ) {
			const indexedUrlsList = {};
			Object.values( queryUrls ).forEach( ( value, index ) => {
				indexedUrlsList[ `url_${ index }` ] = value.url_name;
			} );
			setContentGapOptions( { urls: indexedUrlsList, forceUrlsProcessing: true } );
		}
		setLoadingUrls( false );
	}, [ contentGapOptions.country, contentGapOptions.query, setContentGapOptions ] );

	useEffect( () => {
		if ( contentGapOptions.forceUrlsProcessing ) {
			runProcessing();
		}
	}, [ contentGapOptions.forceUrlsProcessing, runProcessing ] );

	return (
		<ContentGapContext.Provider value={ { contentGapOptions, updateOptions } }>
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
										//key={ contentGapOptions.query }
										value={ contentGapOptions.query }
										onChange={ ( event ) => updateOptions( { query: event.target.value } ) }
										// simulate our liveUpdate, until custom mui Input component isn't available
										//onChange={ ( event ) => delay( () => updateOptions( { query: event.target.value } ), 800 )() }
										//onBlur={ ( event ) => event.target.value !== contentGapOptions.query ? updateOptions( event.target.value ) : null }
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
										key={ contentGapOptions.country }
										value={ contentGapOptions.country }
										onChange={ ( val ) => updateOptions( { country: val } ) }
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
										variant="soft"
										disabled={ ! contentGapOptions.query }
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
											selected={ contentGapOptions.parse_headers }
											onChange={ ( value ) => updateOptions( { parse_headers: value } ) }
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
											selected={ contentGapOptions.ngrams }
											onChange={ ( value ) => updateOptions( { ngrams: value } ) }
											fitItems
											fitWidth
										/>
									</Box>

								</FormControl>
								<FormControl orientation="horizontal">
									<MuiCheckbox
										size="sm"
										checked={ contentGapOptions.show_keyword_cluster }
										onChange={ ( event ) => updateOptions( { show_keyword_cluster: event.target.checked } ) }
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
										checked={ contentGapOptions.compare_domains }
										onChange={ ( event ) => updateOptions( { compare_domains: event.target.checked } ) }
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

								{ ( contentGapOptions.show_keyword_cluster ) &&
									<Stack direction="row" spacing={ 1 } >
										<FormControl sx={ { marginBottom: 1 } }>
											<FormLabel>{ __( 'Clustering level' ) }</FormLabel>
											<Input
												type="number"
												defaultValue={ contentGapOptions.matching_urls }
												onChange={ ( event ) => updateOptions( { matching_urls: event.target.value } ) }
												// simulate our liveUpdate, until custom mui Input component isn't available
												//onChange={ ( event ) => delay( () => setLupdateOptionsocalOptions( { matching_urls: event.target.value } ), 800 )() }
												//onBlur={ ( event ) => event.target.value !== contentGapOptions.matching_urls ? updateOptions( { matching_urls: event.target.value } ) : null }
												sx={ { width: 160 } }
											/>
										</FormControl>
										<FormControl sx={ { marginBottom: 1 } }>
											<FormLabel>{ __( 'Max position' ) }</FormLabel>
											<Input
												type="number"
												defaultValue={ contentGapOptions.max_position }
												onChange={ ( event ) => updateOptions( { max_position: event.target.value } ) }
												// simulate our liveUpdate, until custom mui Input component isn't available
												//onChange={ ( event ) => delay( () => updateOptions( { max_position: event.target.value } ), 800 )() }
												//onBlur={ ( event ) => event.target.value !== contentGapOptions.max_position ? updateOptions( { max_position: event.target.value } ) : null }
												sx={ { width: 160 } }
											/>
										</FormControl>
									</Stack>
								}
							</Stack>
						</Box>

					</SettingsWrapper>

					<Box className="limit flex">

						{ ! loadingUrls
							? <GapUrlsManager urls={ contentGapOptions.urls } onChange={ ( newUrls ) => updateOptions( { urls: newUrls } ) } />
							: <Box className="limit flex flex-align-center flex-justify-center">
								<CircularProgress />
							</Box>
						}

					</Box>

				</MainWrapper>
				{ showSubmitButton() &&
				<Box display="flex" sx={ { paddingTop: '1em' } }>
					<Button
						disabled={ false }
						onClick={ runUpdateResults }
						wider
					>
						{ __( 'Update Results' ) }
					</Button>
				</Box>
				}
			</Box>
		</ContentGapContext.Provider>
	);
}

const GapUrlsManager = memo( () => {
	const { contentGapOptions, updateOptions } = useContext( ContentGapContext );
	const isMaxUrls = maxGapUrls <= Object.keys( contentGapOptions.urls ).length;

	const addNewInput = useCallback( () => {
		const newUrl = { [ `url_${ Object.keys( contentGapOptions.urls ).length }` ]: '' };
		updateOptions( { urls: { ...contentGapOptions.urls, ...newUrl } } );
	}, [ contentGapOptions.urls, updateOptions ] );

	return (
		<Box className="limit">
			<Stack direction="row" flexWrap="wrap">

				{ Object.keys( contentGapOptions.urls ).length > 0 &&
					<>
						{
							Object.entries( contentGapOptions.urls ).map( ( [ key, url ] ) => (
								<ColumnWrapper key={
									// make sure to rerender inputs after change of their count, ie. after remove
									`${ key }-${ Object.keys( contentGapOptions.urls ).length }`
								}>
									<UrlOption index={ key } url={ url } />
								</ColumnWrapper>
							) )
						}
					</>
				}
				<ColumnWrapper>
					<Button
						color="neutral"
						variant="soft"
						disabled={ isMaxUrls }
						onClick={ addNewInput }
						startDecorator={ ! isMaxUrls && <SvgIcon name="plus" /> }
						sx={ ( theme ) => ( {
							width: '100%',
							'--Icon-fontSize': theme.vars.fontSize.sm,
						} ) }
					>
						{ isMaxUrls
							? (
							// translators: %i is generated number, do not change it
								__( 'Max %i URLs allowed' ).replace( '%i', maxGapUrls )
							)
							: __( 'Add another URL' )
						}
					</Button>
				</ColumnWrapper>
			</Stack>
		</Box>
	);
} );

const UrlOption = memo( ( { index, url } ) => {
	const { contentGapOptions, updateOptions } = useContext( ContentGapContext );
	const processedUrls = contentGapOptions.processedUrls;
	const processingUrls = contentGapOptions.processingUrls;
	const urls = contentGapOptions.urls;

	const processedUrlData = processedUrls[ index ];
	const isError = processedUrlData && processedUrlData.status === 'error';
	const title = `${ __( 'URL' ) } ${ +index.replace( 'url_', '' ) + 1 }`;

	const removeUrl = useCallback( ( urlKey ) => {
		const newUrls = {};
		const newProcessedUrls = {};
		let customIndex = 0;
		Object.entries( urls ).forEach( ( [ key, value ] ) => {
			if ( urlKey !== key ) {
				newUrls[ `url_${ customIndex }` ] = value;
				customIndex++;
			}
		} );
		customIndex = 0;
		Object.entries( processedUrls ).forEach( ( [ key, value ] ) => {
			if ( urlKey !== key ) {
				newProcessedUrls[ `url_${ customIndex }` ] = value;
				customIndex++;
			}
		} );
		updateOptions( { urls: newUrls, processedUrls: newProcessedUrls } );
	}, [ processedUrls, updateOptions, urls ] );

	const updateUrl = useCallback( ( newValue, urlKey ) => {
		const newUrls = { ...urls };
		newUrls[ urlKey ] = newValue;
		updateOptions( { urls: newUrls } );
	}, [ updateOptions, urls ] );

	return (
		<FormControl
			orientation="horizontal"
			sx={ { justifyContent: 'flex-end' } }
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
					onChange={ ( event ) => updateUrl( event.target.value, index ) }
					// simulate our liveUpdate, until custom mui Input component isn't available
					//onChange={ ( event ) => delay( () => updateUrl( event.target.value, key ), 800 )() }
					//onBlur={ ( event ) => event.target.value !== url ? updateUrl( event.target.value, key ) : null }
					startDecorator={
						<>
							{ processingUrls &&
								<MuiIconButton
									size="xs"
									variant="soft"
									color="neutral"
									sx={ { pointerEvents: 'none' } }
								>
									<CircularProgress size="sm" sx={ { '--CircularProgress-size': '17px', '--CircularProgress-thickness': '2px' } } />
								</MuiIconButton>
							}

							{ ( ! processingUrls && processedUrlData && processedUrlData.status === 'error' ) &&
								<MuiIconButton
									size="xs"
									variant="soft"
									color="danger"
									sx={ { pointerEvents: 'none' } }
								>
									<SvgIcon name="disable" />
								</MuiIconButton>
							}
							{ ( ! processingUrls && processedUrlData && processedUrlData.status === 'ok' ) &&
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
					<IconButton className="ml-s info-grey-darker" onClick={ () => removeUrl( index ) }>
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

const ColumnWrapper = memo( ( { children } ) => (
	<Box sx={ ( theme ) => ( {
		mb: 1, pr: 2,
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
	} ) }>{ children }</Box>
) );

export default memo( GapDetailPanel );
