import React, { ReactComponentElement, useCallback, useContext, useRef, useState } from 'react';
import { UrlsList, UrlsListItem } from '../../app/types';
import { ReactComponent as HourglassIcon } from '../../assets/images/icons/icon-hourglass.svg';
import { __ } from '@wordpress/i18n';

import { Button, InputField, Tooltip } from '../../elements/JSXElements';

import { AppContext } from '../../app/context';
import { InfoTooltipIcon } from '../../elements/InfoTooltipIcon';

import '../../assets/styles/components/_UrlsList.scss';

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
		<div className="urlslab-UrlsList">
			{ urls.length > 0 &&
			<div className="urlslab-UrlsList-items flex flex-column">
				{ urls.map( ( item ) => {
					const checked = selectedUrls.includes( item.id );
					return (
						<div className={ `urlslab-UrlsList-items-item flex flex-justify-space-between flex-align-center status-${ item.status }` } key={ `urls-list-item-${ item.id }` }>
							<div className="urlslab-UrlsList-item-part-checkbox">
								{ item.status === 'pending'
									? <div className="urlslab-UrlsList-label">{ item.url }</div>
									: <UrlCheckbox item={ item } checked={ checked } updateSelectedUrls={ updateSelectedUrls } />
								}

							</div>
							{ /* we'll use status in later plugin update
							<div className="urlslab-UrlsList-item-part-icon flex flex-align-center flex-justify-center">
								{ item.status === 'active' && <div className="active-icon"></div> }
								{ item.status === 'pending' &&
								<div className="pending-icon">
									<HourglassIcon />
									<Tooltip className="showOnHover align-left-0" width="8.5em">{ __( 'URL is waiting to be loaded' ) }</Tooltip>
								</div>
								}
							</div>
							*/ }
						</div>
					);
				} ) }
			</div>
			}
			<AddNewUrl />
		</div>

	);
};

const AddNewUrl: React.FC = React.memo( () => {
	const [ newUrl, setNewUrl ] = useState<string>( '' );
	const { dispatch } = useContext( AppContext );

	const addUrl = useCallback( ( url: string ) => {
		if ( url !== '' ) {
			dispatch( { type: 'semantic_context', payload: url } );
			setNewUrl( '' );
		}
	}, [ dispatch ] );

	return <div className="urlslab-UrlsList-add" >
		<div className="urlslab-tooltipLabel flex flex-align-center">
			<span className="urlslab-inputField-label">{ __( 'Add new url' ) }</span>
			<InfoTooltipIcon text={ __( 'It may take a few hours/days before the URL is added' ) } tooltipWidth="17em" />
		</div>
		<div className="urlslab-UrlsList-add-inputs-wrapper flex flex-align-center">
			<InputField
				key={ newUrl }
				placeholder={ __( 'https://www.yoururl.com' ) }
				type="url"
				defaultValue={ newUrl }
				onChange={ ( value ) => setNewUrl( value as string ) }
			/>
			<Button
				onClick={ () => addUrl( newUrl ) }
				active
			>{ __( 'Add' ) }</Button>
		</div>
	</div>;
} );
AddNewUrl.displayName = 'AddNewUrl';

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
			<div className="urlslab-UrlsList-label">{ item.url }</div>
		</label> )
	;
} );
UrlCheckbox.displayName = 'UrlCheckbox';

export default React.memo( UrlsList );
