import { useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useCSVReader, useCSVDownloader } from 'react-papaparse';
import { fetchData, setData } from '../api/fetching';
import Loader from '../components/Loader';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';
import Table from '../components/TableComponent';

export default function KeywordLinks() {
	const { __ } = useI18n();
	const { CSVReader } = useCSVReader();
	const { CSVDownloader, Type } = useCSVDownloader();
	const queryClient = useQueryClient();
	const columnHelper = createColumnHelper();
	const { ref, inView } = useInView();

	const [ csvMessage, setCSVMessage ] = useState( null );
	const maxRows = 50;

	const {
		data,
		status,
		isFetching,
		isSuccess,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery( [ 'tableKeyword' ],
		( { pageParam = '' } ) => {
			return fetchData( `keyword?from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
		},
		{
			getNextPageParam: ( allRows ) => {
				const lastRowId = allRows[ allRows?.length - 1 ]?.kw_id ?? undefined;
				return lastRowId;
			},
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			cacheTime: Infinity,
			staleTime: Infinity,
		}
	);

	useEffect( () => {
		if ( inView ) {
			fetchNextPage();
		}
	}, [ inView, fetchNextPage ] );

	const exportCSV = ( dataForProcessing ) => {
		const dataForCSV = dataForProcessing;
		for ( const obj of dataForCSV ) {
			delete obj.kw_id;
			delete obj.destUrlMd5;
		}
		return dataForCSV;
	};

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

	if ( status === 'loading' ) {
		return <Loader />;
	}

	const columns = [
		columnHelper.accessor( 'check', {
			cell: ( ) => <Checkbox />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'keyword', {
			cell: ( val ) => <InputField type="text" defaultValue={ val.getValue() } />,
			header: () => __( 'Keyword' ),
		} ),
		columnHelper.accessor( 'kwType', {
			header: () => __( 'Keyword Type' ),
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => __( 'Keyword Length' ),
		} ),
		columnHelper.accessor( 'kw_priority', {
			header: () => __( 'Keyword Priority' ),
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => __( 'Keyword Usage' ),
		} ),
		columnHelper.accessor( 'lang', {
			header: () => __( 'Language' ),
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: () => __( 'Link Usage' ),
		} ),
		columnHelper.accessor( 'urlFilter', {
			cell: ( val ) => <InputField type="text" defaultValue={ val.getValue() } />,
			header: () => __( 'URL Filter' ),
		} ),
		columnHelper.accessor( 'urlLink', {
			cell: ( val ) => <InputField type="url" defaultValue={ val.getValue() } />,
			header: () => __( 'Keyword Link' ),
		} ),
	];

	return (
		<div>
			<div className="">
				{ /* <CSVReader
					LocalChunkSize="1024"
					config={
						{
							header: true,
							chunk: ( results, parser ) => {
							},
						}
					}
					onUploadAccepted={ ( results ) => {
						importLocal( results.data );
					// console.log( results.data );
					// importData.mutate( results );
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
							{ csvMessage }
							<ProgressBar className="progressbar" />
						</>
					) }
				</CSVReader> */ }
				{ /* <CSVDownloader
					className="urlslab-button active"
					type={ Type.Button }
					filename={ 'keywords_downloaded' }
					bom={ true }
					config={
						{
							delimiter: ',',
						}
					}
					data={ exportCSV( data?.pages?.flatMap( ( page ) => page ?? [] ) ) }
				>
					Download CSV
				</CSVDownloader> */ }
			</div>
			<Table columns={ columns }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<div>
					<button
						ref={ ref }
						onClick={ () => fetchNextPage() }
						disabled={ ! hasNextPage || isFetchingNextPage }
					>
						{ isFetchingNextPage
							? 'Loading more...'
							: hasNextPage
								? 'Load Newer'
								: 'Nothing more to load' }
					</button>
				</div>
				<div>
					{ isFetching && ! isFetchingNextPage
						? 'Background Updating...'
						: null }
				</div>
			</Table>
		</div>

	);
}
