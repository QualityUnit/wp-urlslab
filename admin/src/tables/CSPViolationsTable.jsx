import { useEffect, useMemo, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n/';

import {
	useInfiniteFetch, SortBy, Loader, Table, ModuleViewHeaderBottom, TooltipSortingFiltering, RowActionButtons, DateTimeFormat, TableSelectCheckbox,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import useChangeRow from '../hooks/useChangeRow';
import DescriptionBox from '../elements/DescriptionBox';
import Button from '@mui/joy/Button';

import { postFetch } from '../api/fetching.js';
import { setNotification } from '../hooks/useNotifications.jsx';

const paginationId = 'blocked_url_id';
const optionalSelector = 'violated_directive';

const header = {
	violated_directive: __( 'Violated CSP Directive', 'urlslab' ),
	blocked_url: __( 'Blocked URL/Domain', 'urlslab' ),
	updated: __( 'Updated', 'urlslab' ),
};

// init table state with fixed states which we do not need to update anymore during table lifecycle
export default function TableInit( { slug } ) {
	const setTable = useTableStore( ( state ) => state.setTable );
	const [ init, setInit ] = useState( false );
	useEffect( () => {
		setInit( true );
		setTable( slug, {
			paginationId,
			slug,
			header,
			id: 'url',
			optionalSelector,
		} );
	}, [ setTable, slug ] );

	return init && <CSPViolationsTable slug={ slug } />;
}

function CSPViolationsTable( { slug } ) {
	const {
		columnHelper,
		data,
		isLoading,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

	const tableData = useMemo( () => data?.pages?.flatMap( ( page ) => page ?? [] ), [ data?.pages ] );
	const setTable = useTableStore( ( state ) => state.setTable );

	const { deleteRow } = useChangeRow( );

	const addToCSPSettings = useCallback( async ( cell ) => {
		const { violated_directive, blocked_url_id } = cell?.row.original;
		setNotification( blocked_url_id, { message: __( 'Appending to CSP Settings…', 'urlslab' ), status: 'info' } );

		const response = await postFetch( `security/add_to_csp_settings/${ violated_directive }/${ blocked_url_id }`, {} );
		const result = await response.json();

		if ( ! response?.ok ) {
			setNotification( blocked_url_id, { message: result?.message, status: 'error' } );
			return false;
		}
		setNotification( blocked_url_id, { message: result?.message, status: 'success' } );
	}, [] );

	const columns = useMemo( () => [
		columnHelper.accessor( 'check', {
			className: 'nolimit checkbox',
			cell: ( cell ) => <TableSelectCheckbox tableElement={ cell } />,
			header: ( head ) => <TableSelectCheckbox tableElement={ head } />,
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
				onDelete={ () => deleteRow( { cell, optionalSelector } ) }
			>
				<Button
					size="xxs"
					onClick={ () => addToCSPSettings( cell ) }
				>
					{ __( 'Add To CSP Settings', 'urlslab' ) }
				</Button>
			</RowActionButtons>,
			header: null,
			size: 0,
		} ),
	], [ addToCSPSettings, columnHelper, deleteRow ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'The table displays a list of CSP (Content Security Policy) violations if you have enabled CSP violation reporting in the settings of this module.', 'urlslab' ) }
			</DescriptionBox>

			<ModuleViewHeaderBottom
				noImport
				noInsert
			/>

			<Table
				className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
				disableAddNewTableRecord
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
