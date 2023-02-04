import { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetchData';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';

export default function KeywordLinks( { settings } ) {
	const { __ } = useI18n();
	const { CSVReader } = useCSVReader( );
	const [ data, setData ] = useState( null );

	const columnHelper = createColumnHelper();

	const columns = [
		columnHelper.accessor( 'Komponent', {
			header: () => __( 'Komponent' ),
		} ),
		columnHelper.accessor( 'Ks', {
			header: () => __( 'Pocet Ks' ),
		} ),
		columnHelper.accessor( 'cena', {
			header: () => __( 'Cena/ks' ),
		} ),
		columnHelper.accessor( 'celkom', {
			header: () => __( 'Cena celkom' ),
		} ),

	];

	return (
		<>
			<CSVReader
				config={
					{ header: true }
				}
				onUploadAccepted={ ( results ) => {
					setData( results.data );
					console.log( results );
				} }
			>
				{ ( {
					getRootProps,
					acceptedFile,
					ProgressBar,
					getRemoveFileProps,
				} ) => (
					<>
						<div>
							<button type="button" className="urlslab-button active" { ...getRootProps() }>
								Browse file
							</button>
							<div>
								{ acceptedFile && acceptedFile.name }
							</div>
							<button className="urlslab-button" { ...getRemoveFileProps() }>
								Remove
							</button>
						</div>
						<ProgressBar />
					</>
				) }
			</CSVReader>
			{
				data
					? <Table columns={ columns } data={ data } />
					: null
			}
		</>
	);
}
