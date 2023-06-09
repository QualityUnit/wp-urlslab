import React, { useCallback, useContext, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { AppContext } from '../../app/context';
import { UrlsList, UrlsListItem } from '../../app/types';
import { ReactComponent as HourglassIcon } from '../../assets/images/icons/icon-hourglass.svg';

import '../../assets/styles/components/_UrlsList.scss';
import Tooltip from '../../../../elements/Tooltip';

type UpdateUrlsAction = 'add' | 'remove';
const UrlsList: React.FC<{ urls: UrlsList }> = ( { urls } ) => {
	const [ selectedUrls, setSelectedUrls ] = useState<string[]>( [] );

	const updateSelectedUrls = useCallback( ( action: UpdateUrlsAction, id: string ) => {
		switch ( action ) {
		case 'add':
			setSelectedUrls( [ ...selectedUrls, id ] );
			break;
		case 'remove':
			setSelectedUrls( selectedUrls.filter( ( currentId ) => currentId !== id ) );
			break;
		default:
			break;
		}
	}, [ selectedUrls ] );

	return (
		<div className="urlslab-urls-list flex flex-column">
			{ urls.map( ( item ) => {
				const checked = selectedUrls.includes( item.id );
				return (
					<div className={ `urlslab-urls-list-item flex flex-justify-space-between flex-align-center status-${ item.status }` } key={ `urls-list-item-${ item.id }` }>
						<div className="urlslab-urls-list-item-part-checkbox">
							{ item.status === 'pending'
								? <div className="urlslab-urls-list-label">{ item.url }</div>
								: <UrlCheckbox item={ item } checked={ checked } updateSelectedUrls={ updateSelectedUrls } />
							}

						</div>
						<div className="urlslab-urls-list-item-part-icon">
							{ item.status === 'active' && <div className="active-icon"></div> }
							{ item.status === 'pending' && <HourglassIcon /> }
						</div>
					</div>
				);
			} ) }
		</div>

	);
};

type UrlCheckboxType = {
	item: UrlsListItem,
	checked: boolean,
	updateSelectedUrls: ( action: UpdateUrlsAction, id: string ) => void
}
const UrlCheckbox:React.FC<UrlCheckboxType> = React.memo( ( { item, checked, updateSelectedUrls }:UrlCheckboxType ) => {
	return (
		<label className="urlslab-checkbox">
			<input
				className={ `urlslab-checkbox-input ${ checked ? 'checked' : '' }` }
				type="checkbox"
				name={ `urls-item-${ item.id }` }
				defaultChecked={ checked }
				onChange={ ( event ) => updateSelectedUrls( event.currentTarget.checked ? 'add' : 'remove', item.id ) }
			/>
			<div className="urlslab-checkbox-box"></div>
			<div className="urlslab-urls-list-label">{ item.url }</div>
		</label> )
	;
} );
UrlCheckbox.displayName = 'UrlCheckbox';

export default React.memo( UrlsList );
