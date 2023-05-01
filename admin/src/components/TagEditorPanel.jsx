
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useI18n } from '@wordpress/react-i18n';

import Button from '../elements/Button';
import FilterMenu from '../elements/FilterMenu';
import InputField from '../elements/InputField';

import '../assets/styles/components/_FloatingPanel.scss';

export default function TagEditorPanel( { props, onEdit } ) {
	const handleOnEdit = useCallback( ( val ) => {
		onEdit( val );
	}, [ onEdit ] );

	useEffect( () => {
		window.addEventListener( 'keyup', ( event ) => {
			if ( event.key === 'Escape' ) {
				onEdit( false );
			}
			if ( event.key === 'Enter' && state.filterObj.filterVal ) {
				event.target.blur();
				onEdit( state.filterObj );
			}
		}
		);
	}, [ state.filterObj.keyType ] );

	return (
		<div className={ `urlslab-panel fadeInto urslab-floating-panel urslab-TableEditor-panel pos-absolute` }>
			<div className="urlslab-panel-header">
				<strong>{ __( 'Edit Tag' ) }{ key ? ` ${ header[ key ] }` : '' }</strong>
			</div>
			<div className="flex mt-m mb-m flex-align-center">

			</div>

			<div className="Buttons mt-m flex flex-align-center">
				<Button className="ma-left simple wide" onClick={ () => handleOnEdit( false ) }>{ __( 'Cancel' ) }</Button>
				<Button active className="wide" disabled={ state.filterObj.filterVal ? false : true } onClick={ () => handleOnEdit( state.filterObj ) }>{ __( 'Save tag' ) }</Button>
			</div>
		</div>
	);
}
