import { useEffect, useMemo } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, SortBy, Checkbox, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, RowActionButtons, DateTimeFormat,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import DescriptionBox from '../elements/DescriptionBox';
import Button from '@mui/joy/Button';

import { postFetch } from '../api/fetching.js';
import { setNotification } from '../hooks/useNotifications.jsx';

const paginationId = 'violated_directive';
const optionalSelector = 'blocked_url_id';

const header = {
	violated_directive: __( 'Violated CSP Directive' ),
	blocked_url: __( 'Blocked URL/Domain' ),
	updated: __( 'Updated' ),
};

export default function CSPViolationsTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const { isSelected, selectRows, deleteRow } = useChangeRow( );

	const addToCSPSettings = async ( cell ) => {
		const { violated_directive, blocked_url_id } = cell?.row.original;
		setNotification( blocked_url_id, { message: __( 'Appending to CSP Settings…' ), status: 'info' } );

		const response = await postFetch( `security/add_to_csp_settings/${ violated_directive }/${ blocked_url_id }`, {} );
		const result = await response.json();

		if ( ! response?.ok ) {
			setNotification( blocked_url_id, { message: result?.message, status: 'error' } );
			return false;
		}
		setNotification( blocked_url_id, { message: result?.message, status: 'success' } );
	};

	useEffect( () => {
		useTableStore.setState( () => (
			{
				activeTable: slug,
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						paginationId,
						optionalSelector,
						slug,
						header,
						id: 'url',
					},
				},
			}
		) );
	}, [ slug ] );

	useEffect( () => {
		useTableStore.setState( () => (
			{
				tables: {
					...useTableStore.getState().tables,
					[ slug ]: {
						...useTableStore.getState().tables[ slug ],
						data,
					},
				},
			}
		) );
	}, [ data, slug ] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <Checkbox defaultValue={ isSelected( cell ) } onChange={ () => {
				selectRows( cell );
			} } />,
			header: ( head ) => <Checkbox defaultValue={ isSelected( head, true ) } onChange={ ( ) => {
				selectRows( head, true );
			} } />,
		} ),
		columnHelper.accessor( 'violated_directive', {
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 300,
		} ),
		columnHelper.accessor( 'blocked_url', {
			className: 'nolimit',
			tooltip: ( cell ) => cell.getValue(),
			header: ( th ) => <SortBy { ...th } />,
			minSize: 300,
		} ),
		columnHelper.accessor( 'updated', {
			cell: ( val ) => <DateTimeFormat datetime={ val.getValue() } />,
			header: ( th ) => <SortBy { ...th } />,
			minSize: 100,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => <RowActionButtons
				onDelete={ () => deleteRow( { cell } ) }
			>
				<Button
					size="xxs"
					onClick={ () => addToCSPSettings( cell ) }
				>
					{ __( 'Add To CSP Settings' ) }
				</Button>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ columnHelper, deleteRow, isSelected, selectRows ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of CSP (Content Security Policy) violations if you have enabled CSP violation reporting in the settings of this module.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>
			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				disableAddNewTableRecord
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
