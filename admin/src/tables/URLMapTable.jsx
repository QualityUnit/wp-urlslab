import { useEffect, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n/';
import {
	useInfiniteFetch,
	SortBy,
	Loader,
	Table,
	ModuleViewHeaderBottom,
	TooltipSortingFiltering,
	Tooltip,
	IconButton,
	SvgIcon,
	RowActionButtons,
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';

const paginationId = 'src_url_id';
const optionalSelector = 'dest_url_id';

const header = {
	src_url_name: __( 'Source URL', 'wp-urlslab' ),
	dest_url_name: __( 'Destination URL', 'wp-urlslab' ),
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
			id: 'src_url_name',
			optionalSelector,
		} );
	}, [ setTable, slug ] );

	return init && <URLMapTable slug={ slug } />;
}

function URLMapTable( { slug } ) {
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

	const columns = useMemo( () => [
		columnHelper.accessor( 'src_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 500,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) => <a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: ( th ) => <SortBy { ...th } />,
			size: 500,
		} ),
		columnHelper.accessor( 'editRow', {
			className: 'editRow',
			cell: ( cell ) => {
				const { edit_src_url_name, edit_dest_url_name } = cell.row.original;
				return <RowActionButtons>
					{
						edit_src_url_name?.length > 0 && edit_src_url_name !== edit_dest_url_name &&
						<Tooltip title={ __( 'Edit Source Post', 'wp-urlslab' ) } arrow placement="bottom">
							<IconButton size="xs" component="a" href={ cell.row.original.edit_src_url_name } target="_blank">
								<SvgIcon name="edit-post" />
							</IconButton>
						</Tooltip>
					}

					{
						edit_dest_url_name?.length > 0 &&
						<Tooltip title={ __( 'Edit Destination Post', 'wp-urlslab' ) } arrow placement="bottom">
							<IconButton size="xs" component="a" href={ cell.row.original.edit_dest_url_name } target="_blank">
								<SvgIcon name="edit-post" />
							</IconButton>
						</Tooltip>
					}
				</RowActionButtons>;
			},
			header: () => null,
			size: 50,
		} ),
	], [ columnHelper ] );

	useEffect( () => {
		setTable( slug, { data } );
	}, [ data, setTable, slug ] );

	if ( isLoading ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table', 'wp-urlslab' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'Table shows links between source and destination URLs. Do you need to find e.g. all outgoing links from any post in your blog pointing to external domain? This is the right place.', 'wp-urlslab' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />

			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && tableData }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
