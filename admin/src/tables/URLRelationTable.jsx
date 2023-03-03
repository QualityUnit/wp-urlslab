import {
	useState, useI18n, createColumnHelper, useInfiniteFetch, useFilter, useSorting, handleInput, handleSelected, RangeSlider, SortMenu, LangMenu, InputField, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

export default function URLRelationTable( { slug } ) {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const { filters, currentFilters, addFilter, removeFilter } = useFilter();
	const { sortingColumn, sortBy } = useSorting();
	const [ tableHidden, setHiddenTable ] = useState( false );

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'url-relation', url: `${ filters }${ sortingColumn }`, pageId: 'srcUrlMd5' } );

	const header = {
		srcUrlMd5: '',
		srcUrlName: __( 'Source URL Name' ),
		pos: __( 'Position' ),
		destUrlName: __( 'Destination URL Name' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
		} ),
		columnHelper.accessor( 'srcUrlName', {
			header: () => header.srcUrlName,
		} ),
		columnHelper.accessor( 'pos', {
			header: () => header.pos,
		} ),
		columnHelper.accessor( 'destUrlName', {
			header: () => header.destUrlName,
		} ),
	];

	if ( status === 'loading' ) {
		return <Loader />;
	}

	return (
		<>
			<ModuleViewHeaderBottom
				slug={ slug }
				currentFilters={ currentFilters }
				header={ header }
				removedFilter={ ( key ) => removeFilter( key ) }
				exportOptions={ {
					url: slug,
					filters,
					fromId: 'from_srcUrlMd5',
					pageId: 'srcUrlMd5',
					deleteCSVCols: [ 'srcUrlMd5', 'destUrlMd5' ],
				} }
				hideTable={ ( hidden ) => setHiddenTable( hidden ) }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
			{ tableHidden
				? null
				: <Table className="fadeInto" columns={ columns }
					data={
						isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
					}
				>
					<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
				</Table>
			}
		</>
	);
}
