import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import { handleInput, handleSelected } from '../../constants/tableFunctions';
import SortMenu from '../../elements/SortMenu';
import Checkbox from '../../elements/Checkbox';

export default function Columns() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Available' ),
		P: __( 'Processing' ),
		D: __( 'Disabled' ),
	};

	return [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'urlTitle', {
			header: () => __( 'URL Title' ),
		} ),
		columnHelper.accessor( 'urlName', {
			header: () => __( 'URL' ),
		} ),
		columnHelper?.accessor( 'urlMetaDescription', {
			header: () => __( 'URL Description' ),
		} ),
		columnHelper?.accessor( 'status', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			className: 'youtube-status',
			header: () => __( 'Status' ),
		} ),
		columnHelper.accessor( 'updateStatusDate', {
			header: () => __( 'Status Date' ),
		} ),
	];
}
