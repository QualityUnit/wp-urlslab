import { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
import { fetchData } from '../api/fetchData';
import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import RangeSlider from '../elements/RangeSlider';

export default function KeywordLinks( { settings } ) {
	const { __ } = useI18n();
	const { CSVReader } = useCSVReader( );
	const [ data, setData ] = useState( [] );
	const [ minmax, setMinMax ] = useState( [] );

	const columnHelper = createColumnHelper();

	const columns = [
		columnHelper.accessor( 'keyword', {
			header: () => __( 'Keyword' ),
		} ),
		columnHelper.accessor( 'url', {
			header: () => __( 'URL' ),
		} ),
		columnHelper.accessor( 'lang', {
			header: () => __( 'Language' ),
		} ),
		columnHelper.accessor( 'priority', {
			header: () => __( 'Priority' ),
		} ),
	];

	const handleRange = ( values ) => {
		setMinMax( values );
	};

	return (
		<>
			<CSVReader
				LocalChunkSize="1024"
				config={
					{ header: true,
						chunk: ( results, parser ) => {
							// setData( data.push( results.data ) );
							// console.log( results.data );
						},
					}
				}
				onUploadAccepted={ ( results ) => {
					setData( results.data );
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
						<ProgressBar className="progressbar" />
					</>
				) }
			</CSVReader>
			<RangeSlider min="0" max="3000" onChange={ ( vals ) => handleRange( vals ) }>Rows count</RangeSlider>
			{
				data.length
					? <Table columns={ columns } data={ data.slice( minmax.min, minmax.max ) } />
					: null
			}
		</>
	);
}
