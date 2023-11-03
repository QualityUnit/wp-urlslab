import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Button from '@mui/joy/Button';
import { default as URLslabButton } from '../../elements/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';
import { getQueryUrls } from '../../lib/serpQueries';

import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';
import IconButton from '../../elements/IconButton';
import Checkbox from '../../elements/Checkbox';
import CountrySelect from '../../elements/CountrySelect';

function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const [ urlId, setUrls ] = useState( 1 );
	const [ loadingUrls, setLoadingUrls ] = useState( false );
	const [ urlsPanel, setURLsPanel ] = useState( false );
	const refPanel = useRef();

	// handle updating of fetchOptions and append flag to run urls preprocess
	const updateFetchOptions = useCallback( ( data ) => {
		setFetchOptions( { ...useTablePanels.getState().fetchOptions, ...data, forceUrlsProcessing: true, processedUrls: [] } );
	}, [ setFetchOptions ] );

	const handleGapData = useCallback( ( val, id, del = false ) => {
		if ( del ) {
			let filteredUrlFields = { };
			delete fetchOptions.urls[ `url_${ id }` ];
			setUrls( ( value ) => value - 1 );
			Object.values( fetchOptions.urls ).map( ( url, index ) => {
				filteredUrlFields = { ...filteredUrlFields, [ `url_${ index }` ]: url };
				return false;
			} );
			updateFetchOptions( { urls: filteredUrlFields } );
			return false;
		}
		updateFetchOptions( { urls: { ...fetchOptions.urls, [ `url_${ id }` ]: val } } );
	}, [ fetchOptions.urls, updateFetchOptions ] );

	const handleCompare = useCallback( async ( ) => {
		let opts = { ...fetchOptions };
		// delete fetch options not related for table query
		delete opts.queryFromClick;
		delete opts.processedUrls;
		delete opts.forceUrlsProcessing;

		opts = { ...opts, urls: Object.values( opts.urls ).filter( ( url ) => url !== '' ) };

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
	}, [ fetchOptions, slug ] );

	const loadUrls = useCallback( async ( ) => {
		setLoadingUrls( true );
		const urls = await getQueryUrls( { query: fetchOptions.query, country: fetchOptions.country, limit: 15 } );
		if ( urls ) {
			let filteredUrlFields = { };
			Object.values( urls ).map( ( url, index ) => {
				return filteredUrlFields = { ...filteredUrlFields, [ `url_${ index }` ]: url.url_name };
			} );
			updateFetchOptions( { queryFromClick: true, urls: filteredUrlFields } );
		}
		setLoadingUrls( false );
	}, [ fetchOptions, updateFetchOptions ] );

	const handleNewInput = useCallback( ( event ) => {
		if ( event.keyCode === 9 && event.target.value ) {
			setUrls( ( val ) => val + 1 );
		}
		if ( event.key === 'Enter' && event.target.value ) {
			handleCompare( );
		}
	}, [ handleCompare ] );

	// fill fetch options on first load when data was not provided
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
			} );
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	useEffect( () => {
		if ( fetchOptions.urls ) {
			setUrls( Object.keys( fetchOptions.urls ).length ); // sets required amount of url fields from incoming compare URLs button
		}
		if ( fetchOptions.queryFromClick ) {
			handleCompare( );
		}
	}, [ fetchOptions, handleCompare ] );

	useEffect( () => {
		const handleClickOutside = ( event ) => {
			if ( ! refPanel.current?.contains( event.target ) && urlsPanel ) {
				setURLsPanel( false );
			}
		};
		document.addEventListener( 'click', handleClickOutside, false );
	}, [ urlsPanel ] );

	return (
		<>
			{ ( fetchOptions && Object.keys( fetchOptions ).length ) &&
			<div className="flex flex-align-start pos-relative">
				<div className="width-40">
					<strong>{ __( 'List of URLs' ) }</strong>
					<div className="pos-relative" ref={ refPanel } style={ { zIndex: 2 } }>
						<URLslabButton
							active={ urlsPanel }
							className="outline"
							onClick={ () => setURLsPanel( ! urlsPanel ) }
						>
							{ urlId === 1 && ! fetchOptions.urls.url_0
								? __( 'Add/Remove URLs' )
								: [ ...Array( urlId ) ].map( ( e, index ) => {
									return index < 3 && ( ( index > 0 && fetchOptions.urls[ `url_${ index }` ] ? ', ' : '' ) + fetchOptions.urls[ `url_${ index }` ] );
								} ) }
							{ Object.keys( fetchOptions.urls ).length >= 3 && '…' }
						</URLslabButton>
						{ urlsPanel &&
							<div className={ `urlslab-panel fadeInto urslab-floating-panel onBottom` } style={ { width: '30em' } }>
								<div className="urlslab-panel-header pb-m">
									<strong>{ __( 'Add/Remove URLs' ) }</strong>
								</div>
								<div className="urslab-floating-panel-content limitHeight-30">
									{ [ ...Array( urlId ) ].map( ( e, index ) => (
										<div className="flex  mb-s" key={ `url-${ index }` }>
											<InputField label={ `${ __( 'URL' ) } ${ index }` } liveUpdate autoFocus key={ useTableStore.getState().tables[ slug ]?.fetchOptions?.urls[ index ] } defaultValue={ fetchOptions.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, index ) } onKeyUp={ handleNewInput } />
											{ urlId > 1 &&
											<IconButton key={ `removeUrl-${ index }` } className="ml-s mb-s ma-top smallCircle bg-primary-color c-white" onClick={ () => handleGapData( '', index, true ) }>– </IconButton>
											}
											{ index === [ ...Array( urlId ) ].length - 1 && index < 14 &&
											<IconButton key={ `addUrl-${ index }` } className="ml-s mb-s ma-top smallCircle bg-primary-color" onClick={ () => setUrls( ( val ) => val + 1 ) }><SvgIcon name="plus" className="c-white" /></IconButton>
											}
										</div>
									) )
									}
								</div>
							</div>
						}
					</div>
					<div className="flex">
						<Checkbox className="fs-s mt-m" key={ fetchOptions.compare_domains } defaultValue={ fetchOptions.compare_domains } onChange={ ( val ) => updateFetchOptions( { compare_domains: val } ) }>{ __( 'Compare domains of URLs' ) }</Checkbox>
						<IconButton
							className="ml-s info"
							tooltip={
								<>
									<strong>{ __( 'How does domain comparison work?' ) }</strong>
									<p>{ __( 'From given URLs we extract domain name and compare from those domains all queries where given domain rank in top positions on Google. Evaluated are just processed queries, more queries your process, better results you get (e.g. 10k queries recommended). If we discover, that for given domain ranks better other URL of the domain (for specific query), we will show notification about it. This could help you to identify other URLs of domain, which rank better as select URL. This information could be helpful if you are building content clusters to identify duplicate pages with same intent or new opportunities found in competitor website. If you select this option, computation will take much longer as significantly more queries needs to be considered.' ) }</p>
								</>
							}
							tooltipStyle={ { width: '20em' } }
						>
							<SvgIcon name="info" />
						</IconButton>
					</div>
					<div className="flex">
						<Checkbox className="fs-s mt-m" key={ fetchOptions.parse_headers } defaultValue={ fetchOptions.parse_headers } onChange={ ( val ) => updateFetchOptions( { parse_headers: val } ) }>{ __( 'Parse just headers (TITLE, H1…H6)' ) }</Checkbox>
						<IconButton
							className="ml-s info"
							tooltip={
								<>
									<strong>{ __( 'How parsing works?' ) }</strong>
									<p>{ __( 'Text elements from specified URLs will be extracted and compared for phrase matching. Checking this box allows for parsing text strictly from headers, i.e. H1 … H6 tags, and TITLE tags. This is a useful option as copywriters often use the most important keywords in titles and headers, thus enabling the identification of keyword frequency based on headings alone.' ) }</p>
								</>
							}
							tooltipStyle={ { width: '20em' } }
						>
							<SvgIcon name="info" />
						</IconButton>
					</div>
				</div>
				<div className="mt-m ml-xl ma-right width-30">
					<div className="flex flex-align-center mt-m" style={ { minWidth: '25em' } }>
						<div>
							<div className="flex">
								<InputField className="width-50" liveUpdate label={ __( 'Query' ) } key={ fetchOptions.queryFromClick } defaultValue={ fetchOptions.query } onChange={ ( val ) => updateFetchOptions( { query: val } ) } />
								<CountrySelect className="width-50 ml-m" label={ __( 'Country' ) } value={ fetchOptions.country } defaultValue={ fetchOptions.country } onChange={ ( val ) => updateFetchOptions( { country: val } ) } />

							</div>
							<div>
								<div className="flex">
									<Checkbox className="fs-s mt-m" key={ fetchOptions.show_keyword_cluster } defaultValue={ fetchOptions.show_keyword_cluster } onChange={ ( val ) => updateFetchOptions( { show_keyword_cluster: val } ) }>{ __( 'Show just queries from Keyword Cluster' ) }</Checkbox>
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
								</div>

								{ fetchOptions?.query?.length > 0 && fetchOptions.show_keyword_cluster &&
								<>
									<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => updateFetchOptions( { matching_urls: val } ) }></InputField>
									<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => updateFetchOptions( { max_position: val } ) }></InputField>
								</>
								}
							</div>
						</div>
						<Button
							disabled={ fetchOptions?.query?.length === 0 } sx={ { ml: 1 } }
							onClick={ loadUrls }
							loading={ loadingUrls }
						>
							{ __( 'Load URLs' ) }
						</Button>
					</div>
				</div>
			</div>
			}
		</>
	);
}

export default memo( GapDetailPanel );
