import { memo, useContext } from 'react';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import {
	flexRender,
} from '@tanstack/react-table';

import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';

import { ReactComponent as SettingsIcon } from '../assets/images/menu-icon-settings.svg';
import { TableContext } from './TableComponent';

const TableHead = () => {
	const { toggleOpenedRowActions, table, resizable, userCustomSettings, closeableRowActions } = useContext( TableContext );

	return (
		<thead className="urlslab-table-head">
			{ table.getHeaderGroups().map( ( headerGroup ) => (
				<tr className="urlslab-table-head-row" key={ headerGroup.id }>
					{ headerGroup.headers.map( ( header, index ) => {
						const isEditCell = index === headerGroup.headers.length - 1 && header.id === 'editRow';
						return (
							<th
								key={ header.id }
								className={ classNames( [
									header.column.columnDef.className,
									closeableRowActions && isEditCell && ! userCustomSettings.openedRowActions ? 'closed' : null,
								] ) }
								data-defaultwidth={ header.getSize() }
								style={ {
									...( resizable ? { position: 'absolute', left: header.getStart() } : null ),
									...( ! isEditCell && header.getSize() !== 0 ? { width: header.getSize() } : null ),
								} }
							>

								{ header.isPlaceholder
									? null
									: flexRender(
										typeof header.column.columnDef.header === 'string'
											? <span className="column-label">{ header.column.columnDef.header }</span>
											: header.column.columnDef.header,
										header.getContext()
									)
								}

								{ ( resizable && header.column.columnDef.enableResizing !== false )
									? <div
										{ ...{
											onMouseDown: header.getResizeHandler(),
											onTouchStart: header.getResizeHandler(),
											className: `resizer ${ header.column.getIsResizing() ? 'isResizing' : '' }`,
										} }
									/>
									: null
								}

								{ closeableRowActions && isEditCell && (
									<Stack className="action-buttons-wrapper" direction="row" justifyContent="end" sx={ { width: '100%' } }>
										<Tooltip title={ userCustomSettings.openedRowActions ? __( 'Hide rows actions' ) : __( 'Show rows actions' ) }>
											<IconButton className="editRow-toggle-button" variant="soft" size="xs" onClick={ toggleOpenedRowActions }>
												<SettingsIcon />
											</IconButton>
										</Tooltip>
									</Stack>
								) }
							</th>
						);
					} )
					}
				</tr>
			) ) }
		</thead>
	);
};

export default memo( TableHead );
