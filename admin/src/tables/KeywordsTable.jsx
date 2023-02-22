import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useInfiniteFetch from '../hooks/useInfiniteFetch';
import { handleInput, handleSelected } from '../constants/tableFunctions';
import { useFilter, useSorting } from '../hooks/urlConstructors';
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
	const { filters, currentFilters, addFilter, removeFilter } = useFilter();
	const { sortingColumn, sortBy } = useSorting();
	const activeFilters = Object.keys( currentFilters );

	const {
<<<<<<< HEAD
		data, status, isSuccess, isFetchingNextPage, hasNextPage, ref,
	} = useInfiniteFetch( { key: 'keyword', url: filters, pageId: 'kw_id' } );
=======
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'keyword', url: `${ filters }${ sortingColumn }`, pageId: 'kw_id' } );
>>>>>>> 91671a15e64d233664b046b54fc42c54ec3e91c7

	const keywordTypes = {
		M: __( 'Manual' ),
		I: __( 'Imported' ),
		X: __( 'None' ),
	};

	const header = {
		keyword: __( 'Keyword' ),
		kwType: __( 'Type' ),
		kw_length: __( 'Length' ),
		kw_priority: __( 'Priority' ),
		kw_usage_count: __( 'Usage' ),
		lang: __( 'Language' ),
		link_usage_count: __( 'Link Usage' ),
		urlFilter: __( 'URL Filter' ),
		urlLink: __( 'Link' ),
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
			header: () => header.keyword,
		} ),
		columnHelper.accessor( 'kwType', {
			cell: ( cell ) => <SortMenu items={ keywordTypes } name={ cell.column.id } checkedId={ cell.getValue() } onChange={ ( val ) => handleInput( val, cell ) } />,
			header: ( cell ) => <SortMenu items={ keywordTypes } name={ cell.column.id } checkedId={ header.kwType } onChange={ ( val ) => addFilter( 'kwType', val ) } />,
		} ),
		columnHelper.accessor( 'kw_length', {
			header: () => header.kw_length,
		} ),
		columnHelper.accessor( 'kw_priority', {
			header: () => <RangeSlider min="0" max="300" onChange={ ( r ) => console.log( r ) }>{ header.kw_priority }</RangeSlider>,
		} ),
		columnHelper.accessor( 'kw_usage_count', {
			header: () => header.kw_usage_count,
		} ),
		columnHelper.accessor( 'lang', {
			cell: ( val ) => <LangMenu checkedId={ val?.getValue() } onChange={ ( lang ) => console.log( lang ) } />,
			header: () => <LangMenu checkedId={ 'all' } onChange={ ( val ) => addFilter( 'lang', val ) } />,
		} ),
		columnHelper.accessor( 'link_usage_count', {
			header: () => header.link_usage_count,
		} ),
		columnHelper.accessor( 'urlFilter', {
			cell: ( cell ) => <InputField type="text" defaultValue={ cell.getValue() } onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => header.urlFilter,
		} ),
		columnHelper.accessor( 'urlLink', {
			cell: ( cell ) => <div className="limit-50">{ cell.getValue() }</div>,
			header: () => header.urlLink,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<TableViewHeaderBottom
				slug={ slug }
				currentFilters={ currentFilters }
				exportOptions={ {
					url: slug,
					fromId: 'from_kw_id',
					pageId: 'kw_id',
					deleteCSVCols: [ 'kw_id', 'destUrlMd5' ],
				} }
			>{ activeFilters.length > 0 &&
				<div className="flex flex-align-center">
					<strong>{ __( 'Filters:' ) }</strong>
					{ activeFilters.map( ( key ) => {
						return ( <button className="ml-s" key={ key } onClick={ ( ) => removeFilter( key ) }>{ header[ key ] }</button> );
					} ) }
				</div>
				}
<<<<<<< HEAD
			</TableViewHeaderBottom>

=======
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</TableViewHeaderBottom>
>>>>>>> 91671a15e64d233664b046b54fc42c54ec3e91c7
			<Table className="fadeInto"
				slug={ slug }
				columns={ columns }
				data={ isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] ) }>
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
