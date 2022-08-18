/* global IntersectionObserver, Image, getComputedStyle */

/* To lazy load background images,
		add class .lazybg to the element (even if background is in pseudo)
*/

const urlslabLazyLoad = () => {
	const media = document.querySelectorAll(
		'img[data-urlslabsrc], img[data-urlslabsrcset], video[data-urlslabsrc], .lazybg'
	);

	const eventType = ( element ) => {
		const elemType = element.tagName;
		if ( elemType === 'VIDEO' ) {
			return 'loadeddata';
		}
		return 'load';
	};

	const loadBg = ( loadedElem, mediaObject ) => {
		const target = mediaObject;
		// Will get url from matched element
		const url = loadedElem.match( /http.+.(jpg|png|svg|webp|avif)/g );
		// Create shadow image to check for load event
		const image = new Image();
		image.src = url;
		// If image loaded, set opacity to 1 and after transition, remove class handling transition
		image.onload = () => {
			target.style.opacity = null;
			target.addEventListener(
				'transitionend',
				() => {
					target.classList.remove( 'lazybg-loading' );
				}
			);
		};
	};

	const lazyBgcheck = ( element ) => {
		const mediaObject = element;
		mediaObject.style.opacity = '0';
		mediaObject.classList.remove( 'lazybg' );
		mediaObject.classList.add( 'lazybg-loading' );
		setTimeout(
			() => {
				const loaded = window.getComputedStyle( mediaObject )
					.backgroundImage;
				const loadedBefore = getComputedStyle( mediaObject, ':before' )
					.backgroundImage;
				const loadedAfter = getComputedStyle( mediaObject, ':after' )
					.backgroundImage;
				if ( loaded !== ( null || undefined || 'none' ) ) {
					loadBg( loaded, mediaObject );
				} else if ( loadedBefore !== ( null || undefined || 'none' ) ) {
            loadBg( loadedBefore, mediaObject );
            } else if ( loadedAfter !== ( null || undefined || 'none' ) ) {
						loadBg( loadedAfter, mediaObject );
				}
			},
			0
		);
	};

	const revertAttributes = ( element ) => {
		if (element.tagName == 'IMG' && element.hasAttribute( 'urlslab-lazy' ) && element.parentElement.tagName == 'PICTURE') {
			element.removeAttribute('urlslab-lazy');
			element.parentElement.childNodes.forEach(( childNode ) => {
				revertAttributes( childNode );
			})
		}

		if (element.hasAttribute( 'urlslab-lazy' )) {
			element.removeAttribute('urlslab-lazy');
		}

		if ( element.hasAttribute( 'data-urlslabsrcset' ) ) {
			element.setAttribute( 'srcset', element.getAttribute( 'data-urlslabsrcset' ) );
			element.removeAttribute( 'data-urlslabsrcset' );
			element.addEventListener(
				eventType( element ),
				() => {
                const e = element;
                e.style.opacity = '1';
				}
			);
		}

		if ( element.hasAttribute( 'data-urlslabsrc' ) ) {
			element.setAttribute( 'src', element.getAttribute( 'data-urlslabsrc' ) );
			element.removeAttribute( 'data-urlslabsrc' );
			element.addEventListener(
				eventType( element ),
				() => {
                const e = element;
                e.style.opacity = '1';
				}
			);
		}

		if ( element.hasAttribute( 'data-urlslabstyle' ) ) {
			element.setAttribute( 'style', element.getAttribute( 'data-urlslabstyle' ) );
			element.removeAttribute( 'data-urlslabstyle' );
		}
		if ( element.hasAttribute( 'data-ursllabfull-url' ) ) {
			element.setAttribute( 'data-full-url', element.getAttribute( 'data-ursllabfull-url' ) );
			element.removeAttribute( 'data-ursllabfull-url' );
		}

		if (element.classList.contains( 'lazybg' )) {
			lazyBgcheck( element );
		}
	};

	if ( 'IntersectionObserver' in window && media.length > 0 ) {
		const mediaObserver = new IntersectionObserver(
			( entries ) => {
            entries.forEach(
					( entry ) => {
                    if ( entry.isIntersecting ) {
                          revertAttributes( entry.target );
                          mediaObserver.unobserve( entry.target );
                    }
					}
				);
			}
		);

		media.forEach(
			( mediaObject ) => {
            mediaObserver.observe( mediaObject );
			}
		);
	}
};

( () => {
	urlslabLazyLoad();
} )();
