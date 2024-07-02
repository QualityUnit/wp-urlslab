
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@mui/joy/Button';

import { setSettings } from '../api/settings';
import { getFetch, handleApiError } from '../api/fetching';
import { setNotification } from '../hooks/useNotifications';

import { parseURL, dateWithTimezone, getDateFnsFormat, hideWpHeaderNoApiNotification } from '../lib/helpers';
import labelsList from '../lib/labelsList';

import DatePicker from 'react-datepicker';
import InputField from '../elements/InputField';
import TextArea from '../elements/Textarea';
import Switch from '../elements/Switch';
import SingleSelectMenu from '../elements/SingleSelectMenu';
import MultiSelectMenu from '../elements/MultiSelectMenu';
import Tag from '../elements/Tag';

import '../assets/styles/components/datepicker/datepicker.scss';

// apply callback action for options after successful save
const useSuccessEditCallback = ( optionId, deps = {} ) => {
	const { queryClient } = deps;
	switch ( optionId ) {
		case 'flowhunt-api-key':
			return queryClient
				? () => {
					queryClient.invalidateQueries( [ 'credits' ] );
					//invalidate general query to refresh available api key status and recognize paid user
					queryClient.invalidateQueries( [ 'general' ] );
					hideWpHeaderNoApiNotification();
				}
				: null;
		default:
			return null;
	}
};

