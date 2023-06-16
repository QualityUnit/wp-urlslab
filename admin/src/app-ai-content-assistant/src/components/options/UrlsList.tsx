import React, { ReactComponentElement, useCallback, useContext, useRef, useState } from 'react';
import { UrlStatus, UrlsListItem } from '../../app/types';
import { ReactComponent as HourglassIcon } from '../../assets/images/icons/icon-hourglass.svg';
import { ReactComponent as CloseIcon } from '../../assets/images/icons/icon-close.svg';
import { __ } from '@wordpress/i18n';

import { Button, InputField, Tooltip } from '../../elements/JSXElements';

import { AppContext } from '../../app/context';
import { InfoTooltipIcon } from '../../elements/InfoTooltipIcon';
import { checkAddedUrl } from '../../app/api';

import '../../assets/styles/components/_UrlsList.scss';

type UpdateUrlsAction = 'add' | 'remove';

const UrlsList: React.FC<{ urls: UrlsListItem[] }> = ( { urls } ) => {
	const { state, dispatch } = useContext( AppContext );
	console.log( state.selected_urls );
	const updateSelectedUrls = useCallback( ( action: UpdateUrlsAction, url: string ) => {
		dispatch( {
			type: 'selected_urls',
			payload: action === 'add'
				? [ ...state.selected_urls, url ]
				: state.selected_urls.filter( ( item ) => item !== url ),
		} );
	}, [ dispatch, state.selected_urls ] );

	return (
		<div className="urlslab-UrlsList">
			{ urls.length > 0 &&
			<div className="urlslab-UrlsList-items flex flex-column">
				{ urls.map( ( item ) => {
					const checked = state.selected_urls.includes( item.url );
					return (
						<div className={ `urlslab-UrlsList-items-item flex flex-justify-space-between flex-align-center status-${ item.status }` } key={ `urls-list-item-${ item.id }` }>
							<div className="urlslab-UrlsList-item-part-checkbox">
								{ item.status === 'active'
									? <UrlCheckbox item={ item } checked={ checked } updateSelectedUrls={ updateSelectedUrls } />
									: <div className="urlslab-UrlsList-label">{ item.url }</div>
								}

							</div>
							<div className="urlslab-UrlsList-item-part-icon flex flex-align-center flex-justify-center">
								{ item.status === 'active' && <div className="status-icon"></div> }
								{ item.status === 'pending' &&
								<div className="status-icon">
									<HourglassIcon />
									<Tooltip className="showOnHover align-left-0" width="8.5em">{ __( 'URL is waiting to be loaded' ) }</Tooltip>
								</div>
								}
								{ item.status === 'error' &&
								<div className="status-icon">
									<CloseIcon />
									<Tooltip className="showOnHover align-left-0" width="8.5em">{ __( 'URL cannot be fetched' ) }</Tooltip>
								</div>
								}
							</div>
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

	const addUrl = async ( url: string ) => {
		if ( url !== '' ) {
			dispatch( { type: 'url_filter', payload: { url, status: 'pending' } } );
			setNewUrl( '' );
			const currentStatus: UrlStatus | null = await checkAddedUrl( url, true );
			if ( currentStatus !== null ) {
				dispatch( { type: 'url_filter', payload: { url, status: currentStatus } } );
			}
		}
	};

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
	updateSelectedUrls: ( action: UpdateUrlsAction, url: string ) => void
}
const UrlCheckbox:React.FC<UrlCheckboxType> = React.memo( ( { item, checked, updateSelectedUrls }:UrlCheckboxType ) => {
	return (
		<label className="urlslab-checkbox">
			<input
				className={ `urlslab-checkbox-input ${ checked ? 'checked' : '' }` }
				type="checkbox"
				name={ `urls-item-${ item.id }` }
				defaultChecked={ checked }
				onChange={ ( event ) => updateSelectedUrls( event.currentTarget.checked ? 'add' : 'remove', item.url ) }
			/>
			<div className="urlslab-checkbox-box"></div>
			<div className="urlslab-UrlsList-label">{ item.url }</div>
		</label> )
	;
} );
UrlCheckbox.displayName = 'UrlCheckbox';

export default React.memo( UrlsList );
