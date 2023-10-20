import { useEffect } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import {
	Checkbox,
	DateTimeFormat,
	Loader,
	ModuleViewHeaderBottom,
	ProgressBar,
	RowActionButtons,
	SortBy,
	Table,
	TooltipSortingFiltering,
	useInfiniteFetch,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';

export default function GeneratorProcessesTable( { slug } ) {
	const { __ } = useI18n();
	const paginationId = 'task_id';

	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow } = useChangeRow( );

	const generatorType = {
		S: __( 'Shortcode' ),
		P: __( 'Post creation' ),
		F: __( 'FAQ Answer Generation' ),
	};

	const generatorStatus = {
		N: __( 'New' ),
		P: __( 'Processing' ),
		A: __( 'Done' ),
		D: __( 'Failed' ),
	};

	const header = {
		task_id: __( 'ID' ),
		generator_type: __( 'Generator type' ),
		task_status: __( 'Status' ),
		task_data: __( 'Task data' ),
		result_log: __( 'Result' ),
		updated: __( 'Last change' ),
	};

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						paginationId,
						slug,
						header,
						id: 'template_id',
					},
				},
			}
		) );
	}, [ slug ] );

	// Saving all variables into state managers
	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: { ...useTableStore.getState().tables, [ slug ]: { ...useTableStore.getState().tables[ slug ], data } },
			}
		) );
	}, [ data, slug ] );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ head.table.getIsAllPageRowsSelected() } onChange={ ( val ) => {
				head.table.toggleAllPageRowsSelected( val );
			} } />,
		} ),
		columnHelper.accessor( 'task_id', {
			className: 'nolimit',
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'generator_type', {
			cell: ( cell ) => generatorType[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'task_status', {
			className: 'nolimit',
			cell: ( cell ) => generatorStatus[ cell.getValue() ],
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'task_data', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'result_log', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => cell?.row?.original.generator_type === 'P' ? <a href={ cell.getValue() }>{ cell.getValue() }</a> : cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			size: 100,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			size: 80,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell, id: 'task_id' } ) }
			>
			</RowActionButtons>,
			header: () => null,
			size: 0,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The AI Generator operates by producing content through a background process. Table displays a list of scheduled tasks and currently running background tasks, which are awaiting content results from the generator. After the content has been successfully generated, the respective task is immediately removed from the list.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referer={ ref }
			>
				<TooltipSortingFiltering />
				<>
					{ isFetchingNextPage ? '' : hasNextPage }
					<ProgressBar className="infiniteScroll" value={ ! isFetchingNextPage ? 0 : 100 } />
				</>
			</Table>
		</>
	);
}
