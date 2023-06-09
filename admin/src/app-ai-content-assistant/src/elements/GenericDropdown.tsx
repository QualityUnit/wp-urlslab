import React, { useState, createRef } from 'react';
import { useOutsideClick } from '../app/hooks';

import '../assets/styles/elements/_GenericDropdown.scss';

type GenericDropdownType = {
	label?: string
	innerLabel?: string
	description?: string
} & React.PropsWithChildren
const GenericDropdown: React.FC<GenericDropdownType> = ( {
	label,
	innerLabel,
	description,
	children,
}: GenericDropdownType ) => {
	const [ isActive, setActive ] = useState( false );
	const [ isVisible, setVisible ] = useState( false );
	const ref = createRef<HTMLDivElement>();

	useOutsideClick( ref, () => {
		setActive( false );
		setVisible( false );
	} );

	const handleMenu = () => {
		setActive( ! isActive );

		setTimeout( () => {
			setVisible( ! isVisible );
		}, 100 );
	};

	return (
		<div className="urlslab-GenericDropdown">
			<div className={ `urlslab-MultiSelectMenu urlslab-SortMenu ${ isActive ? 'active' : '' }` } ref={ ref }>
				<div className="urlslab-inputField-label">{ label }</div>
				<div
					className={ `urlslab-MultiSelectMenu__title ${ isActive ? 'active' : '' }` }
					onClick={ handleMenu }
					onKeyUp={ handleMenu }
					role="button"
					tabIndex={ 0 }
				>
					<span>{ innerLabel }</span>
				</div>
				<div className={ `urlslab-MultiSelectMenu__items ${ isActive ? 'active' : '' } ${ isVisible ? 'visible' : '' }` }>
					<div className="urlslab-MultiSelectMenu__items--inn">
						{ children }
					</div>
				</div>
			</div>
			{ description && <p className="urlslab-inputField-description">{ description }</p> }
		</div>
	);
};

export default React.memo( GenericDropdown );
