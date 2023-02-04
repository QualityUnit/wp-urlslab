import { useState, useRef } from 'react';
import { useCSVReader } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetchData';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';

export default function KeywordLinks( { settings } ) {
	const { CSVReader } = useCSVReader();
	return (
		<CSVReader
			onUploadAccepted={ ( results ) => {
				console.log( '---------------------------' );
				console.log( results );
				console.log( '---------------------------' );
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
						<button type="button" { ...getRootProps() }>
							Browse file
						</button>
						<div>
							{ acceptedFile && acceptedFile.name }
						</div>
						<button { ...getRemoveFileProps() }>
							Remove
						</button>
					</div>
					<ProgressBar />
				</>
			) }
		</CSVReader>
	);
}
