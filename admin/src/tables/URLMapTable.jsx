import { useEffect, useMemo } from 'react';
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
	SvgIcon
} from '../lib/tableImports';

import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import Stack from "@mui/joy/Stack";

const paginationId = 'src_url_id';
const optionalSelector = 'dest_url_id';

const header = {
	src_url_name: __( 'Source URL' ),
	dest_url_name: __( 'Destination URL' ),
};

export default function URLMapTable( { slug } ) {
	const {
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		ref,
	} = useInfiniteFetch( { slug } );

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
						id: 'src_url_name',
						optionalSelector,
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
		columnHelper.accessor( 'src_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) =>
				(
					<Stack direction="row" alignItems="center" spacing={ 1 }><>
						{
							<a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>
						}
						{
							cell.row.original.edit_src_url_name?.length > 0 &&
							<Tooltip title={ __( 'Edit Post' ) }>
								<IconButton size="xs" component="a" href={ cell.row.original.edit_src_url_name } target="_blank">
									<SvgIcon name="edit" />
								</IconButton>
							</Tooltip>
						}
					</>
					</Stack>
				),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
		columnHelper.accessor( 'dest_url_name', {
			tooltip: ( cell ) => cell.getValue(),
			cell: ( cell ) =>
				(
					<Stack direction="row" alignItems="center" spacing={ 1 }><>
						{
							<a href={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>
						}
						{
							cell.row.original.edit_dest_url_name?.length > 0 &&
							<Tooltip title={ __( 'Edit Post' ) }>
								<IconButton size="xs" component="a" href={ cell.row.original.edit_dest_url_name } target="_blank">
									<SvgIcon name="edit" />
								</IconButton>
							</Tooltip>
						}
					</>
					</Stack>
				),
			header: ( th ) => <SortBy { ...th } />,
			size: 200,
		} ),
	], [ columnHelper ] );

	if ( status === 'loading' ) {
		return <Loader isFullscreen />;
	}

	return (
		<>
			<DescriptionBox	title={ __( 'About this table' ) } tableSlug={ slug } isMainTableDescription>
				{ __( 'Table shows links between source and destination URLs. Do you need to find e.g. all outgoing links from any post in your blog pointing to external domain? This is the right place.' ) }
			</DescriptionBox>
			<ModuleViewHeaderBottom />

			<Table className="fadeInto"
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }
				referrer={ ref }
				loadingRows={ isFetchingNextPage }
			>
				<TooltipSortingFiltering />
			</Table>
		</>
	);
}
