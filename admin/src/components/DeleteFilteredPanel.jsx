import { memo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import useCloseModal from '../hooks/useCloseModal';
import useChangeRow from '../hooks/useChangeRow';
import useTableStore from '../hooks/useTableStore';
import { useFilter } from '../hooks/filteringSorting';
import useTags from '../hooks/useTags';

import { fetchDataForProcessing } from '../api/fetchDataForProcessing';
import { operatorTypes } from '../lib/filterOperators';
import { dateWithTimezone, langName } from '../lib/helpers';

import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';
import DateTimeFormat from '../elements/DateTimeFormat';
import Tag from '../elements/Tag';

function DeleteFilteredPanel( ) {
	const { __ } = useI18n();
	const { tagsData } = useTags();
	const filters = useTableStore( ( state ) => state.filters );
	const header = useTableStore( ( state ) => state.header );
	const paginationId = useTableStore( ( state ) => state.paginationId );
	const slug = useTableStore( ( state ) => state.slug );
	const optionalSelector = useTableStore( ( state ) => state.optionalSelector );
	const activefilters = filters ? Object.keys( filters ) : null;
	const [ deleteStatus, setDeleteStatus ] = useState();
	const deleteDisabled = useRef();
	const stopFetching = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal();
	const { deleteMultipleRows } = useChangeRow();
	const { handleRemoveFilter } = useFilter();

	const hidePanel = ( ) => {
		stopFetching.current = true;

		handleClose();
		handleRemoveFilter( Object.keys( filters ) );
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
		fetchDataForProcessing( { slug, filters, paginationId, optionalSelector, stopFetching }, ( status ) => handleDeleteStatus( status ) ).then( ( response ) => {
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
														const { label_id, name, bgcolor, className: tagClass } = tag;
														return <Tag key={ label_id } fullSize className={ `smallText ${ tagClass }` } style={ { width: 'min-content', backgroundColor: bgcolor } }>
															{ name }
														</Tag>;
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
						<Button className="ma-left" onClick={ hidePanel }>{ __( 'Cancel' ) }</Button>
						<Button ref={ deleteDisabled } className="ml-s danger" disabled={ deleteDisabled.current } onClick={ handleDelete }>
							{ __( 'Delete All Filtered' ) }
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( DeleteFilteredPanel );
