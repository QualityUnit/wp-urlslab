import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { createColumnHelper } from '@tanstack/react-table';

import useInfiniteFetch from '../hooks/useInfiniteFetch';
import { useFilter, useSorting } from '../hooks/filteringSorting';
import { handleInput, handleSelected } from '../constants/tableFunctions';

import SortMenu from '../elements/SortMenu';
import Checkbox from '../elements/Checkbox';

import Loader from '../components/Loader';

import Table from '../components/TableComponent';
import ModuleViewHeaderBottom from '../components/ModuleViewHeaderBottom';

export default function LinkManagerTable( { slug } ) {
	const { __ } = useI18n();
	const columnHelper = createColumnHelper();
	const { filters, currentFilters, addFilter, removeFilter } = useFilter();
	const { sortingColumn, sortBy } = useSorting();

	const {
		data,
		status,
		isSuccess,
		isFetchingNextPage,
		hasNextPage,
		ref,
	} = useInfiniteFetch( { key: 'url', url: `${ filters }${ sortingColumn }`, pageId: 'urlMd5' } );

	const statusTypes = {
		N: __( 'New' ),
		A: __( 'Active' ),
		P: __( 'Pending' ),
		U: __( 'Updating' ),
		B: __( 'Not crawling' ),
		X: __( 'Blocked' ),
	};

	const visibilityTypes = {
		V: __( 'Visible' ),
		H: __( 'Hidden' ),
	};

	const header = {
		urlTitle: __( 'URL Title' ),
		urlMetaDescription: __( 'URL Description' ),
		screenshot_url: __( 'Screenshot' ),
		status: __( 'Status' ),
		urlName: __( 'URL' ),
		urlSummary: __( 'URL Summary' ),
		visibility: __( 'Visibility' ),
		updateStatusDate: __( 'Status Date' ),
		urlCheckDate: __( 'Check Date' ),
	};

	const columns = [
		columnHelper.accessor( 'check', {
			className: 'checkbox',
			cell: ( cell ) => <Checkbox checked={ cell.row.getIsSelected() } onChange={ ( val ) => {
				handleSelected( val, cell );
			} } />,
			header: () => __( '' ),
			enableResizing: false,
			maxSize: 24,
			size: 24,
		} ),
		columnHelper?.accessor( 'screenshot_url', {
			className: 'thumbnail',
			cell: ( image ) => image?.getValue()
				? <a href={ image?.getValue() } target="_blank" rel="noreferrer"><img src={ image?.getValue() } alt={ image.row.original.urlName } /></a>
				: <div className="img"></div>,
			header: () => header.screenshot_url,
		} ),
		columnHelper.accessor( 'urlTitle', {
			header: () => header.urlTitle,
			minSize: 250,
		} ),
		columnHelper?.accessor( 'urlMetaDescription', {
			cell: ( cell ) => <div className="limit-200">{ cell.getValue() }</div>,
			header: () => header.urlMetaDescription,
			minSize: 450,
		} ),
		columnHelper?.accessor( 'status', {
			cell: ( cell ) => <SortMenu
				items={ statusTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			className: 'youtube-status',
			header: () => header.status,
		} ),
		columnHelper.accessor( 'updateStatusDate', {
			header: () => header.updateStatusDate,
			minSize: 150,
		} ),
		columnHelper.accessor( 'urlName', {
			cell: ( cell ) => <a href={ cell.getValue() } title={ cell.getValue() } target="_blank" className="limit-100" rel="noreferrer">{ cell.getValue() }</a>,
			header: () => header.urlName,
			enableResizing: false,
			minSize: 350,
		} ),
		columnHelper.accessor( 'urlSummary', {
			cell: ( cell ) => <div className="limit-100">{ cell.getValue() }</div>,
			header: () => header.urlSummary,
			minSize: 350,
		} ),
		columnHelper.accessor( 'visibility', {
			cell: ( cell ) => <SortMenu
				items={ visibilityTypes }
				name={ cell.column.id }
				checkedId={ cell.getValue() }
				onChange={ ( val ) => handleInput( val, cell ) } />,
			header: () => header.visibility,
		} ),
		columnHelper.accessor( 'urlCheckDate', {
			header: () => header.urlCheckDate,
			minSize: 150,
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
					fromId: 'from_urlMd5',
					pageId: 'urlMd5',
					deleteCSVCols: [ 'urlId', 'urlMd5', 'domainId' ],
					perPage: 1000,
				} }
			>
				<div className="ma-left flex flex-align-center">
					<strong>Sort by:</strong>
					<SortMenu className="ml-s" items={ header } name="sorting" onChange={ ( val ) => sortBy( val ) } />
				</div>
			</ModuleViewHeaderBottom>
			<Table className="fadeInto" columns={ columns }
				resizable
				data={
					isSuccess && data?.pages?.flatMap( ( page ) => page ?? [] )
				}
			>
				<button ref={ ref }>{ isFetchingNextPage ? 'Loading more...' : hasNextPage }</button>
			</Table>
		</>
	);
}
