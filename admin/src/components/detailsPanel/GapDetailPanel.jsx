import { memo, useCallback, useEffect, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import Button from '@mui/joy/Button';

import useTablePanels from '../../hooks/useTablePanels';
import useTableStore from '../../hooks/useTableStore';

import InputField from '../../elements/InputField';
import SvgIcon from '../../elements/SvgIcon';
import IconButton from '../../elements/IconButton';
import Checkbox from '../../elements/Checkbox';

function GapDetailPanel( { slug } ) {
	const { __ } = useI18n();
	const fetchOptions = useTablePanels( ( state ) => Object.keys( state.fetchOptions ).length ? state.fetchOptions : { urls: { url_0: '' }, matching_urls: 5, max_position: 10, compare_domains: false } );
	const setFetchOptions = useTablePanels( ( state ) => state.setFetchOptions );
	const [ urlId, setUrls ] = useState( 1 );

	const handleGapData = ( val, id ) => {
		setFetchOptions( { ...fetchOptions, urls: { ...fetchOptions.urls, [ `url_${ id }` ]: val } } );
	};

	const handleCompare = useCallback( async ( ) => {
		let opts = { ...fetchOptions };
		delete opts.queryFromClick;

		opts = { ...opts, urls: Object.values( opts.urls ) };

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

	const handleNewInput = ( event ) => {
		if ( event.keyCode === 9 && event.target.value ) {
			setUrls( ( val ) => val + 1 );
		}
		if ( event.key === 'Enter' && event.target.value ) {
			handleCompare( );
		}
	};

	useEffect( () => {
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
					{ index === [ ...Array( urlId ) ].length - 1 &&
					<IconButton className="ml-s mb-s ma-top smallCircle bg-primary-color" onClick={ () => setUrls( ( val ) => val + 1 ) }><SvgIcon name="plus" className="c-white" /></IconButton>
					}
				</div>
			) )
			}
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
				<InputField className="width-40" liveUpdate label={ __( 'Query' ) } key={ fetchOptions.queryFromClick } defaultValue={ fetchOptions.query } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, query: val } ) } />
				<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 5 } label={ __( 'Clustering Level' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, matching_urls: val } ) } />
				<InputField className="ml-s width-30" type="number" liveUpdate defaultValue={ 10 } label={ __( 'Max position' ) } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, max_position: val } ) } />
			</div>
		</div>
		<div className="Buttons ma-top ma-bottom flex flex-column flex-justify-center">
			<Button size="sm" disabled={ ! Object.values( fetchOptions.urls )[ 0 ] } onClick={ handleCompare }>{ __( 'Compare URLs/domains' ) }</Button>
			<Checkbox className="fs-s mt-m" defaultValue={ fetchOptions.compare_domains } onChange={ ( val ) => setFetchOptions( { ...fetchOptions, compare_domains: val } ) }>{ __( 'Compare domains' ) }</Checkbox>
		</div>
	</div>;
}

export default memo( GapDetailPanel );
