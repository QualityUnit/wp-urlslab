
import { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setSettings } from '../api/settings';
import { parseURL } from '../lib/helpers';
import DatePicker from 'react-datepicker';
import InputField from '../elements/InputField';
import TextArea from '../elements/Textarea';
import Switch from '../elements/Switch';
import SingleSelectMenu from '../elements/SingleSelectMenu';
import MultiSelectMenu from '../elements/MultiSelectMenu';
import Button from '../elements/Button';

import '../assets/styles/components/datepicker/datepicker.scss';
import { fetchData } from '../api/fetching';

export default function SettingsOption( { settingId, option, renderTooltip } ) {
	const queryClient = useQueryClient();
	const { id, type, title, description, placeholder, value, possible_values } = option;
	const [ date, setDate ] = useState( type !== 'datetime' || new Date( value ) );
	const [ status, setStatus ] = useState( );

	const handleApiCall = async () => {
		renderTooltip( { status: 'activeApiCall', message: 'Executing…' } );
		const result = await fetchData( value );
		if ( result ) {
			renderTooltip( { status: 'successApiCall', message: result } );
			setTimeout( () => {
				renderTooltip();
			}, 3000 );
			return false;
		}
		renderTooltip( { status: 'errorApiCall', message: 'Failed' } );
		setTimeout( () => {
			renderTooltip();
		}, 3000 );
	};

	const handleChange = useMutation( {
		mutationFn: async ( changeValue ) => {
			setStatus( 'active' );
			renderTooltip( 'active' );
			const response = await setSettings( `${ settingId }/${ id }`, {
				value: changeValue } );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;

			if ( ok ) {
				setStatus( 'success' );
				renderTooltip( 'success' );
				setTimeout( () => {
					setStatus();
					renderTooltip();
				}, 3000 );

				return false;
			}
			queryClient.invalidateQueries( [ 'settings', settingId ] );
			setStatus( 'error' );
			renderTooltip( 'error' );
			setTimeout( () => {
				setStatus();
				renderTooltip();
			}, 3000 );
		},
	} );

	const processDate = ( ) => {
		const thisDate = new Date( date );
		const currentDate = new Date( thisDate.getTime() - ( thisDate.getTimezoneOffset() * 60000 ) );
		return currentDate;
	};

	const handleDate = useMutation( {
		mutationFn: async ( ) => {
			setStatus( 'active' );
			renderTooltip( 'active' );

			const response = await setSettings( `${ settingId }/${ id }`, {
				value: processDate().toISOString().replace( /^(.+?)T(.+?)\..+$/g, '$1 $2' ),
			} );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;
			if ( ok ) {
				setStatus( 'success' );
				renderTooltip( 'success' );
				queryClient.invalidateQueries( [ 'settings', settingId ] );
				setTimeout( () => {
					setStatus();
					renderTooltip();
				}, 3000 );
				return false;
			}
			setStatus( 'error' );
			renderTooltip( 'error' );
			setTimeout( () => {
				setStatus();
				renderTooltip();
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
						key={ value }
						type={ type }
						label={ title }
						placeholder={ placeholder && ! value }
						defaultValue={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'textarea':
				return (
					<TextArea
						key={ value }
						type={ type }
						label={ title }
						placeholder={ placeholder && ! value }
						defaultValue={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'api_button':
				return (
					<Button
						active
						key={ value }
						onClick={ handleApiCall }
					>
						{ title }
					</Button>
				);
			case 'checkbox':
				return (
					<Switch
						className="option flex"
						key={ value }
						label={ title }
						defaultValue={ value }
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
							key={ value }
							dateFormat="dd. MMMM yyyy, HH:mm"
							timeFormat="HH:mm"
							showTimeSelect
							onChange={ ( newDate ) => {
								setDate( newDate ); handleDate.mutate();
							} }
						/>
					</div>
				);
			case 'listbox':
				return (
					<SingleSelectMenu key={ value } className="wide" name={ id } items={ possible_values } defaultValue={ value } autoClose onChange={ ( selectedId ) => handleChange.mutate( selectedId ) }>
						{ title }
					</SingleSelectMenu>
				);
			case 'multicheck':
				return (
					<MultiSelectMenu className="wide"
						items={ possible_values }
						defaultValue={ value }
						key={ value }
						id={ id }
						asTags
						onChange={ ( selectedItems ) => handleChange.mutate( selectedItems ) }>
						{ title }
					</MultiSelectMenu>
				);
			default:
				break;
		}
	};

	return (
		<div className="urlslab-settingsPanel-option">
			{ status !== 'error' && renderOption() }
			{ status === 'error' && renderOption() /* Duplicate element on error, forces rerender */ }
			{ <p className="urlslab-settingsPanel-option__desc" dangerouslySetInnerHTML={ { __html: parseURL( description ) } } /> }
		</div>
	);
}