export default function SettingsOption( { settingId, option } ) {
	const queryClient = useQueryClient();
	const { id, type, title, description, labels, placeholder, default: defaultVal, value, possible_values } = option;

	// just for backwards compatibility
	const dateValue = typeof value === 'string' ? new Date( value ) : new Date( value * 1000 );

	const [ date, setDate ] = useState( type !== 'datetime' || dateValue );
	const [ status, setStatus ] = useState( );

	const successEditCallback = useSuccessEditCallback( id, { queryClient } );

	const handleApiCall = async () => {
		setNotification( id, { message: __( 'Executing…', 'urlslab' ), status: 'info' } );
		const response = await getFetch( value, { skipErrorHandling: true } );
		const result = await response.json();
		if ( response.ok ) {
			setNotification( id, { message: result?.message, status: 'success' } );
			return false;
		}
		if ( typeof result === 'object' ) {
			setNotification( id, { message: result?.message, status: 'error' } );
			return false;
		}
		setNotification( id, { message: response, status: 'error' } );
		return false;
	};

	const handleChange = useMutation( {
		mutationFn: async ( changeValue ) => {
			setStatus( 'active' );
			if ( value.toString() !== changeValue.toString() ) {
				setNotification( id, {
					message: `${ __( 'Changing setting', 'urlslab' ) } ${ title }…`, status: 'info' } );
				const response = await setSettings(
					`${ settingId }/${ id }`,
					{ value: changeValue },
					{ skipErrorHandling: true }
				);
				return { response };
			}
			return { response: {} };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;

			if ( ok === undefined ) {
				return false;
			}

			if ( ok ) {
				if ( successEditCallback && typeof successEditCallback === 'function' ) {
					successEditCallback();
				}
				queryClient.invalidateQueries( [ 'settings', settingId ] );
				setStatus( 'success' );
				setNotification( id, {
					message: `${ __( 'Setting', 'urlslab' ) } ${ title } ${ __( 'changed!', 'urlslab' ) }`, status: 'success' } );
				return false;
			}

			setStatus( 'error' );
			handleApiError( id, response, { title: `${ __( 'Changing setting', 'urlslab' ) } ${ title } ${ __( 'failed', 'urlslab' ) }` } );
		},
	} );

	const handleDate = useMutation( {
		mutationFn: async ( ) => {
			setStatus( 'active' );
			setNotification( id, { message: `${
				__( 'Changing date for', 'urlslab' ) } ${ title }…`, status: 'info' } );

			const response = await setSettings( `${ settingId }/${ id }`, {
				value: date.getTime() / 1000,
			}, { skipErrorHandling: true } );
			return { response };
		},
		onSuccess: async ( { response } ) => {
			const { ok } = response;
			if ( ok ) {
				if ( successEditCallback && typeof successEditCallback === 'function' ) {
					successEditCallback();
				}
				setStatus( 'success' );
				setNotification( id, { message: `${ __( 'Setting date for', 'urlslab' ) } ${ title } ${ __( 'changed!', 'urlslab' ) }`, status: 'success' } );
				queryClient.invalidateQueries( [ 'settings', settingId ] );
				return false;
			}
			setStatus( 'error' );
			handleApiError( id, response, { title: `${ __( 'Changing date for', 'urlslab' ) } ${ title } ${ __( 'failed', 'urlslab' ) }` } );
		},
	} );

	const renderOption = ( ) => {
		switch ( type ) {
			case 'text':
			case 'password':
			case 'number':
				return (
					<InputField
						key={ id }
						type={ type }
						title={ title }
						label={
							<>
								{
									labels.map( ( tag ) => {
										const { name, color: tagColor } = labelsList[ tag ];
										return <Tag key={ tag } size="sm" color={ tagColor } isUppercase isOutlined fitText sx={ { ml: 1 } } >{ name }</Tag>;
									} )
								}
							</>
						}
						placeholder={ placeholder && ! value }
						defaultValue={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'textarea':
				return (
					<TextArea
						key={ id }
						type={ type }
						title={ title }
						label={
							<>
								{
									labels.map( ( tag ) => {
										const { name, color: tagColor } = labelsList[ tag ];
										return <Tag key={ tag } size="sm" color={ tagColor } isUppercase isOutlined fitText sx={ { ml: 1 } } >{ name }</Tag>;
									} )
								}
							</>
						}
						placeholder={ placeholder && ! value }
						defaultValue={ value }
						onChange={ ( inputValue ) => handleChange.mutate( inputValue ) }
					/>
				);
			case 'api_button':
				return <Button key={ id } onClick={ handleApiCall } >{ title }</Button>;
			case 'checkbox':
				return (
					<Switch
						className="option flex"
						key={ id }
						title={ title }
						label={
							<>
								{
									labels.map( ( tag ) => {
										const { name, color: tagColor } = labelsList[ tag ];
										return <Tag key={ tag } size="sm" color={ tagColor } isUppercase isOutlined fitText sx={ { ml: 1 } } >{ name }</Tag>;
									} )
								}
							</>
						}
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
							key={ id }
							dateFormat={ getDateFnsFormat().datetime }
							timeFormat={ getDateFnsFormat().time }
							calendarStartDay={ window.wp.date.getSettings().l10n.startOfWeek }
							showTimeSelect
							onChange={ ( val ) => {
								const { origDate } = dateWithTimezone( val );
								setDate( origDate ); handleDate.mutate();
							} }
						/>
					</div>
				);
			case 'listbox':
				return (
					<SingleSelectMenu key={ `${ id }-${ value }` }
						className="wide"
						name={ id }
						items={ possible_values }
						defaultValue={ value }
						autoClose
						onChange={ ( selectedId ) => handleChange.mutate( selectedId ) }
						labels={
							labels.map( ( tag ) => {
								const { name, color: tagColor } = labelsList[ tag ];
								return <Tag key={ tag } size="sm" color={ tagColor } isUppercase isOutlined fitText sx={ { ml: 1 } } >{ name }</Tag>;
							} )
						}
					>
						{ title }
					</SingleSelectMenu>
				);
			case 'multicheck':
				return (
					<MultiSelectMenu className="wide"
						items={ possible_values }
						defaultValue={ value || defaultVal }
						key={ id }
						id={ id }
						asTags
						onChange={ ( selectedItems ) => handleChange.mutate( selectedItems ) }
						labels={
							labels.map( ( tag ) => {
								const { name, color: tagColor } = labelsList[ tag ];
								return <Tag key={ tag } size="sm" color={ tagColor } isUppercase isOutlined fitText sx={ { ml: 1 } } >{ name }</Tag>;
							} )
						}
					>
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
			{ <p className="urlslab-settingsPanel-option__desc" dangerouslySetInnerHTML={ { __html: parseURL( description.replaceAll( /\`(.+?)\`/g, '<span class="c-darker-saturated-red">$1</span>' ) ) } } /> }
		</div>
	);
}
