import { memo, useEffect, useState } from 'react';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import DateTimeFormat from '../elements/DateTimeFormat';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import { ReactComponent as AdjacentScreenIcon } from '../assets/images/icons/icon-adjacent-screen.svg';
import { ReactComponent as OverlayScreenIcon } from '../assets/images/icons/icon-overlay-no-diff.svg';
import { ReactComponent as OverlayWithDiffIcon } from '../assets/images/icons/icon-overlay-with-diff.svg';
import useTablePanels from '../hooks/useTablePanels';
import '../assets/styles/components/_ImageCompare.scss';

const ImageCompare = ( { selectedRows } ) => {
	const image1 = selectedRows[ 0 ].cell.getValue().full;
	const image1Date = selectedRows[ 0 ].row.original.last_seen * 1000;
	const image2 = selectedRows[ 1 ].cell.getValue().full;
	const image2Date = selectedRows[ 1 ].row.original.last_seen * 1000;
	const [ wrapperWidth, setWrapperWidth ] = useState( 0 );
	const [ activeScreen, setActiveScreen ] = useState( 'overlay' ); // ['overlay', 'overlayWithDiff', 'adjacent']
	const imageCompare = useTablePanels( ( state ) => state.imageCompare );

	const hideImageCompare = () => {
		useTablePanels.setState( { imageCompare: false } );
	};

	const calculateWrapperWidth = () => {
		const image1Elem = new Image();
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
				image2Elem.src = image2;
			};
			image1Elem.onerror = reject;
			image1Elem.src = image1;
		} );
	};

	useEffect( () => {
		const calculateWidth = async () => {
			try {
				const width = await calculateWrapperWidth();
				console.log( 'width', width );
				setWrapperWidth( width );
			} catch ( error ) {
				console.error( 'Error calculating wrapper width:', error );
			}
		};

		calculateWidth();
	}, [] );

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

				</div>
				<div className="urlslab-ImageCompare-top-control-zoom">

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
								<img src={ image1 } alt="" className="urlslab-ImageCompare-img" />
							</figure>
							<figure slot="second">
								<img src={ image2 } alt="" className="urlslab-ImageCompare-img" />
							</figure>
						</ImgComparisonSlider>
					</div>

				</div>
			</div>
		</div>
	);
};

export default memo( ImageCompare );
