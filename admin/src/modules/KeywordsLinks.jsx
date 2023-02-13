import { useState, Suspense, lazy } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	persistQueryClient,
} from '@tanstack/react-query-persist-client';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useCSVReader, useCSVDownloader } from 'react-papaparse';
import { setData } from '../api/fetching';
import TableViewHeader from '../components/TableViewHeader';
import KeywordsTable from '../tables/KeywordsTable';

export default function KeywordLinks( { moduleId } ) {
	const { __ } = useI18n();
	const { CSVReader } = useCSVReader();
	const { CSVDownloader, Type } = useCSVDownloader();
	const queryClient = useQueryClient();

	const [ csvMessage, setCSVMessage ] = useState( null );
	const [ activeSection, setActiveSection ] = useState( 'overview' );

	// persistQueryClient( {
	// 	queryClient,
	// 	buster: 'keyword',
	// } );

	const importLocal = ( parsedData ) => {
		// console.log( queryClient.getQueryData( [ 'tableKeyword' ] ) );
		// console.log( parsedData );
		setCSVMessage( __( 'Processing data…' ) );
		queryClient.setQueryData( [ 'tableKeyword' ], parsedData );
		setCSVMessage( null );
	};

	const importData = useMutation( {
		mutationFn: ( results ) => {
			setCSVMessage( __( 'Uploading data…' ) );

			return setData( 'keyword/import',
				results.data
			);
		},
		onSuccess: () => {
			setCSVMessage( __( 'Data uploaded' ) );
			queryClient.invalidateQueries( [ 'tableKeyword' ] );
			setTimeout( () => {
				setCSVMessage( null );
			}, 300 );
		},
	} );

	const SettingsModule = lazy( () => import( `../modules/Settings.jsx` ) );

	return (
		<div className="urlslab-tableView">
			<TableViewHeader activeMenu={ ( activemenu ) => setActiveSection( activemenu ) } />
			{
				activeSection === 'overview' &&
				<KeywordsTable />
			}
			{
				activeSection === 'settings' &&
					<Suspense>
						<SettingsModule className="fadeInto" settingId={ moduleId } />
					</Suspense>

			}
			{
				activeSection === 'importexport' &&
				<div>Import Export</div>
			}
		</div>
	);
}
