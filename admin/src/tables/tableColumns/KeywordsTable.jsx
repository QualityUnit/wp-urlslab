import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';
import { useInfiniteFetch } from '../../constants/hooks';
import { fetchData } from '../../api/fetching';

import { handleInput, handleSelected } from '../../constants/tableFunctions';
import SortMenu from '../../elements/SortMenu';
import LangMenu from '../../elements/LangMenu';
import InputField from '../../elements/InputField';
import Checkbox from '../../elements/Checkbox';

export const sortPrio = async ( url ) => {
	return await new Promise( ( resolve, reject ) => {
		resolve( url );
	} );
};

export default function Columns( ) {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const maxRows = 50;

	// const fetched = useInfiniteFetch( { key: 'keyword', pageId: 'kw_id' } );
	// console.log( useInfiniteFetch( { key: 'keyword', pageId: 'kw_id' } ) );

	// result();

	// const refetch = async () => {
	// 	try {
	// 		const data = await queryClient.fetchInfiniteQuery( {
	// 			queryKey: [ 'keyword' ],
	// 			queryFn: ( { pageParam = 0 } ) => {
	// 				return fetchData( `keyword?sort_column=kw_length&from_kw_id=${ pageParam }&rows_per_page=${ maxRows }` );
	// 			},
	// 		} );
	// 		return data;
	// 	} catch ( error ) {
	// 		return error;
	// 	}
	// };

	// console.log( refetch() );

	// refetch().then( ( d ) => console.log( d.pages ) );

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const cols = [
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
			header: () => <button onClick={ () => sortPrio( 'sort_column=kw_length' ) }>{ __( 'Keyword Length' ) }</button>,
		} ),
		columnHelper.accessor( 'kw_priority', {
			header: () => <button onClick={ () => sortPrio( 'sort_column=kw_priority' ) }>{ __( 'Keyword Priority' ) }</button>,
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

	return { columns: cols };
}
