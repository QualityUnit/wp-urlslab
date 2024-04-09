import { memo, useCallback, useContext } from 'react';
import { __ } from '@wordpress/i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../../hooks/useTablePanels';
import { getQueryUrls } from '../../../lib/serpQueries';

import SvgIcon from '../../../elements/SvgIcon';
import IconButton from '../../../elements/IconButton';
import CountrySelect from '../../../elements/CountrySelect';
import MultiSelectBox from '../../../elements/MultiSelectBox';

import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Tooltip from '@mui/joy/Tooltip';
import MuiCheckbox from '@mui/joy/Checkbox';

import { SettingsWrapper } from '../../styledComponents/gapDetail';
import { ContentGapContext, maxGapUrls, ngramsValues, parseHeadersValues } from '../GapDetailPanel';

function GapDetailMainSettings() {
	const { loadingUrls, setLoadingUrls, updateOptions } = useContext( ContentGapContext );
	const contentGapOptions = useTablePanels( ( state ) => state.contentGapOptions );
	const setContentGapOptions = useTablePanels( ( state ) => state.setContentGapOptions );

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
	}, [ contentGapOptions.country, contentGapOptions.query, setContentGapOptions, setLoadingUrls ] );

	return (
		<SettingsWrapper>

			<Box>
				<Stack spacing={ 1 }>

					<FormControl >
						<FormLabel flexNoWrap textNoWrap>
							{ __( 'Query', 'urlslab' ) }
							<Tooltip
								//title={ __( '' , 'urlslab' ) }
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
						<FormLabel>{ __( 'Country', 'urlslab' ) }</FormLabel>
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
							{ __( 'Load URLs', 'urlslab' ) }
						</Button>
					</div>
				</Stack>
			</Box>

			<Box>
				<Stack spacing={ 1 }>
					<FormControl>
						<FormLabel flexNoWrap textNoWrap>
							{ __( 'Parse text from', 'urlslab' ) }
							<Tooltip
								title={
									<>
										<strong>{ __( 'How parsing works?', 'urlslab' ) }</strong>
										<p>{ __( 'Text elements from specified URLs will be extracted and compared for phrase matching. Checking this box allows for parsing text strictly from headers, i.e. H1 … H5 tags, and TITLE tags. This is a useful option as copywriters often use the most important keywords in titles and headers, thus enabling the identification of keyword frequency based on headings alone.', 'urlslab' ) }</p>
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
							{ __( 'Word combinations', 'urlslab' ) }
							<Tooltip
								title={ __( 'The "n-grams" field specifies the maximum number of words that are grouped together to form a compound keyword for search queries. For instance: 1-gram (unigram) consists of a single word (e.g., "apple"), a 2-gram (bigram) incorporates a pair of words (e.g., "fresh apple"), etc.', 'urlslab' ) }
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
							label={ __( 'Show just queries from Keyword Cluster', 'urlslab' ) }
							sx={ ( theme ) => ( { color: theme.palette.urlslabColors.greyDarker } ) }
							textNoWrap
						/>
						<Tooltip
							title={
								<>
									<strong>{ __( 'What is keyword cluster?', 'urlslab' ) }</strong>
									<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.', 'urlslab' ) }</p>
									<p>{ __( 'Based on entered query we identify all other best matching keywords from the cluster.', 'urlslab' ) }</p>
									<p>{ __( 'If this option is selected, keywords included in page, but not found in SERP data will not be included in the table.', 'urlslab' ) }</p>
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
							label={ __( 'Compare domains of URLs', 'urlslab' ) }
							sx={ ( theme ) => ( { color: theme.palette.urlslabColors.greyDarker } ) }
							textNoWrap
						/>
						<Tooltip
							title={
								<>
									<strong>{ __( 'How does domain comparison work?', 'urlslab' ) }</strong>
									<p>{ __( 'From given URLs we extract domain name and compare from those domains all queries where given domain rank in top positions on Google. Evaluated are just processed queries, more queries your process, better results you get (e.g. 10k queries recommended). If we discover, that for given domain ranks better other URL of the domain (for specific query), we will show notification about it. This could help you to identify other URLs of domain, which rank better as select URL. This information could be helpful if you are building content clusters to identify duplicate pages with same intent or new opportunities found in competitor website. If you select this option, computation will take much longer as significantly more queries needs to be considered.', 'urlslab' ) }</p>
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
							<FormLabel>{ __( 'Clustering level', 'urlslab' ) }</FormLabel>
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
							<FormLabel>{ __( 'Max position', 'urlslab' ) }</FormLabel>
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
	);
}

export default memo( GapDetailMainSettings );
