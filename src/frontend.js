import './scss/frontend.scss';

const activators = document.querySelectorAll(
	'.qu-enhancedFAQ [data-quTarget]'
);

if ( activators.length > 0 ) {
	activators.forEach( ( elem ) => {
		const activator = elem;
		const target = document.querySelector(
			`.qu-enhancedFAQ [data-quTargetId="${ activator.dataset.qutarget }"]`
		);

		const hideVisible = () => {
			activator.classList.remove( 'active' );
			target.classList.remove( 'visible' );
			setTimeout( () => {
				target.classList.add( 'hidden' );
			}, 200 );
		};

		activator.addEventListener( 'click', ( event ) => {
			event.stopPropagation();
			if ( ! target.classList.contains( 'visible' ) ) {
				target.classList.remove( 'hidden' );
				activator.classList.add( 'active' );
				setTimeout( () => {
					target.classList.add( 'visible' );
				}, 0 );
			}

			if ( target.classList.contains( 'visible' ) ) {
				hideVisible();
			}
		} );

		document.addEventListener( 'click', ( event ) => {
			if (
				! event.target.dataset.targetId &&
				event.target !== activator
			) {
				hideVisible();
			}
		} );
	} );
}
