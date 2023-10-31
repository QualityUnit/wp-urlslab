import { memo, useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';
import { getQueryUrls } from '../../lib/serpQueries';

import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';
import URLslabButton from '../../elements/Button';
import IconButton from '../../elements/IconButton';
import Checkbox from '../../elements/Checkbox';
import CountrySelect from '../../elements/CountrySelect';
import Loader from '../Loader';
import '../../assets/styles/components/_TopPanel.scss';

function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const gapFetchOptions = useTablePanels( ( state ) => state.gapFetchOptions );
	const setGapFetchOptions = useTablePanels( ( state ) => state.setGapFetchOptions );
	const [ loadingUrls, setLoadingUrls ] = useState( false );
	const [ expandedPanel, expandPanel ] = useState( true );
	const [ urlId, setUrls ] = useState( 4 );

	const handleGapData = useCallback( ( val, id ) => {
		if ( id === urlId - 1 ) {
			setUrls( ( value ) => value + 1 );
		}
		setGapFetchOptions( { ...gapFetchOptions, urls: { ...gapFetchOptions.urls, [ `url_${ id }` ]: val } } );
	}, [ gapFetchOptions, setGapFetchOptions, urlId ] );

	const handleCompare = useCallback( async ( ) => {
		let opts = { ...gapFetchOptions };
		delete opts.queryFromClick;

		opts = { ...opts, urls: Object.values( opts.urls ).filter( ( url ) => url !== '' ) };

		// if ( Object.keys( opts.urls ).length > 4 && expandedPanel ) {
		// 	expandPanel( false );
		// }

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
	}, [ gapFetchOptions, slug ] );

	const loadUrls = useCallback( async ( ) => {
		setLoadingUrls( true );
		const urls = await getQueryUrls( { query: gapFetchOptions.query, country: gapFetchOptions.country, limit: 15 } );
		if ( urls ) {
			let filteredUrlFields = { };
			Object.values( urls ).map( ( url, index ) => {
				return filteredUrlFields = { ...filteredUrlFields, [ `url_${ index }` ]: url.url_name };
			} );
			setGapFetchOptions( { ...gapFetchOptions, queryFromClick: true, urls: filteredUrlFields } );
		}
		setLoadingUrls( false );
	}, [ gapFetchOptions, setGapFetchOptions ] );

	const handleNewInput = useCallback( ( event ) => {
		if ( event.key === 'Enter' && event.target.value ) {
			handleCompare( );
		}
	}, [ handleCompare ] );

	useEffect( () => {
		if ( Object.keys( gapFetchOptions.urls ).length >= urlId ) {
			setUrls( Object.keys( gapFetchOptions.urls ).length ); // sets required amount of url fields from incoming compare URLs button
		}

		if ( gapFetchOptions.queryFromClick ) {
			handleCompare( );
		}
	}, [ gapFetchOptions, urlId, handleCompare ] );

	return (
		<>
			{ loadingUrls && <Loader overlay>{ __( 'Loading URLs…' ) }</Loader> }
			<div className="urlslab-topPanel">
				<div className="urlslab-topPanel-split4">
					<InputField liveUpdate label={ __( 'Query' ) } key={ gapFetchOptions.queryFromClick } defaultValue={ gapFetchOptions.query } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, query: val } ) } />
					<CountrySelect className="mt-m" label={ __( 'Country' ) } value={ gapFetchOptions.country } defaultValue={ gapFetchOptions.country } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, country: val } ) } />
					<div className="flex flex-align-center mt-m">
						<Checkbox className="fs-s" key={ gapFetchOptions.show_keyword_cluster } defaultValue={ gapFetchOptions.show_keyword_cluster } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, show_keyword_cluster: val } ) }>{ __( 'Show just queries from Keyword Cluster' ) }</Checkbox>
						<IconButton
							className="ml-s info"
							tooltip={
								<>
									<strong>{ __( 'What is keyword cluster?' ) }</strong>
									<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.' ) }</p>
									<p>{ __( 'Based on entered query we identify all other best matching keywords from the cluster.' ) }</p>
									<p>{ __( 'If this option is selected, keywords included in page, but not found in SERP data will not be included in the table.' ) }</p>
								</>
							}
							tooltipStyle={ { width: '20em' } } >
							<SvgIcon name="info" />
						</IconButton>
						<div>

							{ gapFetchOptions?.query?.length > 0 && gapFetchOptions.show_keyword_cluster &&
								<>
									<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, matching_urls: val } ) }></InputField>
									<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, max_position: val } ) }></InputField>
								</>
							}
						</div>

					</div>
				</div>

				<div className="urlslab-topPanel-split2">
					<div className="flex flex-wrap flex-justify-space-between">
						{ [ ...Array( urlId ) ].map( ( e, index ) => (
							<InputField className={ `mb-m ${ ! expandedPanel && index > 3 ? 'hidden' : '' }` } style={ { width: 'calc(50% - 1em)' } } labelInline label={ `${ __( 'URL' ) } ${ index }` } liveUpdate autoFocus={ index === 0 } key={ useTableStore.getState().tables[ slug ]?.fetchOptions?.urls[ index ] } defaultValue={ gapFetchOptions.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, index ) } onKeyUp={ handleNewInput } />
						) )
						}
					</div>
				</div>

				<div className="urlslab-topPanel-split4">
					<div className="flex">
						<Button disabled={ gapFetchOptions?.query?.length === 0 } onClick={ loadUrls }>{ __( 'Load URLs' ) }</Button>
						{
							urlId > 4 &&
							<URLslabButton
								className="ma-left"
								onClick={ () => expandPanel( ( val ) => ! val ) }
							>
								<SvgIcon name="arrowhead-up" style={ { marginRight: 0, transform: ! expandedPanel ? 'scaleX(-1)' : '' } } />
							</URLslabButton>
						}
					</div>
					<div className="flex flex-align-center mt-m">
						<Checkbox className="fs-s" key={ gapFetchOptions.compare_domains } defaultValue={ gapFetchOptions.compare_domains } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, compare_domains: val } ) }>{ __( 'Compare domains of URLs' ) }</Checkbox>
						<IconButton
							className="ml-s info"
							tooltip={
								<>
									<strong>{ __( 'How does domain comparison work?' ) }</strong>
									<p>{ __( 'From given URLs we extract domain name and compare from those domains all queries where given domain rank in top positions on Google. Evaluated are just processed queries, more queries your process, better results you get (e.g. 10k queries recommended). If we discover, that for given domain ranks better other URL of the domain (for specific query), we will show notification about it. This could help you to identify other URLs of domain, which rank better as select URL. This information could be helpful if you are building content clusters to identify duplicate pages with same intent or new opportunities found in competitor website. If you select this option, computation will take much longer as significantly more queries needs to be considered.' ) }</p>
								</>
							}
							tooltipClass="align-left"
							tooltipStyle={ { width: '20em' } }
						>
							<SvgIcon name="info" />
						</IconButton>
					</div>
					<div className="flex flex-align-center mt-m">
						<Checkbox className="fs-s" key={ gapFetchOptions.parse_headers } defaultValue={ gapFetchOptions.parse_headers } onChange={ ( val ) => setGapFetchOptions( { ...gapFetchOptions, parse_headers: val } ) }>{ __( 'Parse just headers (TITLE, H1…H6)' ) }</Checkbox>
						<IconButton
							className="ml-s info"
							tooltip={
								<>
									<strong>{ __( 'How parsing works?' ) }</strong>
									<p>{ __( 'Text elements from specified URLs will be extracted and compared for phrase matching. Checking this box allows for parsing text strictly from headers, i.e. H1 … H6 tags, and TITLE tags. This is a useful option as copywriters often use the most important keywords in titles and headers, thus enabling the identification of keyword frequency based on headings alone.' ) }</p>
								</>
							}
							tooltipClass="align-left"
							tooltipStyle={ { width: '20em' } }
						>
							<SvgIcon name="info" />
						</IconButton>
					</div>
				</div>
			</div>
		</>
	);
}

export default memo( GapDetailPanel );
