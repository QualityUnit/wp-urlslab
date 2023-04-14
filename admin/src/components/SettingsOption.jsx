
import { useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setSettings } from '../api/settings';
import { parseURL } from '../lib/helpers';
import Tooltip from '../elements/Tooltip';
import DatePicker from 'react-datepicker';
import InputField from '../elements/InputField';
import Switch from '../elements/Switch';
import SortMenu from '../elements/SortMenu';
import FilterMenu from '../elements/FilterMenu';

import '../assets/styles/components/datepicker/datepicker.scss';

export default function SettingsOption( { settingId, option } ) {
	const { __ } = useI18n();
	const queryClient = useQueryClient();
	const { id, type, title, description, placeholder, value, possible_values } = option;
	const [ date, setDate ] = useState( type !== 'datetime' || new Date( value ) );
	const [ status, setStatus ] = useState( );

	const handleChange = useMutation( {
		mutationFn: async ( changeValue ) => {
			setStatus( 'active' );
			const response = await setSettings( `${ settingId }/${ id }`, {
				value: changeValue } );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;

			if ( ok ) {
				setStatus( 'success' );
				setTimeout( () => {
					setStatus();
				}, 3000 );

				return false;
			}
			queryClient.invalidateQueries( [ 'settings', settingId ] );
			setStatus( 'error' );
			setTimeout( () => {
				setStatus();
			}, 3000 );
		},
	} );

	const handleDate = useMutation( {
		mutationFn: async ( newDate ) => {
			setStatus( 'active' );
			const response = await setSettings( `${ settingId }/${ id }`, {
				value: new Date( newDate ).toISOString().replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ),
			} );
			return response;
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;
			if ( ok ) {
				setStatus( 'success' );
				queryClient.invalidateQueries( [ 'settings', settingId ] );
				setTimeout( () => {
					setStatus();
				}, 3000 );
				return false;
			}
			setStatus( 'error' );
			setTimeout( () => {
				setStatus();
			}, 3000 );
		},
	} );

	const renderOption = ( ) => {
		switch ( type ) {
			case 'text':
			case 'password':
			case 'number':
				return (
					<InputField
						type={ type }
						label={ title }
						placeholder={ placeholder && ! value }
						defaultValue={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'checkbox':
				return (
					<Switch
						className="option flex"
						label={ title }
						checked={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'datetime':
				return (
					<div className="urlslab-inputField-datetime">
						<div className="urlslab-inputField-label">{ title }</div>
						<DatePicker
							className="urlslab-input xl"
							selected={ date }
							dateFormat="dd. MMMM yyyy, HH:mm"
							timeFormat="HH:mm"
							showTimeSelect
							onChange={ ( newDate ) => {
								setDate( newDate ); handleDate.mutate( newDate );
							} }
						/>
					</div>
				);
			case 'listbox':
				return (
					<SortMenu className="wide" name={ id } items={ possible_values } checkedId={ value } autoClose onChange={ ( selectedId ) => handleChange.mutate( selectedId ) }>
						{ title }
					</SortMenu>
				);
			case 'multicheck':
				return (
					<FilterMenu className="wide"
						items={ possible_values }
						checkedItems={ value }
						id={ id }
						asTags
						onChange={ ( selectedItems ) => handleChange.mutate( selectedItems ) }>
						{ title }
					</FilterMenu>
				);
			default:
				break;
		}
	};

	const renderStatus = () => {
		switch ( status ) {
			case 'active':
				return (
					<Tooltip center>{ __( 'Writing setting' ) }</Tooltip>
				);
			case 'success':
				return (
					<Tooltip center className="successStatus">{ __( 'Setting written!' ) }</Tooltip>
				);
			case 'error':
				return (
					<Tooltip center className="errorStatus">{ __( 'Failed! Try again please.' ) }</Tooltip>
				);
			default:
				break;
		}
	};

	return (
		<div className="urlslab-settingsPanel-option">
			{ status !== 'error' && renderOption() }
			{ status === 'error' && renderOption() /* Duplicate element on error, forces rerender */ }
			{ renderStatus() }
			{ <p className="urlslab-settingsPanel-option__desc" dangerouslySetInnerHTML={ { __html: parseURL( description ) } } /> }
		</div>
	);
}
