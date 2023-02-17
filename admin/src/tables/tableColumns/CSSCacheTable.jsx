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
		columnHelper?.accessor( 'url_id', {
			header: () => __( 'URL Id' ),
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
		columnHelper?.accessor( 'filesize', {
			header: () => __( 'Filesize' ),
		} ),
		columnHelper?.accessor( 'status_changed', {
			header: () => __( 'Status changed' ),
		} ),
		columnHelper?.accessor( 'url', {
			header: () => __( 'URL' ),
		} ),
	];
}
