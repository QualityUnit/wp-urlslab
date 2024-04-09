import { memo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import Button from '@mui/joy/Button';

import { filtersArray } from '../hooks/useFilteringSorting';
import useTableStore from '../hooks/useTableStore';
import useTablePanels from '../hooks/useTablePanels';
import useCloseModal from '../hooks/useCloseModal';

import ExportCSVButton from '../elements/ExportCSVButton';
import ProgressBar from '../elements/ProgressBar';
import useColumnTypesQuery from '../queries/useColumnTypesQuery';

function ExportPanel( props ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const slug = useTableStore( ( state ) => state.activeTable );
	const filters = useTableStore().useFilters();
	let fetchOptions = useTableStore().useFetchOptions();
	if ( props.fetchOptions && Object.keys( fetchOptions ).length === 0 ) {
		fetchOptions = props.fetchOptions;
	}
	const paginationId = useTableStore( ( state ) => state.tables[ slug ]?.paginationId );
	const { columnTypes } = useColumnTypesQuery( slug );
	const data = useTableStore( ( state ) => state.tables[ slug ]?.data?.pages?.flat() );
	const deleteCSVCols = useTablePanels( ( state ) => state.deleteCSVCols );
	const header = useTableStore( ( state ) => state.tables[ slug ]?.header );
	const activefilters = filters ? Object.keys( filters ) : null;
	const [ exportStatus, setExportStatus ] = useState();
	const stopFetching = useRef( false );

	const counter = queryClient.getQueryData( [ slug, `count`, filtersArray( filters ), fetchOptions ] );

	// eslint-disable-next-line no-unused-vars
	const cellsWithLegend = Object.entries( columnTypes ).filter( ( [ key, column ] ) => column.type === 'menu' || column.type === 'enum' );
	const { CloseIcon, handleClose } = useCloseModal( );

	const hidePanel = ( ) => {
		stopFetching.current = true;
		handleClose();
	};

	const handleExportStatus = ( val ) => {
		setExportStatus( val );
		if ( val === 100 ) {
			setTimeout( () => {
				setExportStatus();
				hidePanel();
			}, 1000 );
		}
	};

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Export data', 'urlslab' ) }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>
				{ ( ( activefilters?.length > 0 || cellsWithLegend?.length > 0 ) && header ) &&
				<div className="urlslab-panel-section">
					{ cellsWithLegend?.length > 0 &&
						<>
							<p><strong>{ __( 'Legend for values:', 'urlslab' ) }</strong></p>
							<p>
								<ul className="columns-2">
									{
										cellsWithLegend?.map( ( cell ) => {
											const cellKey = cell[ 0 ];
											const cellLegend = cell[ 1 ]?.values;
											return <li key={ cellKey } style={ { breakInside: 'avoid-column', display: 'table' } }>
												{ `${ header[ cellKey ] } (${ cellKey })` }

												<ul className={ `pl-s ${ Object.keys( cellLegend ).length > 8 ? 'scrollBarArea mb-s' : '' }` } style={ { maxHeight: `${ Object.keys( cellLegend ).length > 8 ? '5.5em' : null }` } }>
													{ Object.entries( cellLegend ).map( ( [ key, val ] ) => {
														return <li key={ key }>{ `${ key } – ${ val }` }</li>;
													} ) }
												</ul>
											</li>;
										} )
									}
								</ul>
							</p>
						</>
					}
					{ activefilters?.length > 0 &&
						<>
							<p><strong>{ __( 'Active filters:', 'urlslab' ) }</strong></p>
							<p>
								<ul className="columns-2">
									{ activefilters.map( ( key ) => {
										return ( <li key={ key }>{ header[ key ] }</li> );
									} ) }
								</ul>
							</p>
						</>
					}
				</div>
				}
				<div className="mt-l">
					{ exportStatus
						? <ProgressBar className="mb-m" notification="Exporting…" value={ exportStatus } />
						: null
					}
					<div className="flex">
						<Button variant="plain" color="neutral" onClick={ hidePanel } sx={ { ml: 'auto' } }>{ __( 'Cancel', 'urlslab' ) }</Button>
						<ExportCSVButton
							options={ { ...props, slug, filters, fetchOptions, data, counter, paginationId, deleteCSVCols, stopFetching } } onClick={ handleExportStatus }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( ExportPanel );
