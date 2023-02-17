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
		columnHelper?.accessor( 'filename', {
			header: () => __( 'File Name' ),
		} ),
		columnHelper?.accessor( 'filetype', {
			header: () => __( 'File Type' ),
		} ),
		columnHelper?.accessor( 'status_changed', {
			header: () => __( 'Status changed' ),
		} ),
		columnHelper?.accessor( 'filestatus', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => __( 'Status' ),
		} ),
		columnHelper?.accessor( 'height', {
			header: () => __( 'Height' ),
		} ),
		columnHelper?.accessor( 'width', {
			header: () => __( 'Width' ),
		} ),
		columnHelper?.accessor( 'filesize', {
			header: () => __( 'File Size' ),
		} ),
		columnHelper?.accessor( 'file_usage_count', {
			header: () => __( 'File Usage' ),
		} ),
		columnHelper?.accessor( 'url', {
			header: () => __( 'URL' ),
		} ),
	];
}
