import { useEffect } from 'react';

export const useOutsideClick = <T extends HTMLElement>( ref: React.RefObject<T>, callback: () => void ) => {
	useEffect( () => {
		const handleClick = ( event: MouseEvent ) => {
			if ( ref.current && ! ref.current.contains( event.target as Node ) ) {
				callback();
			}
		};
		document.addEventListener( 'click', handleClick );
		return () => {
			document.removeEventListener( 'click', handleClick );
		};
	}, [ ref, callback ] );
};
