import { memo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import { fetchDataForProcessing } from '../api/fetchDataForProcessing';
import useCloseModal from '../hooks/useCloseModal';
import { operatorTypes } from '../lib/filterOperators';
import { langName } from '../lib/helpers';

import Button from '../elements/Button';
import ProgressBar from '../elements/ProgressBar';
import useChangeRow from '../hooks/useChangeRow';

function DeleteFilteredPanel( props ) {
	delete props.deleteCSVCols;

	const { url, data, slug, paginationId, optionalSelector, header, handlePanel } = props;
	const { __ } = useI18n();
	const { filters } = url;
	const activefilters = filters ? Object.keys( filters ) : null;
	const [ deleteStatus, setDeleteStatus ] = useState();
	const stopFetching = useRef( false );
	const { CloseIcon, handleClose } = useCloseModal( handlePanel );
	const { deleteMultipleRows } = useChangeRow( { data, url, slug, header, paginationId, removeAllFiltered: true } );

	const hidePanel = ( operation ) => {
		stopFetching.current = true;

		handleClose();
		if ( handlePanel ) {
			handlePanel( operation );
		}
	};

	const handleDeleteStatus = ( val ) => {
		setDeleteStatus( val );
		if ( val === 100 ) {
			setTimeout( () => {
				setDeleteStatus();
				hidePanel();
			}, 1000 );
		}
	};

	const handleDelete = () => {
		handleDeleteStatus( 1 );
		fetchDataForProcessing( { ...props, stopFetching }, ( status ) => handleDeleteStatus( status ) ).then( ( response ) => {
			if ( response.status === 'done' ) {
				const { data: rowsToDelete } = response;
				deleteMultipleRows( { rowsToDelete, optionalSelector } );
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
								return (
									<li key={ key }>
										{ header[ key ] }:
										<span className="regular flex flex-align-center">
											<span className="fs-xs">{ operatorTypes[ filters[ key ]?.keyType ][ filters[ key ]?.op ] }</span>
										&nbsp;
											“<span className="limit-20">
												{ filters[ key ]?.op === 'BETWEEN' &&
													`min: ${ filters[ key ]?.val.min }, max: ${ filters[ key ]?.val.max }`
												}

												{ key === 'lang' &&
													langName( filters?.lang?.val )
												}

												{ filters[ key ]?.op !== 'BETWEEN' && key !== 'lang' &&
													filters[ key ]?.filterValMenu
													? filters[ key ]?.filterValMenu[ filters[ key ]?.val ]
													: filters[ key ]?.val
												}
											</span>”
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
						<Button className="ml-s danger" options={ { ...props, stopFetching } } onClick={ handleDelete }>
							{ __( 'Delete All Filtered' ) }
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo( DeleteFilteredPanel );
