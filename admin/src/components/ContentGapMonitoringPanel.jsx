import { memo, useCallback, useMemo, useReducer } from 'react';
import { __ } from '@wordpress/i18n';
import { useQueryClient } from '@tanstack/react-query';

import useTablePanels from '../hooks/useTablePanels';
import useSelectRows from '../hooks/useSelectRows';
import useTableStore from '../hooks/useTableStore';
import useCloseModal from '../hooks/useCloseModal';
import { setNotification } from '../hooks/useNotifications';
import { postFetch } from '../api/fetching';
import { getQueriesTableEditorCells } from '../tables/SerpQueriesTable';
import Button from '@mui/joy/Button';

function ContentGapMonitoringPanel() {
	const queryClient = useQueryClient();
	const { CloseIcon, handleClose } = useCloseModal();
	const fetchOptions = useTablePanels( ( state ) => state.fetchOptions );
	const activeTable = useTableStore( ( state ) => state.activeTable );
	const selectedRows = useSelectRows( ( state ) => state.selectedRows[ activeTable ] );
	const setSelectedRows = useSelectRows( ( state ) => state.setSelectedRows );
	const [ currentData, setCurrentData ] = useReducer( ( state, action ) => {
		return { ...state, ...action.value };
	}, {
		query: getRowsQueries( selectedRows ).join( '\n' ),
		country: fetchOptions?.country ? fetchOptions.country : 'us',
		schedule_interval: '',
		labels: '',
	} );

	const editorCells = useMemo(
		() => getQueriesTableEditorCells( {
			data: currentData,
			onChange: ( value ) => setCurrentData( { value } ),
			tableSlug: activeTable,
		}
		), [ activeTable, currentData ] );

	const requiredFields = useMemo( () => editorCells && Object.keys( editorCells ).filter( ( cell ) => editorCells[ cell ]?.props.required === true ), [ editorCells ] );
	const enableSubmit = requiredFields?.every( ( key ) => Object.keys( currentData ).includes( key ) && currentData[ key ] );

	const handleSubmit = useCallback( async () => {
		const tableSlug = 'serp-queries';
		setNotification( 'new_queries', { message: 'Adding queries…', status: 'info' } );
		setSelectedRows( {} );
		handleClose();
		const response = await postFetch( `${ tableSlug }/create`, currentData );
		if ( response.ok ) {
			queryClient.invalidateQueries( [ tableSlug ] );
			queryClient.invalidateQueries( [ activeTable ] );
			setNotification( 'new_queries', { message: 'Queries added successfully…', status: 'success' } );
		}
	}, [ currentData, activeTable, handleClose, queryClient, setSelectedRows ] );

	return (
		<div className="urlslab-panel-wrap urlslab-panel-modal ultrawide fadeInto">
			<div className="urlslab-panel">
				<div className="urlslab-panel-header">
					<h3>{ __( 'Monitor selected queries' ) }</h3>
					<button className="urlslab-panel-close" onClick={ handleClose }>
						<CloseIcon />
					</button>
				</div>
				<div className="urlslab-panel-content mt-l">
					{ editorCells &&
						Object.entries( editorCells ).map( ( [ key, cell ] ) => (
							<div key={ key } className={ `mb-l urlslab-panel-content__item ${ cell.props.hidden ? 'hidden' : '' }` }>
								{ cell }
							</div>
						) )
					}
				</div>
				<div className="flex mt-l">
					<Button variant="plain" color="neutral" onClick={ handleClose } sx={ { ml: 'auto', mr: 1 } }>{ __( 'Cancel' ) }</Button>
					<Button disabled={ ! enableSubmit } onClick={ handleSubmit }>
						{ __( 'Add queries' ) }
					</Button>
				</div>
			</div>
		</div>
	);
}

const getRowsQueries = ( rows ) => {
	const queries = [];
	Object.values( rows ).forEach( ( row ) => {
		const query = row.original?.query;
		if ( query ) {
			queries.push( query );
		}
	} );
	return queries;
};

export default memo( ContentGapMonitoringPanel );
