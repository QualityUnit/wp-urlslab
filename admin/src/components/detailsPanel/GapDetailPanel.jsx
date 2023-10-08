import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';
import useTableStore from '../../hooks/useTableStore';

export default function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const fetchOptions = useTablePanels( ( state ) => Object.keys( state.fetchOptions ).length ? state.fetchOptions : { domains: { domain_0: '' }, urls: { url_0: '' }, matching_urls: 5, max_position: 10 } );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const showSecondPanel = useTablePanels( ( state ) => state.showSecondPanel );
	const [ domainId, setDomains ] = useState( 0 );
	const [ urlId, setUrls ] = useState( 0 );
	const [ cluster, setCluster ] = useState( 'domains' );

	const handleGapData = ( val, type, id ) => {
		if ( type === 'domains' ) {
			setFetchOptions( { ...fetchOptions, domains: { ...fetchOptions.domains, [ `domain_${ id }` ]: val } } );
			return false;
		}
		setFetchOptions( { ...fetchOptions, urls: { ...fetchOptions.urls, [ `url_${ id }` ]: val } } );
	};

	const handleCompare = async ( ok ) => {
		showSecondPanel();
		let opts = { ...fetchOptions };
		if ( ok && cluster === 'domains' ) {
			delete opts.urls;
			opts = { ...opts, domains: Object.values( opts.domains ) };
		}
		if ( ok && cluster === 'URLs' ) {
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
	};

	return <div className={ `urlslab-panel fadeInto urslab-floating-panel onBottom urslab-Compare-panel` }>
		<div className="urlslab-panel-header urslab-Compare-panel-header pb-m">
			<strong>{ __( 'Compare domains or URLs' ) }</strong>
		</div>
		<Tabs size="sm" defaultValue="domains" onChange={ () => setCluster( ( val ) => val === 'domains' ? 'URLs' : 'domains' ) }>
			<TabList tabFlex={ 1 }>
				<Tab value="domains">{ __( 'Compare Domains' ) }</Tab>
				<Tab value="urls">{ __( 'Compare URLs' ) }</Tab>
			</TabList>
			<TabPanel value="domains">
				{ [ ...Array( domainId + 1 ) ].map( ( e, index ) => (
					<div className="flex" key={ `domain-${ index }` }>
						<InputField label={ `${ __( 'Domain' ) } ${ index }` } liveUpdate key={ fetchOptions.domains[ `domain_${ index }` ] } autoFocus defaultValue={ fetchOptions.domains[ `domain_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'domains', index ) } />
						<SvgIcon name="plus" className="ml-s" onClick={ () => setDomains( ( val ) => val + 1 ) } />
					</div>
				) )
				}
				<p className="urlslab-inputField-description mt-m">{ __( 'Compare multiple domains together and find out keywords intersecting between them.' ) }</p>
			</TabPanel>
			<TabPanel value="urls">
				{ [ ...Array( urlId + 1 ) ].map( ( e, index ) => (
					<div className="flex" key={ `url-${ index }` }>
						<InputField label={ `${ __( 'URL' ) } ${ index }` } liveUpdate key={ fetchOptions.urls[ `url_${ index }` ] } autoFocus defaultValue={ fetchOptions.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'urls', index ) } />
						<SvgIcon name="plus" className="ml-s" onClick={ () => setUrls( ( val ) => val + 1 ) } />
					</div>
				) )
				}
				<p className="urlslab-inputField-description mt-m">{ __( 'Compare multiple URLs together and find out keywords intersecting between them.' ) }</p>
			</TabPanel>
			<h4>{ __( 'Keyword cluster' ) }</h4>
			<div className="flex flex-align-center mt-m" style={ { minWidth: '25em' } }>
				<InputField liveUpdate label={ __( 'Query' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, query: val } ) } />
				<InputField className="ml-s" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, matching_urls: val } ) } />
				<InputField className="ml-s" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, max_position: val } ) } />
			</div>
			<div className="urlslab-inputField-description mt-m">
				<strong>{ __( 'What is keyword cluster?' ) }</strong>
				<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.' ) }</p>
				<p>{ __( 'Enter a main keyword of cluster to find the best matching keywords from the cluster. Leave query field empty to show full content gap analyses.' ) }</p>
			</div>

			<div className="Buttons mt-m flex flex-align-center">
				<Button size="sm" variant="plain" color="neutral" onClick={ () => handleCompare( ) } sx={ { ml: 'auto', mr: 1 } }>{ __( 'Cancel' ) }</Button>
				<Button size="sm" disabled={ ( ! Object.keys( fetchOptions.domains ).length ) && ! fetchOptions.query } onClick={ () => handleCompare( true ) }>{ __( 'Compare' ) } { cluster }</Button>
			</div>
		</Tabs>
	</div>;
}
