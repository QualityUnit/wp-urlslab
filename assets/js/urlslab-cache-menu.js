/* global IntersectionObserver, Image, getComputedStyle */

/* To lazy load background images,
		add class .lazybg to the element (even if background is in pseudo)
*/

const urlslabCacheMenu = () => {
	const media = document.querySelectorAll('img[urlslab-lazy], img[data-src], img[data-srcset], video[data-src], .lazybg, div[lazy_hash]');
}
