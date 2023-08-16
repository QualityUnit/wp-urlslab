import { memo, useEffect, useRef, useState } from 'react';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import { ReactComponent as AdjacentScreenIcon } from '../assets/images/icons/icon-adjacent-screen.svg';
import { ReactComponent as OverlayScreenIcon } from '../assets/images/icons/icon-overlay-no-diff.svg';
import { ReactComponent as OverlayWithDiffIcon } from '../assets/images/icons/icon-overlay-with-diff.svg';
import { ReactComponent as SearchZoomInIcon } from '../assets/images/icons/icon-search-zoom-in.svg';
import { ReactComponent as SearchZoomOutIcon } from '../assets/images/icons/icon-search-zoom-out.svg';
import useTablePanels from '../hooks/useTablePanels';
import '../assets/styles/components/_ImageCompare.scss';
import SingleSelectMenu from '../elements/SingleSelectMenu';
import Loader from './Loader';

const ImageCompare = ( { selectedRows, allChanges } ) => {
	const { date, getSettings } = window.wp.date;
	const SCREENSHOT_WIDTH = 1366;
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
	const [ zoom, setZoom ] = useState( 50 );
	const [ baseWrapperWidth, setBaseWrapperWidth ] = useState( 0 );
	const [ render, setRender ] = useState( true );
	const [ diffStarted, startDiff ] = useState( false );
	const [ diffLoading, setDiffLoading ] = useState( false );
	const leftImageRef = useRef( null );
	const rightImageRef = useRef( null );
	const adjacentImageRef = useRef( null );
	const overlayBeforeImageRef = useRef( null );
	const overlayAfterImageRef = useRef( null );
	const imageCompare = useTablePanels( ( state ) => state.imageCompare );

	const hideImageCompare = () => {
		useTablePanels.setState( { imageCompare: false } );
	};

	const handleImageChange = ( newImage, isLeft ) => {
		if ( isLeft ) {
			if ( newImage === leftImage ) {
				return false;
			}

			setRender( true );
			startDiff( false );
			setDiffLoading( false );
			setLeftImage( allChanges.filter( ( change ) => change.last_changed * 1000 === Number( newImage ) )[ 0 ].screenshot.full );
			setLeftImageKey( newImage );
			return true;
		}

		if ( rightImage ) {
			if ( newImage === rightImage ) {
				return false;
			}

			setRender( true );
			startDiff( false );
			setDiffLoading( false );
			setRightImage( allChanges.filter( ( change ) => change.last_changed * 1000 === Number( newImage ) )[ 0 ].screenshot.full );
			setRightImageKey( newImage );
			return true;
		}

		return false;
	};

	const handleZoomChange = ( newZoom ) => {
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

	const prepareImagesHeight = ( imageLeftElem, imageRightElem ) => {
		imageLeftElem.crossOrigin = 'Anonymous';
		imageRightElem.crossOrigin = 'Anonymous';

		if ( imageLeftElem.height <= 0 || imageRightElem.height <= 0 ) {
			return -1;
		}

		const returningHeight = Math.max( imageLeftElem.height, imageRightElem.height );
		if ( imageLeftElem.height !== imageRightElem.height ) {
			const canvas = document.createElement( 'canvas' );
			const ctx = canvas.getContext( '2d' );
			if ( imageLeftElem.height < imageRightElem.height ) {
				canvas.width = imageLeftElem.width;
				canvas.height = imageRightElem.height;
				ctx.beginPath();
				ctx.rect( 0, 0, canvas.width, canvas.height );
				ctx.fillStyle = 'black';
				ctx.fill();

				ctx.drawImage( imageLeftElem, 0, 0, imageLeftElem.width, imageLeftElem.height );
				setLeftImage( canvas.toDataURL( 'image/png' ) );
			} else {
				canvas.width = imageRightElem.width;
				canvas.height = imageLeftElem.height;
				ctx.beginPath();
				ctx.rect( 0, 0, canvas.width, canvas.height );
				ctx.fillStyle = 'black';
				ctx.fill();

				ctx.drawImage( imageRightElem, 0, 0, imageRightElem.naturalWidth, imageRightElem.naturalHeight );
				setRightImage( canvas.toDataURL( 'image/png' ) );
			}
		}

		return returningHeight;
	};

	const prepareImages = async () => {
		// eslint-disable-next-line no-undef
		const image1Elem = new Image();
		// eslint-disable-next-line no-undef
		const image2Elem = new Image();

		return new Promise( ( resolve, reject ) => {
			image1Elem.onload = () => {
				if ( image2Elem.complete ) {
					const imageHeight = prepareImagesHeight( image1Elem, image2Elem );
					if ( imageHeight === -1 ) {
						return;
					}
					resolve( calculateWrapperInitialWidth( imageHeight ) );
				}
			};
			image2Elem.onload = () => {
				if ( image1Elem.complete ) {
					const imageHeight = prepareImagesHeight( image1Elem, image2Elem );
					if ( imageHeight === -1 ) {
						return;
					}
					resolve( calculateWrapperInitialWidth( imageHeight ) );
				}
			};
			image2Elem.onerror = reject;
			image2Elem.src = rightImage;
			image1Elem.onerror = reject;
			image1Elem.src = leftImage;
		} );
	};

	const calculateWrapperInitialWidth = ( imageHeight ) => {
		const height = window.innerHeight - 24 - 100; // reducing the close button height and top control height
		return height * SCREENSHOT_WIDTH / imageHeight;
	};

	useEffect( () => {
		if ( ! render ) {
			return;
		}
		const calculateWidth = async () => {
			try {
				const width = await prepareImages();
				setZoom( Math.round( ( width / window.innerWidth ) * 100 ) );
				setBaseWrapperWidth( width );
				setWrapperWidth( width );
				setRender( false );
			} catch ( error ) {}
		};

		calculateWidth();
	}, [ leftImage, rightImage ] );

	const handleDiffStart = () => {
		if ( ! diffStarted ) {
			startDiff( true );
			setDiffLoading( true );

			// initialize canvas
			const canvasAdjacent = document.createElement( 'canvas' );
			const ctxAdjacent = canvasAdjacent.getContext( '2d' );

			const canvasOverlayBefore = document.createElement( 'canvas' );
			const ctxOverlayBefore = canvasOverlayBefore.getContext( '2d' );

			const canvasOverlayAfter = document.createElement( 'canvas' );
			const ctxOverlayAfter = canvasOverlayAfter.getContext( '2d' );
			initializeCanvas( canvasAdjacent, ctxAdjacent, canvasOverlayBefore, ctxOverlayBefore, canvasOverlayAfter, ctxOverlayAfter );

			const leftImgRef = leftImageRef.current;
			const rightImgRef = rightImageRef.current;
			const adjImgRef = adjacentImageRef.current;
			const overlayBeforeImgRef = overlayBeforeImageRef.current;
			const overlayAfterImgRef = overlayAfterImageRef.current;
			adjImgRef.crossOrigin = 'anonymous';
			overlayBeforeImgRef.crossOrigin = 'anonymous';
			overlayAfterImgRef.crossOrigin = 'anonymous';

			let worker;
			if ( window.Worker ) {
				worker = new Worker( new URL( '../comparator/diffComparator.worker.js', import.meta.url ) );
				worker.addEventListener( 'message', function( e ) {
					const added = e.data[ 0 ];
					const deleted = e.data[ 1 ];
					const modified = e.data[ 2 ];

					createAdjacentImage( added, deleted, modified, ctxAdjacent, leftImgRef, rightImgRef );
					createOverlayImageAfter( added, modified, ctxOverlayAfter, rightImgRef );
					createOverlayImageBefore( deleted, modified, ctxOverlayBefore, leftImgRef );

					adjImgRef.crossOrigin = 'anonymous';
					overlayBeforeImgRef.crossOrigin = 'anonymous';
					overlayAfterImgRef.crossOrigin = 'anonymous';
					adjImgRef.src = canvasAdjacent.toDataURL( 'image/png' );
					overlayBeforeImgRef.src = canvasOverlayAfter.toDataURL( 'image/png' );
					overlayAfterImgRef.src = canvasOverlayBefore.toDataURL( 'image/png' );
					setDiffLoading( false );
				} );

				const imagesData = getImagesData();

				worker.postMessage( [
					{
						src: imagesData[ 0 ].data,
						width: SCREENSHOT_WIDTH,
						height: leftImageRef.current.naturalHeight,
					},
					{
						src: imagesData[ 1 ].data,
						width: SCREENSHOT_WIDTH,
						height: rightImageRef.current.naturalHeight,
					} ]
				);
			}
		}
	};

	const getImagesData = () => {
		const leftImageCanvas = document.createElement( 'canvas' );
		leftImageCanvas.width = SCREENSHOT_WIDTH;
		leftImageCanvas.height = leftImageRef.current.naturalHeight;

		const leftImageCtx = leftImageCanvas.getContext( '2d' );
		const rightImageCanvas = document.createElement( 'canvas' );
		rightImageCanvas.width = SCREENSHOT_WIDTH;
		rightImageCanvas.height = rightImageRef.current.naturalHeight;

		const rightImageCtx = rightImageCanvas.getContext( '2d' );

		leftImageCtx.drawImage( leftImageRef.current, 0, 0 );
		rightImageCtx.drawImage( rightImageRef.current, 0, 0 );

		return [
			leftImageCtx.getImageData( 0, 0, SCREENSHOT_WIDTH, leftImageRef.current.naturalHeight ),
			rightImageCtx.getImageData( 0, 0, SCREENSHOT_WIDTH, rightImageRef.current.naturalHeight ),
		];
	};

	const initializeCanvas = ( cAdjacent, ctxAdjacent, cOverlayBefore, ctxOverlayBefore, cOverlayAfter, ctxOverlayAfter ) => {
		cAdjacent.width = ( 2 * SCREENSHOT_WIDTH ) + 50;
		cAdjacent.height = leftImageRef.current.naturalHeight;

		cOverlayBefore.width = rightImageRef.current.naturalWidth;
		cOverlayBefore.height = rightImageRef.current.naturalHeight;

		cOverlayAfter.width = leftImageRef.current.naturalWidth;
		cOverlayAfter.height = leftImageRef.current.naturalHeight;

		ctxAdjacent.beginPath();
		ctxAdjacent.rect( 0, 0, cAdjacent.width, cAdjacent.height );
		ctxAdjacent.fillStyle = 'black';
		ctxAdjacent.fill();

		ctxOverlayBefore.beginPath();
		ctxOverlayBefore.rect( 0, 0, cOverlayBefore.width, cOverlayBefore.height );
		ctxOverlayBefore.fillStyle = 'black';
		ctxOverlayBefore.fill();

		ctxOverlayAfter.beginPath();
		ctxOverlayAfter.rect( 0, 0, cOverlayAfter.width, cOverlayAfter.height );
		ctxOverlayAfter.fillStyle = 'black';
		ctxOverlayAfter.fill();
	};

	const createAdjacentImage = ( added, deleted, modified, ctx, leftImgRef, rightImgRef ) => {
		ctx.drawImage( leftImgRef, 0, 0 );
		ctx.drawImage( rightImgRef, SCREENSHOT_WIDTH + 50, 0 );

		deleted.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
			ctx.fillRect( 0, idx, SCREENSHOT_WIDTH, 1 );
		} );
		added.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
			ctx.fillRect( SCREENSHOT_WIDTH + 50, idx, SCREENSHOT_WIDTH, 1 );
		} );
		modified.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
			ctx.fillRect( 0, idx.beforeIndex, SCREENSHOT_WIDTH, 1 );
			ctx.fillRect( SCREENSHOT_WIDTH + 50, idx.afterIndex, SCREENSHOT_WIDTH, 1 );
			ctx.beginPath();
			ctx.moveTo( SCREENSHOT_WIDTH, idx.beforeIndex );
			ctx.lineTo( SCREENSHOT_WIDTH + 50, idx.afterIndex );
			ctx.strokeStyle = '#fff';
			ctx.stroke();
		} );
	};

	const createOverlayImageAfter = ( added, modified, ctx, rightImgRef ) => {
		ctx.drawImage( rightImgRef, 0, 0 );

		added.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
			ctx.fillRect( 0, idx, SCREENSHOT_WIDTH, 1 );
		} );
		modified.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
			ctx.fillRect( 0, idx.afterIndex, SCREENSHOT_WIDTH, 1 );
		} );
	};

	const createOverlayImageBefore = ( deleted, modified, ctx, leftImgRef ) => {
		ctx.drawImage( leftImgRef, 0, 0 );

		deleted.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
			ctx.fillRect( 0, idx, SCREENSHOT_WIDTH, 1 );
		} );
		modified.forEach( ( idx ) => {
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
			ctx.fillRect( 0, idx.beforeIndex, SCREENSHOT_WIDTH, 1 );
		} );
	};

	const handleScreenChange = ( screen ) => {
		setActiveScreen( screen );
		if ( screen === 'overlayWithDiff' || screen === 'adjacent' ) {
			handleDiffStart();
		}
	};

	return (
		imageCompare && wrapperWidth > 0 &&
		<div className="urlslab-ImageCompare">
			<div className="urlslab-ImageCompare-top-control">
				<div className="urlslab-ImageCompare-top-control-screens">
					<button className={ `urlslab-ImageCompare-top-control-screens-item ${ activeScreen === 'overlay' ? 'active' : '' }` }
						onClick={ () => handleScreenChange( 'overlay' ) }>
						<div><OverlayScreenIcon /></div>
						<div>Overlay</div>
					</button>
					<button className={ `urlslab-ImageCompare-top-control-screens-item ${ activeScreen === 'overlayWithDiff' ? 'active' : '' }` }
						onClick={ () => handleScreenChange( 'overlayWithDiff' ) }>
						<div><OverlayWithDiffIcon /></div>
						<div>Diff</div>
					</button>
					<button className={ `urlslab-ImageCompare-top-control-screens-item ${ activeScreen === 'adjacent' ? 'active' : '' }` }
						onClick={ () => handleScreenChange( 'adjacent' ) }>
						<div><AdjacentScreenIcon /></div>
						<div>Side by Side</div>
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
					<button className={ `urlslab-ImageCompare-top-control-screens-item` }
						onClick={ () => handleZoomChange( zoom + 10 ) }>
						<div><SearchZoomInIcon /></div>
						<div>{ zoom }%</div>
					</button>
					<button className={ `urlslab-ImageCompare-top-control-screens-item` }
						onClick={ () => handleZoomChange( zoom - 10 ) }>
						<div><SearchZoomOutIcon /></div>
						<div>{ zoom }%</div>
					</button>
					<div className="urlslab-panel-close-container">
						<button className="urlslab-panel-close-container-btn" onClick={ hideImageCompare }>
							<CloseIcon />
						</button>
					</div>
				</div>
			</div>
			<div className="urlslab-ImageCompare-panel">
				<div className="urlslab-ImageCompare-wrapper" style={ { width: wrapperWidth } }>

					<div className="urlslab-ImageCompare-slider-container">
						{
							<div className={ ! diffLoading && activeScreen === 'overlay' ? '' : 'hidden' }>
								<ImgComparisonSlider value="50" hover={ false }>
									<figure slot="first">
										<img ref={ leftImageRef } src={ leftImage } crossOrigin="Anonymous" alt="" className="urlslab-ImageCompare-img" />
									</figure>
									<figure slot="second">
										<img ref={ rightImageRef } src={ rightImage } crossOrigin="Anonymous" alt="" className="urlslab-ImageCompare-img" />
									</figure>
								</ImgComparisonSlider>
							</div>
						}

						{
							<div className={ ! diffLoading && activeScreen === 'overlayWithDiff' ? '' : 'hidden' }>
								<ImgComparisonSlider value="50" hover={ false }>
									<figure slot="first">
										<img ref={ overlayBeforeImageRef } alt="left-diff-overlay" className="urlslab-ImageCompare-img" />
									</figure>
									<figure slot="second">
										<img ref={ overlayAfterImageRef } alt="right-diff-overlay" className="urlslab-ImageCompare-img" />
									</figure>
								</ImgComparisonSlider>
							</div>
						}

						{
							<img
								ref={ adjacentImageRef }
								alt="adjacent screen"
								className={ `urlslab-ImageCompare-img ${ ! diffLoading && activeScreen === 'adjacent' ? '' : 'hidden' }` }
							/>
						}

						{ diffLoading && <Loader className="dark" /> }

					</div>

				</div>
			</div>
		</div>
	);
};

export default memo( ImageCompare );
