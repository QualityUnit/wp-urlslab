import {
	useInfiniteFetch, handleInput, handleSelected, RangeSlider, SortMenu, LangMenu, InputField, Checkbox, MenuInput, Trash, Loader, Table, ModuleViewHeaderBottom,
} from '../constants/tableImports';

import useTableUpdater from '../hooks/useTableUpdater';

export default function URLRelationTable( { slug } ) {
	const { tableHidden, setHiddenTable, filters, currentFilters, addFilter, removeFilters, sortingColumn, sortBy, deleteRow, updateRow } = useTableUpdater();

	const url = `${ filters }${ sortingColumn }`;
	const pageId = 'srcUrlMd5';

	const {
		__,
		columnHelper,
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: slug, url, pageId } );

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
			header: null,
		} ),
		columnHelper.accessor( 'srcUrlName', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter Source URL Name" defaultValue={ currentFilters.srcUrlName } onChange={ ( val ) => addFilter( 'srcUrlName', val ) }>{ header.srcUrlName }</MenuInput>,
			size: 400,
		} ),
		columnHelper.accessor( 'pos', {
			header: () => <RangeSlider isFilter min="0" max="255" onChange={ ( r ) => console.log( r ) }>{ header.pos }</RangeSlider>,
			size: 80,
		} ),
		columnHelper.accessor( 'destUrlName', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => <MenuInput isFilter placeholder="Enter Destination URL Name" defaultValue={ currentFilters.destUrlName } onChange={ ( val ) => addFilter( 'destUrlName', val ) }>{ header.destUrlName }</MenuInput>,
			size: 400,
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
				removeFilters={ ( key ) => removeFilters( key ) }
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
