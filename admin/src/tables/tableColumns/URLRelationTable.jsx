import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import { handleSelected } from '../../constants/tableFunctions';
import Checkbox from '../../elements/Checkbox';

export default function Columns() {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();

	return [
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
}
