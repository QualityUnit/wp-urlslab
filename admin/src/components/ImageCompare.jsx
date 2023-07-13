import { memo, useEffect, useState } from 'react';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import { ReactComponent as AdjacentScreenIcon } from '../assets/images/icons/icon-adjacent-screen.svg';
import { ReactComponent as OverlayScreenIcon } from '../assets/images/icons/icon-overlay-no-diff.svg';
import { ReactComponent as OverlayWithDiffIcon } from '../assets/images/icons/icon-overlay-with-diff.svg';
import { ReactComponent as SearchIcon } from '../assets/images/icons/icon-search-white.svg';
import { ReactComponent as SearchZoomInIcon } from '../assets/images/icons/icon-search-zoom-in.svg';
import { ReactComponent as SearchZoomOutIcon } from '../assets/images/icons/icon-search-zoom-out.svg';
import useTablePanels from '../hooks/useTablePanels';
import '../assets/styles/components/_ImageCompare.scss';
import SingleSelectMenu from '../elements/SingleSelectMenu';
import { date, getSettings } from '@wordpress/date';

const ImageCompare = ( { selectedRows, allChanges } ) => {
	const zoomingOptions = {
		0: 'Choose zoom level',
		20: '20%',
		30: '30%',
		40: '40%',
		50: '50%',
	};
	const dropdownItems = allChanges.reduce( ( acc, item ) => {
		const dateFormatted = date( getSettings().formats.date, item.last_changed * 1000 );
		const time = date( getSettings().formats.time, item.last_changed * 1000 );

		acc[ item.last_changed * 1000 ] = dateFormatted + ' ' + time.replace( /: /, ':' );
		return acc;
	}, {} );
	const [ leftImage, setLeftImage ] = useState( selectedRows[ 0 ].cell.getValue().full );
	const [ leftImageKey, setLeftImageKey ] = useState( selectedRows[ 0 ].row.original.last_changed * 1000 );
	const [ rightImage, setRightImage ] = useState( selectedRows[ 1 ].cell.getValue().full );
	const [ rightImageKey, setRightImageKey ] = useState( selectedRows[ 1 ].row.original.last_changed * 1000 );
	const [ wrapperWidth, setWrapperWidth ] = useState( 0 );
	const [ activeScreen, setActiveScreen ] = useState( 'overlay' ); // ['overlay', 'overlayWithDiff', 'adjacent']
	const [ zoom, setZoom ] = useState( 0 );
	const [ baseWrapperWidth, setBaseWrapperWidth ] = useState( 0 );
	const imageCompare = useTablePanels( ( state ) => state.imageCompare );

	const hideImageCompare = () => {
		useTablePanels.setState( { imageCompare: false } );
	};

	const handleImageChange = ( newImage, isLeft ) => {
		if ( isLeft ) {
			if ( newImage === leftImage ) {
				return false;
			}

			setLeftImage( allChanges.filter( ( change ) => change.last_changed * 1000 === Number( newImage ) )[ 0 ].screenshot.full );
			setLeftImageKey( newImage );
			return true;
		}

		if ( rightImage ) {
			if ( newImage === rightImage ) {
				return false;
			}

			setRightImage( allChanges.filter( ( change ) => change.last_changed * 1000 === Number( newImage ) )[ 0 ].screenshot.full );
			setRightImageKey( newImage );
			return true;
		}

		return false;
	};

	const handleZoomChange = ( newZoom ) => {
		console.log( 'newZoom', newZoom );
		const baseZoom = Math.round( ( baseWrapperWidth / window.innerWidth ) * 100 );

		if ( newZoom <= baseZoom ) {
			setWrapperWidth( baseWrapperWidth );
			setZoom( baseZoom );
			return;
		}

		if ( newZoom > 50 ) {
			setWrapperWidth( window.innerWidth / 2 );
			setZoom( 50 );
			return;
		}

		const newWidth = ( newZoom / 100 ) * window.innerWidth;
		setWrapperWidth( newWidth );
		setZoom( newZoom );
	};

	const calculateWrapperInitialWidth = () => {
		// eslint-disable-next-line no-undef
		const image1Elem = new Image();
		// eslint-disable-next-line no-undef
		const image2Elem = new Image();

		// Load the images and get their heights
		return new Promise( ( resolve, reject ) => {
			image1Elem.onload = () => {
				image2Elem.onload = () => {
					const maxHeight = Math.max( image1Elem.height, image2Elem.height );
					const height = window.innerHeight - 24 - 100; // reducing the close button height and top control height
					const wrapperW = height * Math.max( image1Elem.width, image2Elem.width ) / maxHeight;
					resolve( wrapperW );
				};
				image2Elem.onerror = reject;
				image2Elem.src = rightImage;
			};
			image1Elem.onerror = reject;
			image1Elem.src = leftImage;
		} );
	};

	useEffect( () => {
		const calculateWidth = async () => {
			try {
				const width = await calculateWrapperInitialWidth();
				setZoom( Math.round( ( width / window.innerWidth ) * 100 ) );
				setBaseWrapperWidth( width );
				setWrapperWidth( width );
			} catch ( error ) {}
		};

		calculateWidth();
	}, [ leftImage, rightImage ] );

	const handleScreenChange = ( screen ) => {
		setActiveScreen( screen );
	};

	return (
		imageCompare && wrapperWidth > 0 &&
		<div className="urlslab-ImageCompare">
			<div className="urlslab-ImageCompare-top-control">
				<div className="urlslab-ImageCompare-top-control-screens">
					<button className={ `urlslab-ImageCompare-top-control-screens-item ${ activeScreen === 'overlay' ? 'active' : '' }` }
						onClick={ () => handleScreenChange( 'overlay' ) }>
						<div><OverlayScreenIcon /></div>
						<div>Overlay Without diff</div>
					</button>
					<button className={ `urlslab-ImageCompare-top-control-screens-item ${ activeScreen === 'overlayWithDiff' ? 'active' : '' }` }
						onClick={ () => handleScreenChange( 'overlayWithDiff' ) }>
						<div><OverlayWithDiffIcon /></div>
						<div>Overlay With diff</div>
					</button>
					<button className={ `urlslab-ImageCompare-top-control-screens-item ${ activeScreen === 'adjacent' ? 'active' : '' }` }
						onClick={ () => handleScreenChange( 'adjacent' ) }>
						<div><AdjacentScreenIcon /></div>
						<div>Adjacent With diff</div>
					</button>
				</div>
				<div className="urlslab-ImageCompare-top-control-date">
					<div>
						<span>Left Screen</span>
						<SingleSelectMenu
							items={ dropdownItems }
							dark={ true }
							style={ { maxWidth: '15em' } }
							name="image_comparator_options"
							autoClose
							defaultValue={ leftImageKey }
							onChange={ ( val ) => handleImageChange( val, true ) }
						/>

					</div>
					<div>
						<span>Right Screen</span>
						<SingleSelectMenu
							items={ dropdownItems }
							dark={ true }
							style={ { maxWidth: '15em' } }
							name="image_comparator_options"
							autoClose
							defaultValue={ rightImageKey }
							onChange={ ( val ) => handleImageChange( val, false ) }
						/>

					</div>
				</div>
				<div className="urlslab-ImageCompare-top-control-screens">
					<div className={ `urlslab-ImageCompare-top-control-screens-item` }>
						<div><SearchIcon /></div>
						<div>{ zoom }%</div>
					</div>
					<button className={ `urlslab-ImageCompare-top-control-screens-item` }
						onClick={ () => handleZoomChange( zoom + 10 ) }>
						<div><SearchZoomInIcon /></div>
						<div>Zoom In</div>
					</button>
					<button className={ `urlslab-ImageCompare-top-control-screens-item` }
						onClick={ () => handleZoomChange( zoom - 10 ) }>
						<div><SearchZoomOutIcon /></div>
						<div>Zoom Out</div>
					</button>
					<div className="urlslab-ImageCompare-top-control-screens-option">
						<SingleSelectMenu
							items={ zoomingOptions }
							dark={ true }
							name="image_comparator_zoom_options"
							autoClose
							defaultValue="0"
							onChange={ ( val ) => handleZoomChange( Number( val ) ) }
						/>

					</div>
				</div>
			</div>
			<div className="urlslab-ImageCompare-panel">
				<div className="urlslab-ImageCompare-wrapper" style={ { width: wrapperWidth } }>

					<div className="urlslab-panel-close-container">
						<button className="urlslab-panel-close-container-btn" onClick={ hideImageCompare }>
							<CloseIcon />
						</button>
					</div>
					<div className="urlslab-ImageCompare-slider-container">
						<ImgComparisonSlider value="50" hover={ false }>
							<figure slot="first">
								<img src={ leftImage } alt="" className="urlslab-ImageCompare-img" />
							</figure>
							<figure slot="second">
								<img src={ rightImage } alt="" className="urlslab-ImageCompare-img" />
							</figure>
						</ImgComparisonSlider>
					</div>

				</div>
			</div>
		</div>
	);
};

export default memo( ImageCompare );
