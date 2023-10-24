import { memo, useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';

import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';
import IconButton from '../../elements/IconButton';
import Checkbox from '../../elements/Checkbox';
import CountrySelect from '../../elements/CountrySelect';
import { getQueryUrls } from '../../lib/serpQueries';

function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const fetchOptions = useTablePanels( ( state ) => Object.keys( state.fetchOptions ).length ? state.fetchOptions : { urls: { url_0: '' }, matching_urls: 5, max_position: 10, compare_domains: false, show_keyword_cluster: false, country: 'us' } );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const [ urlId, setUrls ] = useState( 1 );

	const handleGapData = ( val, id, del = false ) => {
		if ( del ) {
			let filteredUrlFields = { };
			delete fetchOptions.urls[ `url_${ id }` ];
			setUrls( ( value ) => value - 1 );
			Object.values( fetchOptions.urls ).map( ( url, index ) => {
				filteredUrlFields = { ...filteredUrlFields, [ `url_${ index }` ]: url };
				return false;
			} );
			setFetchOptions( { ...fetchOptions, urls: filteredUrlFields } );
			return false;
		}
		setFetchOptions( { ...fetchOptions, urls: { ...fetchOptions.urls, [ `url_${ id }` ]: val } } );
	};

	const handleCompare = useCallback( async ( ) => {
		console.log( 'handle compare' );
		let opts = { ...fetchOptions };
		delete opts.queryFromClick;

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
		const urls = await getQueryUrls( { query: fetchOptions.query, country: fetchOptions.country, limit: 15 } );
		if ( ! urls ) {
			return false;
		}

		let filteredUrlFields = { };

		Object.values( urls ).map( ( url, index ) => {
			filteredUrlFields = { ...filteredUrlFields, [ `url_${ index }` ]: url.url_name };
		} );
		setFetchOptions( { ...fetchOptions, queryFromClick: true, urls: filteredUrlFields } );
	}, [ fetchOptions, slug ] );

	const handleNewInput = ( event ) => {
		if ( event.keyCode === 9 && event.target.value ) {
			setUrls( ( val ) => val + 1 );
		}
		if ( event.key === 'Enter' && event.target.value ) {
			handleCompare( );
		}
	};

	useEffect( () => {
		console.log( fetchOptions );
		if ( fetchOptions.urls ) {
			setUrls( Object.keys( fetchOptions.urls ).length ); // sets required amount of url fields from incoming compare URLs button
		}
		if ( fetchOptions.queryFromClick ) {
			handleCompare( );
		}
	}, [ fetchOptions ] );

	return <div className="flex flex-align-start">
		<div className="width-40">
			<strong>&nbsp;</strong>

			{ [ ...Array( urlId ) ].map( ( e, index ) => (
				<div className="flex  mb-s" key={ `url-${ index }` }>
					<InputField label={ `${ __( 'URL' ) } ${ index }` } liveUpdate key={ fetchOptions.urls[ `url_${ index }` ] } autoFocus defaultValue={ fetchOptions.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, index ) } onKeyUp={ handleNewInput } />
					{ urlId > 1 &&
						<IconButton className="ml-s mb-s ma-top smallCircle bg-primary-color c-white" onClick={ () => handleGapData( '', index, true ) }>– </IconButton>
					}
					{ index === [ ...Array( urlId ) ].length - 1 &&
						<IconButton className="ml-s mb-s ma-top smallCircle bg-primary-color" onClick={ () => setUrls( ( val ) => val + 1 ) }><SvgIcon name="plus" className="c-white" /></IconButton>
					}
				</div>
			) )
			}
			<Checkbox className="fs-s mt-m" key={ fetchOptions.compare_domains } defaultValue={ fetchOptions.compare_domains } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, compare_domains: val } ) }>{ __( 'Compare domains of URLs' ) }</Checkbox>
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
		<div className="mt-m ml-xl ma-right width-30">
			<div className="flex flex-align-center mt-m" style={ { minWidth: '25em' } }>
				<div className="flex">
					<InputField className="width-40" liveUpdate label={ __( 'Query' ) } key={ fetchOptions.queryFromClick } defaultValue={ fetchOptions.query } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, query: val } ) } />
					<CountrySelect value={ fetchOptions.country } defaultValue={ fetchOptions.country } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, country: val } ) } />
					<Button size="xs" disabled={ fetchOptions?.query?.length === 0 } onClick={ loadUrls }>{ __( 'Load URLs' ) }</Button>
				</div>
				<div className="flex">
					<Checkbox className="fs-s mt-m" key={ fetchOptions.show_keyword_cluster } defaultValue={ fetchOptions.show_keyword_cluster } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, show_keyword_cluster: val } ) }>{ __( 'Show just queries from Keyword Cluster' ) }</Checkbox>
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
						<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, matching_urls: val } ) }></InputField>
						<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, max_position: val } ) }></InputField>
					</>
				}
			</div>
		</div>
	</div>;
}

export default memo( GapDetailPanel );
