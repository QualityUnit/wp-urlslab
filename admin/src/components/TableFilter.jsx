/* eslint-disable no-nested-ternary */
import { useCallback, useMemo, useRef, useState } from 'react';
import { useI18n } from '@wordpress/react-i18n';
import { useQueryClient } from '@tanstack/react-query';

import { countriesList } from '../api/fetchCountries';
import { dateWithTimezone, langName } from '../lib/helpers';
import { operatorTypes, booleanTypes } from '../lib/filterOperators';
import useClickOutside from '../hooks/useClickOutside';
import useTableStore from '../hooks/useTableStore';
import useTags from '../hooks/useTags';

import Button from '../elements/Button';
import SvgIcon from '../elements/SvgIcon';

import TableFilterPanel from './TableFilterPanel';
import Tooltip from '../elements/Tooltip';
import DateTimeFormat from '../elements/DateTimeFormat';
import Tag from '../elements/Tag';
import { browsers } from '../elements/BrowserSelect';

export default function TableFilter( { props, onEdit, onRemove, customSlug, customData, hiddenFilters } ) {
	const { state } = props;
	const { __ } = useI18n();
	const panelPopover = useRef();
	const { tagsData } = useTags();
	const [ editFilter, activateEditing ] = useState();

	let slug = useTableStore( ( tableState ) => tableState.activeTable );
	if ( customSlug ) {
		slug = customSlug;
	}

	let header = useTableStore( ( tableState ) => tableState.tables[ slug ]?.header );
	header = useMemo( () => {
		let newHeader = header;
		// custom header data provided by props
		if ( ! header && customData?.header ) {
			newHeader = customData.header;
		}

		// hide some filters if defined
		return hiddenFilters
			? Object.fromEntries(
				Object.entries( newHeader ).filter( ( [ headerKey ] ) => ! hiddenFilters.includes( headerKey ) )
			)
			: newHeader;
	}, [ customData?.header, header, hiddenFilters ] );

	const queryClient = useQueryClient();
	const postTypesFromQuery = queryClient.getQueryData( [ 'postTypes' ] );
	const capabilitiesFromQuery = queryClient.getQueryData( [ 'capabilities' ] );

	const filters = useTableStore( ( tableState ) => tableState.tables[ slug ]?.filters );

	let activefilters = Object.keys( filters ).length ? Object.keys( filters ) : null;
	if ( hiddenFilters ) {
		activefilters = activefilters.filter( ( headerKey ) => ! hiddenFilters.includes( headerKey.replace( /(.+?)@\d+/g, '$1' ) ) );
	}

	const close = useCallback( () => {
		activateEditing();
	}, [] );
	useClickOutside( panelPopover, close );

	const handleOnEdit = useCallback( ( val ) => {
		activateEditing();
		onEdit( val );
	}, [ onEdit ] );

	return (
		<div className="flex flex-align-center flex-wrap">
			{ header && activefilters?.map( ( key, index ) => { // Iterating active filters
				const isDate = filters[ key ]?.keyType === 'date' && true;
				const keyWithoutId = key?.replace( /(.+?)@\d+/g, '$1' );
				let filterValue = filters[ key ]?.val;
				if ( isDate ) {
					const { correctedDate } = dateWithTimezone( filterValue );
					filterValue = new Date( correctedDate );
				}

				return (
					! ( hiddenFilters && hiddenFilters.includes( keyWithoutId ) )
						? <Button
							key={ key }
							active={ editFilter === key ? true : false }
							className={ `outline ${ index > 0 && 'ml-s' } pos-relative FilterButton` }
							onClick={ () => ! state.editFilter && ! editFilter && activateEditing( key ) }
						>
							<div className="flex flex-align-center FilterButton">
								{ header[ keyWithoutId ] }:&nbsp;
								<span className="regular flex flex-align-center">
									<span className="fs-xs">{ operatorTypes[ filters[ key ]?.keyType ][ filters[ key ]?.op ] }</span>
							&nbsp;

									{ keyWithoutId === 'labels'
										? tagsData.map( ( tag ) => {
											if ( tag.label_id.toString() === filterValue.replace( /\|(\d+)\|/g, '$1' ) ) {
												const { label_id, name, bgcolor } = tag;
												return <Tag key={ label_id } size="sm" color={ bgcolor } fitText thinFont>{ name }</Tag>;
											}
											return null;
										} )
										: <>“<span className="limit-20">
											{ filters[ key ]?.op === 'BETWEEN' &&
										`min: ${ filterValue.min }, max: ${ filterValue.max }`
											}

											{ keyWithoutId === 'lang' &&
												( langName( filters[ key ]?.val ) || filters[ key ]?.val ) // language code fallback
											}

											{ filters[ key ]?.keyType === 'boolean' &&
												booleanTypes[ filters[ key ]?.val ]
											}

											{ keyWithoutId === 'browser' &&
												( ( filters[ key ]?.val.browser ? `${ browsers[ filters[ key ]?.val.browser[ 0 ] ] || filters[ key ]?.val.browser[ 0 ] } ${ filters[ key ]?.val.system ? __( 'on' ) + ' ' + filters[ key ]?.val.system : '' }` : filters[ key ]?.val.system ) || ' ' + __( 'bot' ) + ' ' + filters[ key ]?.val.bot )
											}

											{ keyWithoutId === 'country' &&
												( countriesList[ filters[ key ]?.val ] || filters[ key ]?.val ) // country code fallback
											}

											{ filters[ key ]?.keyType === 'capabilities' &&
												( capabilitiesFromQuery[ filters[ key ]?.val ].label || filters[ key ]?.val ) // post type fallback
											}

											{ filters[ key ]?.keyType === 'postTypes' &&
												( postTypesFromQuery[ filters[ key ]?.val ] || filters[ key ]?.val ) // post type fallback
											}

											{ ( filters[ key ]?.op !== 'BETWEEN' && keyWithoutId !== 'lang' && keyWithoutId !== 'country' && keyWithoutId !== 'browser' && filters[ key ]?.keyType !== 'postTypes' && ! filters[ key ]?.keyType !== 'capabilities' && filters[ key ]?.keyType !== 'boolean' ) &&
												(
													filters[ key ]?.filterValMenu
														? filters[ key ]?.keyType === 'menu' ? filters[ key ]?.filterValMenu[ filterValue.toString() ] : filters[ key ].val
														: filters[ key ]?.op !== 'BETWEEN' && ( ( ! isDate && filterValue.toString() ) || ( isDate && <DateTimeFormat oneLine datetime={ filterValue } /> ) )
												)
											}
										</span>”</>
									}
								</span>
								<Tooltip className="showOnHover">{ __( 'Edit filter' ) }</Tooltip>
							</div>
							<div className="flex flex-align-center">
								<SvgIcon name="close" className="close" onClick={ ( e ) => {
									onRemove( [ key ] );
									// prevent bubbling of click event to parent button
									e.stopPropagation();
								} } />
								<Tooltip className="showOnHover" style={ { width: '8em' } }>{ __( 'Delete filter' ) }</Tooltip>
							</div>
							{ editFilter === key && // Edit filter panel
							<TableFilterPanel ref={ panelPopover } key={ key } props={ { key } } onEdit={ handleOnEdit } customSlug={ slug } customData={ customData } />
							}
						</Button>
						: null
				);
			} ) }

			{ activefilters?.length > 0 && // Removes all used filters in given table
				<Button className="simple underline" onClick={ () => {
					onRemove( activefilters );
				} }>{ __( 'Clear filters' ) }</Button>
			}
		</div>
	);
}
