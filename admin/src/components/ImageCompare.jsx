import { memo } from 'react';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import useTablePanels from '../hooks/useTablePanels';
import '../assets/styles/components/_ImageCompare.scss';

const ImageCompare = ( { selectedRows } ) => {
	const image1 = selectedRows[ 0 ].cell.getValue().full;
	const image2 = selectedRows[ 1 ].cell.getValue().full;
	const imageCompare = useTablePanels( ( state ) => state.imageCompare );

	const hideImageCompare = () => {
		useTablePanels.setState( { imageCompare: false } );
	};

	return (
		imageCompare &&
		<div className="urlslab-ImageCompare">
			<button className="urlslab-panel-close" onClick={ hideImageCompare }>
				<CloseIcon />
			</button>
			{
				<div className="urlslab-ImageCompare-wrapper">

					<ImgComparisonSlider>
						<img slot="first" src={ image1 } alt="" className="urlslab-ImageCompare-img" />
						<img slot="second" src={ image2 } alt="" className="urlslab-ImageCompare-img" />
					</ImgComparisonSlider>
				</div>
			}
		</div>
	);
};

export default memo( ImageCompare );
