import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Button from '@mui/joy/Button';
import { postFetch } from '../../api/fetching';

import useCustomPanel from '../../hooks/useCustomPanel';
import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';

export default function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const options = useCustomPanel( ( state ) => Object.keys( state.options ).length ? state.options : { domains: { domain_0: '' }, urls: { url_0: '' }, matching_urls: 5, max_position: 10 } );
	const setOptions = useCustomPanel( ( state ) => state.setOptions );
	const activatePanel = useCustomPanel( ( state ) => state.activatePanel );
	const [ domainId, setDomains ] = useState( 0 );
	const [ urlId, setUrls ] = useState( 0 );
	const [ cluster, setCluster ] = useState( 'domains' );

	const handleGapData = ( val, type, id ) => {
		if ( type === 'domains' ) {
			setOptions( { ...options, domains: { ...options.domains, [ `domain_${ id }` ]: val } } );
			return false;
		}
		setOptions( { ...options, urls: { ...options.urls, [ `url_${ id }` ]: val } } );
	};

	const handleCompare = async ( ok ) => {
		activatePanel();
		let opts = { ...options };
		if ( ok && cluster === 'domains' ) {
			delete opts.urls;
			opts = { ...opts, domains: Object.values( opts.domains ) };
		}
		if ( ok && cluster === 'URLs' ) {
			delete opts.domains;
			opts = { ...opts, domains: Object.values( opts.urls ) };
		}
		const response = await postFetch( 'serp-domains/gap/', opts );
		return response.json();
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
						<InputField label={ `${ __( 'Domain' ) } ${ index }` } liveUpdate key={ options.domains[ `domain_${ index }` ] } autoFocus defaultValue={ options.domains[ `domain_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'domains', index ) } />
						<SvgIcon name="plus" className="ml-s" onClick={ () => setDomains( ( val ) => val + 1 ) } />
					</div>
				) )
				}
				<p className="urlslab-inputField-description mt-m">{ __( 'Compare multiple domains together and find out keywords intersecting between them.' ) }</p>
			</TabPanel>
			<TabPanel value="urls">
				{ [ ...Array( urlId + 1 ) ].map( ( e, index ) => (
					<div className="flex" key={ `url-${ index }` }>
						<InputField label={ `${ __( 'URL' ) } ${ index }` } liveUpdate key={ options.urls[ `url_${ index }` ] } autoFocus defaultValue={ options.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'urls', index ) } />
						<SvgIcon name="plus" className="ml-s" onClick={ () => setUrls( ( val ) => val + 1 ) } />
					</div>
				) )
				}
				<p className="urlslab-inputField-description mt-m">{ __( 'Compare multiple URLs together and find out keywords intersecting between them.' ) }</p>
			</TabPanel>
			{ /* <Tabs defaultValue="cluster">
			<TabPanel value="cluster"> */ }
			<h4>{ __( 'Keyword cluster' ) }</h4>
			<div className="flex flex-align-center mt-m" style={ { minWidth: '25em' } }>
				<InputField liveUpdate label={ __( 'Query' ) } onChange={ ( val ) => setOptions( { ...options, query: val } ) } />
				<InputField className="ml-s" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setOptions( { ...options, matching_urls: val } ) } />
				<InputField className="ml-s" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setOptions( { ...options, max_position: val } ) } />
			</div>
			<div className="urlslab-inputField-description mt-m">
				<strong>{ __( 'What is keyword cluster?' ) }</strong>
				<p>{ __( 'Cluster forms keywords discovered in your database, where the same URLs rank on Google Search for each query.' ) }</p>
				<p>{ __( 'Enter a main keyword of cluster to find the best matching keywords from the cluster. Leave query field empty to show full content gap analyses.' ) }</p>
			</div>

			<div className="Buttons mt-m flex flex-align-center">
				<Button size="sm" variant="plain" color="neutral" onClick={ () => handleCompare( ) } sx={ { ml: 'auto', mr: 1 } }>{ __( 'Cancel' ) }</Button>
				<Button size="sm" disabled={ ( ! Object.keys( options.domains ).length ) && ! options.query } onClick={ () => handleCompare( true ) }>{ __( 'Compare' ) } { cluster }</Button>
			</div>
		</Tabs>

	</div>;
}
