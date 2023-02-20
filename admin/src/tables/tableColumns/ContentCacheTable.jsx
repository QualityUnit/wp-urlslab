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
		columnHelper.accessor( 'date_changed', {
			header: () => __( 'Changed at' ),
		} ),
		columnHelper.accessor( 'cache_len', {
			header: () => __( 'Cache size' ),
		} ),
		columnHelper.accessor( 'cache_content', {
			cell: ( cell ) => <div className="limit-200">{ cell?.getValue() }</div>,
			header: () => __( 'Cache content' ),
		} ),
	];
}
