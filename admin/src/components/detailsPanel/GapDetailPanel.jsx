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

	const handleCompare = async ( ok ) => {
		let opts = { ...fetchOptions };
		delete opts.queryFromClick;
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

	return <>
		<div className="pb-m">
			<h4>{ __( 'Compare domains or URLs' ) }</h4>
		</div>
		<Tabs size="sm" defaultValue="domains" onChange={ () => setCluster( ( val ) => val === 'domains' ? 'URLs' : 'domains' ) }>
			<TabList tabFlex="auto">
				<Tab value="domains">{ __( 'Compare Domains' ) }</Tab>
				<Tab value="urls">{ __( 'Compare URLs' ) }</Tab>
			</TabList>
			<div className="flex">

				<div className="width-40">
					<TabPanel value="domains">
						{ [ ...Array( domainId ) ].map( ( e, index ) => (
							<div className="flex mb-s" key={ `domain-${ index }` }>
								<InputField label={ `${ __( 'Domain' ) } ${ index }` } liveUpdate key={ fetchOptions.domains[ `domain_${ index }` ] } autoFocus defaultValue={ fetchOptions.domains[ `domain_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'domains', index ) } />
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
								<InputField label={ `${ __( 'URL' ) } ${ index }` } liveUpdate key={ fetchOptions.urls[ `url_${ index }` ] } autoFocus defaultValue={ fetchOptions.urls[ `url_${ index }` ] } onChange={ ( val ) => handleGapData( val, 'urls', index ) } />
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
					<strong className="flex">
						{ __( 'Keyword cluster' ) }
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
					</strong>
					<div className="flex flex-align-center mt-m" style={ { minWidth: '25em' } }>
						<InputField liveUpdate label={ __( 'Query' ) } key={ fetchOptions.queryFromClick } defaultValue={ fetchOptions.query } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, query: val } ) } />
						<InputField className="ml-s" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, matching_urls: val } ) } />
						<InputField className="ml-s" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, max_position: val } ) } />
					</div>
				</div>

				<div className="Buttons ma-top ma-bottom flex flex-align-center">
					<Button size="sm" disabled={ ! Object.keys( fetchOptions.domains ).length || ! Object.keys( fetchOptions.urls ).length } onClick={ () => handleCompare( true ) }>{ __( 'Compare' ) } { cluster }</Button>
				</div>
			</div>

		</Tabs>
	</>;
}