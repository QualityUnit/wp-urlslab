// track the width of main WP menu in css variable
export default function useWpMenuWidth() {
	const resizeWatcher = new ResizeObserver( ( [ entry ] ) => {
		if ( entry.borderBoxSize ) {
			const menuWidth = document.querySelector( '#adminmenuwrap' )?.clientWidth;
			document.documentElement.style.setProperty( '--WpMenu-width', `${ menuWidth || 0 }px` );
		}
	} );
	resizeWatcher.observe( document.documentElement );
}
