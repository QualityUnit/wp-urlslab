import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchData } from '../../api/fetching';

import { handleInput, handleSelected } from '../../constants/tableFunctions';
import SortMenu from '../../elements/SortMenu';
import LangMenu from '../../elements/LangMenu';
import InputField from '../../elements/InputField';
import Checkbox from '../../elements/Checkbox';

export default function Columns() {
	const queryClient = useQueryClient();
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const maxRows = 50;

	const refetch = () => {
		queryClient.fetchInfiniteQuery( {
			queryKey: [ 'keyword' ],
			queryFn: ( { pageParam = 0 } ) => {
				return fetchData( `keyword?sort_column=kw_length&from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
			},
			getNextPageParam: ( allRows ) => {
				if ( allRows.length < maxRows ) {
					return undefined;
				}
				const lastRowId = allRows[ allRows?.length - 1 ]?.kw_id ?? undefined;
				return lastRowId;
			},
		} );
	};

	const sortPrio = () => {
		queryClient.fetchInfiniteQuery( {
			queryKey: [ 'keyword' ],
			queryFn: ( { pageParam = 0 } ) => {
				return fetchData( `keyword?sort_column=kw_priority&from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
			},
			getNextPageParam: ( allRows ) => {
				if ( allRows.length < maxRows ) {
					return undefined;
				}
				const lastRowId = allRows[ allRows?.length - 1 ]?.kw_id ?? undefined;
				return lastRowId;
			},
		} );
	};

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	return [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'keyword', {
			header: () => __( 'Keyword' ),
		} ),
		columnHelper.accessor( 'kwType', {
			cell: ( cell ) => <SortMenu
				items={ keywordTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) }
			/>,
			header: () => __( 'Keyword Type' ),
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => <button onClick={ refetch }>{ __( 'Keyword Length' ) }</button>,
		} ),
		columnHelper.accessor( 'kw_priority', {
			header: () => <button onClick={ sortPrio }>{ __( 'Keyword Priority' ) }</button>,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => __( 'Keyword Usage' ),
		} ),
		columnHelper.accessor( 'lang', {
			cell: ( val ) => <LangMenu checkedId={ val?.getValue() } onChange={ ( lang ) => console.log( lang ) } />,
			header: () => __( 'Language' ),
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: () => __( 'Link Usage' ),
		} ),
		columnHelper.accessor( 'urlFilter', {
			cell: ( cell ) => <InputField type="text"
				defaultValue={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) }
			/>,
			header: () => __( 'URL Filter' ),
		} ),
		columnHelper.accessor( 'urlLink', {
			header: () => __( 'Keyword Link' ),
		} ),
	];
}
