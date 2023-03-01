import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useInfiniteFetch from '../hooks/useInfiniteFetch';
import { handleInput, handleSelected } from '../constants/tableFunctions';

import SortMenu from '../elements/SortMenu';
import Checkbox from '../elements/Checkbox';

import Loader from '../components/Loader';

import Table from '../components/TableComponent';
import ModuleViewHeaderBottom from '../components/ModuleViewHeaderBottom';

export default function URLRelationTable() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const [ currentUrl, setUrl ] = useState();

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'url-relation', url: currentUrl, pageId: 'srcUrlMd5' } );

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'srcUrlName', {
			header: () => __( 'Source URL Name' ),
		} ),
		columnHelper.accessor( 'pos', {
			header: () => __( 'Position' ),
		} ),
		columnHelper.accessor( 'destUrlName', {
			header: () => __( 'Destination URL Name' ),
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<Table className="fadeInto" columns={ columns }
			data={
				isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
			}
		>
			<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
		</Table>
	);
}
