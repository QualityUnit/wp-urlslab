import { memo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@mui/joy/Button';

import { fetchDataForProcessing } from '../api/fetchDataForProcessing';
import useCloseModal from '../hooks/useCloseModal';
import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import useTags from '../hooks/useTags';
import { filtersArray } from '../hooks/useFilteringSorting';

import { operatorTypes } from '../lib/filterOperators';
import { dateWithTimezone, langName } from '../lib/helpers';

import ProgressBar from '../elements/ProgressBar';
import SvgIcon from '../elements/SvgIcon';
import DateTimeFormat from '../elements/DateTimeFormat';
import Tag from '../elements/Tag';

function DeleteFilteredPanel( ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { tagsData } = useTags();
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const filters = useTableStore( ( state ) => state.tables[ activeTable ]?.filters || {} );
	const fetchOptions = useTableStore( ( state ) => state.tables[ activeTable ]?.fetchOptions || {} );
	const header = useTableStore( ( state ) => state.tables[ activeTable ]?.header );
	const slug = activeTable;
	const paginationId = useTableStore( ( state ) => state.tables[ activeTable ]?.paginationId );
	const optionalSelector = useTableStore( ( state ) => state.tables[ activeTable ]?.optionalSelector );
	const activefilters = filters ? Object.keys( filters ) : null;
	const [ deleteStatus, setDeleteStatus ] = useState();
	const deleteDisabled = useRef();
	const stopFetching = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal();
	const { deleteMultipleRows } = useChangeRow();

	const counter = queryClient.getQueryData( [ slug, `count`, filtersArray( filters ), fetchOptions ] );

	const hidePanel = ( ) => {
		stopFetching.current = true;

		handleClose();
	};

	const handleDeleteStatus = ( val ) => {
		setDeleteStatus( val );
		deleteDisabled.current = true;
		if ( val === 100 ) {
			setTimeout( () => {
				setDeleteStatus();
				deleteDisabled.current = false;
				hidePanel( 'delete-filtered' );
			}, 100 );
		}
	};

	const handleDelete = () => {
		handleDeleteStatus( 1 );
		fetchDataForProcessing( { slug, filters, counter, paginationId, optionalSelector, deleteFiltered: true, stopFetching }, ( response ) => handleDeleteStatus( response.progress ) ).then( ( response ) => {
			if ( response.status === 'done' ) {
				const { data: rowsToDelete } = response;
				deleteMultipleRows( { rowsToDelete, optionalSelector, updateAll: true } );
			}
		} );
	};

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Delete All Filtered?' ) }</h3>
					<button className="urlslab-panel-close" onClick={ hidePanel }>
						<CloseIcon />
					</button>
				</div>
				<p>{ __( 'Are you sure you want to delete all filtered rows? Deleting rows will remove them from all modules where this table occurs.' ) }</p>
				<div className="urlslab-panel-section">
					<p><strong>{ __( 'Active filters:' ) }</strong></p>
					<p>
						<ul className="columns-2">
							{ activefilters.map( ( key ) => {
								const isDate = filters[ key ]?.keyType === 'date' && true;
								const keyWithoutId = key?.replace( /(.+?)@\d+/g, '$1' );
								let filterValue = filters[ key ]?.val;
								if ( isDate ) {
									const { correctedDate } = dateWithTimezone( filterValue );
									filterValue = new Date( correctedDate );
								}

								return (
									<li key={ key } className="flex flex-align-center">
										{ header[ keyWithoutId ] }:&nbsp;
										<span className="regular normal fs-xs flex flex-align-center">
											<span>{ operatorTypes[ filters[ key ]?.keyType ][ filters[ key ]?.op ] }</span>
											&nbsp;

											{ keyWithoutId === 'labels'
												? tagsData.map( ( tag ) => {
													if ( tag.label_id.toString() === filterValue.replace( /\|(\d+)\|/g, '$1' ) ) {
														const { label_id, name, bgcolor } = tag;
														return <Tag key={ label_id } size="sm" color={ bgcolor } fitText thinFont>{ name }</Tag>;
													}
													return null;
												} )
												: <>“<span className="limit-20">
													{ filters[ key ]?.op === 'BETWEEN' &&
														`min: ${ filterValue.min }, max: ${ filterValue.max }`
													}

													{ keyWithoutId === 'lang' &&
														langName( filters?.lang?.val )
													}

													{ ( filters[ key ]?.op !== 'BETWEEN' && keyWithoutId !== 'lang' && keyWithoutId !== 'labels' ) &&
														filters[ key ]?.filterValMenu
														? filters[ key ]?.filterValMenu[ filterValue.toString() ]
														: filters[ key ]?.op !== 'BETWEEN' && ( ( ! isDate && filterValue.toString() ) || ( isDate && <DateTimeFormat oneLine datetime={ filterValue } /> ) )
													}
												</span>”</>
											}
										</span>
									</li>
								);
							} ) }
						</ul>
					</p>
				</div>
				<div className="mt-l">
					{ deleteStatus
						? <ProgressBar className="mb-m" notification="Processing filtered rows…" value={ deleteStatus } />
						: null
					}
					<div className="flex">
						<Button variant="plain" color="neutral" onClick={ hidePanel } sx={ { ml: 'auto' } }>{ __( 'Cancel' ) }</Button>
						<Button
							ref={ deleteDisabled }
							color="danger"
							disabled={ deleteDisabled.current === true }
							onClick={ handleDelete }
							startDecorator={ <SvgIcon name="trash" /> }
							sx={ { ml: 1 } }
						>
							{ __( 'Delete All Filtered' ) }
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( DeleteFilteredPanel );
