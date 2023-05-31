/* global IntersectionObserver, Image, getComputedStyle */

/* To lazy load background images,
		add class .lazybg to the element (even if background is in pseudo)
*/

const urlslabLazyLoad = () => {
	const media = document.querySelectorAll('img[urlslab-lazy], img[data-src], img[data-srcset], video[data-src], .lazybg, div[lazy_hash]');

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
		if (element.tagName == 'DIV' && element.hasAttribute( 'lazy_hash' )) {
			element.classList.add("urlslab-loading");
			const xhr = new XMLHttpRequest();
			xhr.open("GET", "/urlslab-content/" + element.getAttribute('lazy_hash'), true);
			xhr.onload = (e) => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						var div = document.createElement('div');
						div.innerHTML = xhr.responseText;
						element.parentElement.replaceChild(div.firstChild, element);
					} else {
						console.error(xhr.statusText);
					}
				}
			};
			xhr.onerror = (e) => {
				console.error(xhr.statusText);
			};
			xhr.send(null);
			return;
		}


		if (element.tagName == 'IMG' && element.hasAttribute( 'urlslab-lazy' ) && element.parentElement.tagName == 'PICTURE') {
			element.removeAttribute('urlslab-lazy');
			element.parentElement.childNodes.forEach(( childNode ) => {
				revertAttributes( childNode );
			})
		}

		if (element.hasAttribute( 'urlslab-lazy' )) {
			element.removeAttribute('urlslab-lazy');
		}

		if ( element.hasAttribute( 'data-srcset' ) ) {
			element.setAttribute( 'srcset', element.getAttribute( 'data-srcset' ) );
			element.removeAttribute( 'data-srcset' );
			element.addEventListener(
				eventType( element ),
				() => {
                const e = element;
                e.style.opacity = '1';
				}
			);
		}

		if ( element.hasAttribute( 'data-src' ) ) {
			element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
			element.removeAttribute( 'data-src' );
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

	const loadYouTube = ( yt ) => {
		if ( ! yt.hasAttribute('urlslab-active') ) {
			yt.setAttribute('urlslab-active', true);			
			const videoID = yt.dataset.ytid;

			if( videoID ) {
				const iframe = document.createElement( 'iframe' );
	
				Object.assign( iframe, {
					className: 'youtube_urlslab_loader--embed',
					title: yt.getAttribute( 'title' ),
					src: `https://www.youtube.com/embed/${ videoID }?feature=oembed&autoplay=1&playsinline=1&rel=0`,
					frameborder: '0',
					allow: 'accelerometer; autoplay; gyroscope; fullscreen',
				} );
	
				if (yt.hasAttribute('width')) {
					iframe.setAttribute('width', yt.getAttribute('width'))
				}
				if (yt.hasAttribute('height')) {
					iframe.setAttribute('height', yt.getAttribute('height'))
				}
	
				yt.querySelector('.youtube_urlslab_loader--wrapper').insertAdjacentElement( "afterbegin", iframe )
				setTimeout( () => {
					yt.classList.add( "active" )
				}, 200 )
			}
		}
	};

	if ( 'IntersectionObserver' in window ) {
		if (media.length > 0) {
			const mediaObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach(
						(entry) => {
							if (entry.isIntersecting) {
								revertAttributes(entry.target);
								mediaObserver.unobserve(entry.target);
							}
						}
					);
				},
				{ rootMargin: '250px' }
			);

			media.forEach(
				(mediaObject) => {
					mediaObserver.observe(mediaObject);
				}
			);
		}
	}

	const youtubeVideo = document.querySelectorAll( '.youtube_urlslab_loader' );
	if ( youtubeVideo !== null ) {
		youtubeVideo.forEach( ( element ) => {
			const yt = element;
			yt.addEventListener( 'click', () => { loadYouTube( yt ); }, { once: true } );
			yt.removeEventListener( 'click', loadYouTube );
		} );
	}
};


const urlslabPreload = () => {
	const preloadedLinks = new Set();

	const preloadLink = ( element ) => {
		if (element.tagName == 'A' && element.hasAttribute("href") && (element.hasAttribute( 'scroll-preload' ) || element.hasAttribute('onover-preload'))) {
			try {
				element.removeAttribute('scroll-preload');
				element.removeAttribute('onover-preload');

				const anchor = document.createElement("a");
				anchor.href = element.getAttribute("href");
				const urlObj = new URL(anchor.href);
				urlObj.hash = '';

				if (preloadedLinks.has(urlObj.toString())) {
					return;
				}
				const xhr = new XMLHttpRequest();
				xhr.open("GET", urlObj.toString(), true);
				xhr.send(null);
				preloadedLinks.add(urlObj.toString());
			} catch (e) {
			}
		}
	};

	if ( 'IntersectionObserver' in window ) {
		const preload_links = document.querySelectorAll('a[scroll-preload]');
		if (preload_links.length > 0) {
			const linkObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach(
						(entry) => {
							if (entry.isIntersecting) {
								preloadLink(entry.target);
								linkObserver.unobserve(entry.target);
							}
						}
					);
				},
				{ rootMargin: '250px' }
			);

			preload_links.forEach(
				(linkObject) => {
					linkObserver.observe(linkObject);
				}
			);
		}
	}
	const preload_links = document.querySelectorAll('a[onover-preload]');
	if (preload_links.length > 0) {
		preload_links.forEach(
			(linkObject) => {
				const existingOnMouseover = linkObject.onmouseover;
				// Add the new mouseover event listener
				linkObject.addEventListener("mouseover", (event) => {
					// Call preloadLink
					preloadLink(linkObject);
					if (existingOnMouseover) {
						existingOnMouseover.call(linkObject, event);
					}
				});
			}
		);
	}
};


( () => {
	urlslabLazyLoad();
	urlslabPreload();
} )();
