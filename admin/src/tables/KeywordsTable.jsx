import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useInfiniteFetch from '../hooks/useInfiniteFetch';
import { handleInput, handleSelected } from '../constants/tableFunctions';
import RangeSlider from '../elements/RangeSlider';
import SortMenu from '../elements/SortMenu';
import LangMenu from '../elements/LangMenu';
import InputField from '../elements/InputField';
import Checkbox from '../elements/Checkbox';

import Loader from '../components/Loader';

import Table from '../components/TableComponent';
import TableViewHeaderBottom from '../components/TableViewHeaderBottom';

export default function KeywordsTable( { slug } ) {
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
	} = useInfiniteFetch( { key: 'keyword', url: currentUrl, pageId: 'kw_id' } );

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const columns = [
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
			header: ( cell ) => <SortMenu
				items={ keywordTypes }
				name={ cell.column.id }
				checkedId={ __( 'Keyword Type' ) }
				onChange={ ( val ) => setUrl( val ) }
			/>,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => <button onClick={ () => setUrl( 'sort_column=kw_length' ) }>{ __( 'Keyword Length' ) }</button>,
		} ),
		columnHelper.accessor( 'kw_priority', {
			header: () => <><button onClick={ () => setUrl( 'sort_direction=DESC&sort_column=kw_priority' ) }>^</button><RangeSlider min="0" max="300" onChange={ ( r ) => console.log( r ) }>{ __( 'Keyword Priority' ) }</RangeSlider></>,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => __( 'Keyword Usage' ),
		} ),
		columnHelper.accessor( 'lang', {
			cell: ( val ) => <LangMenu checkedId={ val?.getValue() } onChange={ ( lang ) => console.log( lang ) } />,
			header: ( ) => <LangMenu checkedId={ 'all' } onChange={ ( lang ) => setUrl( `filter_lang=${ lang }` ) } />,
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
			cell: ( cell ) => <div className="limit-50">{ cell.getValue() }</div>,
			header: () => __( 'Keyword Link' ),
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<TableViewHeaderBottom
				slug={ slug }
				exportOptions={ {
					url: slug,
					fromId: 'from_kw_id',
					pageId: 'kw_id',
					deleteCSVCols: [ 'kw_id', 'destUrlMd5' ],
				} }
			/>
			<Table className="fadeInto"
				slug={ slug }
				columns={ columns }
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
