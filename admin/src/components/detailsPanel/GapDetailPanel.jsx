import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';

import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';
import IconButton from '../../elements/IconButton';

export default function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const fetchOptions = useTablePanels( ( state ) => Object.keys( state.fetchOptions ).length ? state.fetchOptions : { domains: { domain_0: '' }, urls: { url_0: '' }, matching_urls: 5, max_position: 10 } );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const [ domainId, setDomains ] = useState( 1 );
	const [ urlId, setUrls ] = useState( 1 );
	const [ cluster, setCluster ] = useState( 'domains' );

	const handleGapData = ( val, type, id ) => {
		if ( type === 'domains' ) {
			setFetchOptions( { ...fetchOptions, domains: { ...fetchOptions.domains, [ `domain_${ id }` ]: val } } );
			return false;
		}
		setFetchOptions( { ...fetchOptions, urls: { ...fetchOptions.urls, [ `url_${ id }` ]: val } } );
	};

	const handleCompare = useCallback( async ( ok, type ) => {
		let opts = { ...fetchOptions };
		delete opts.queryFromClick;
		delete opts.type;
		if ( ok && type === 'domains' ) {
			delete opts.urls;
			opts = { ...opts, domains: Object.values( opts.domains ) };
		}
		if ( ok && type === 'urls' ) {
			delete opts.domains;
			opts = { ...opts, urls: Object.values( opts.urls ) };
		}

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
	}, [ cluster, fetchOptions, slug ] );

	const handleNewInput = ( event, type ) => {
		if ( event.keyCode === 9 && type === 'domains' && event.target.value ) {
			setDomains( ( val ) => val + 1 );
		}
		if ( event.keyCode === 9 && type === 'urls' && event.target.value ) {
			setUrls( ( val ) => val + 1 );
		}
		if ( event.key === 'Enter' && event.target.value ) {
			handleCompare( true, type );
		}
	};

	useEffect( () => {
		if ( fetchOptions.type ) {
			setCluster( fetchOptions.type );
		}
		if ( fetchOptions.type === 'urls' && fetchOptions.urls ) {
			setUrls( Object.keys( fetchOptions.urls ).length ); // sets required amount of url fields from incoming compare URLs button
		}
		if ( fetchOptions.queryFromClick ) {
			handleCompare( true, fetchOptions.type || 'domains' );
		}
	}, [ fetchOptions, handleCompare ] );

	return <>
		<div className="pb-m">
			<h4 className="c-primary-color">{ __( 'Compare domains or URLs' ) }</h4>
		</div>
		<Tabs size="sm" defaultValue={ cluster } onChange={ () => setCluster( ( val ) => val === 'domains' ? 'urls' : 'domains' ) }>
			<TabList tabFlex={ 0 }>
				<Tab value="domains">{ __( 'Compare Domains' ) }</Tab>
				<Tab value="urls">{ __( 'Compare URLs' ) }</Tab>
			</TabList>
			<div className="flex">

				<div className="width-40">
					<strong></strong>
					<TabPanel value="domains">
						{ [ ...Array( domainId ) ].map( ( e, index ) => (
							<div className="flex mb-s" key={ `domain-${ index }` }>
								<InputField label={ `${ __( 'Domain' ) } ${ index }` } liveUpdate key={ fetchOptions.domains[ `domain_${ index }` ] } autoFocus defaultValue={ fetchOptions.domains[ `domain_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'domains', index ) } onKeyUp={ ( event ) => handleNewInput( event, 'domains' ) } />
								{ index === [ ...Array( domainId ) ].length - 1 &&
								<IconButton className="ml-s mb-s ma-top smallCircle bg-primary-color" onClick={ () => setDomains( ( val ) => val + 1 ) }><SvgIcon name="plus" className="c-white" /></IconButton>
								}
							</div>
						) )
						}
						<p className="urlslab-inputField-description mt-m">{ __( 'Compare multiple domains together and find out keywords intersecting between them.' ) }</p>
					</TabPanel>
					<TabPanel value="urls">
						{ [ ...Array( urlId ) ].map( ( e, index ) => (
							<div className="flex  mb-s" key={ `url-${ index }` }>
								<InputField label={ `${ __( 'URL' ) } ${ index }` } liveUpdate key={ fetchOptions.urls[ `url_${ index }` ] } autoFocus defaultValue={ fetchOptions.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'urls', index ) } onKeyUp={ ( event ) => handleNewInput( event, 'urls' ) } />
								{ index === [ ...Array( urlId ) ].length - 1 &&
									<IconButton className="ml-s mb-s ma-top smallCircle bg-primary-color" onClick={ () => setUrls( ( val ) => val + 1 ) }><SvgIcon name="plus" className="c-white" /></IconButton>
								}
							</div>
						) )
						}
						<p className="urlslab-inputField-description mt-m">{ __( 'Compare multiple URLs together and find out keywords intersecting between them.' ) }</p>
					</TabPanel>
				</div>
				<div className="mt-m ml-xl ma-right width-30">
					<span className="flex">
						<strong>{ __( 'Keyword cluster' ) }</strong>
						<IconButton
							className="ml-s info"
							tooltip={
								<>
									<strong>{ __( 'What is keyword cluster?' ) }</strong>
									<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.' ) }</p>
									<p>{ __( 'Enter a main keyword of cluster to find the best matching keywords from the cluster. Leave query field empty to show full content gap analyses.' ) }</p>
								</>
							}
							tooltipStyle={ { width: '20em' } }
						>
							<SvgIcon name="info" />
						</IconButton>
					</span>
					<div className="flex flex-align-center mt-m" style={ { minWidth: '25em' } }>
						<InputField liveUpdate label={ __( 'Query' ) } key={ fetchOptions.queryFromClick } defaultValue={ fetchOptions.query } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, query: val } ) } />
						<InputField className="ml-s" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, matching_urls: val } ) } />
						<InputField className="ml-s" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, max_position: val } ) } />
					</div>
				</div>

				<div className="Buttons ma-top ma-bottom flex flex-align-center">
					<Button size="sm" disabled={ ( cluster === 'domains' && ! Object.values( fetchOptions.domains )[ 0 ] ) || ( cluster === 'urls' && ! Object.values( fetchOptions.urls )[ 0 ] ) } onClick={ () => handleCompare( true, cluster ) }>{ __( 'Compare' ) } { cluster === 'urls' ? 'URLs' : cluster }</Button>
				</div>
			</div>

		</Tabs>
	</>;
}
