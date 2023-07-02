import { memo } from 'react';
import { ImgComparisonSlider } from '@img-comparison-slider/react';
import DateTimeFormat from '../elements/DateTimeFormat';
import { ReactComponent as CloseIcon } from '../assets/images/icons/icon-close.svg';
import useTablePanels from '../hooks/useTablePanels';
import '../assets/styles/components/_ImageCompare.scss';

const ImageCompare = ( { selectedRows } ) => {
	const image1 = selectedRows[ 0 ].cell.getValue().full;
	const image1Date = selectedRows[ 0 ].row.original.last_seen * 1000;
	const image2 = selectedRows[ 1 ].cell.getValue().full;
	const image2Date = selectedRows[ 1 ].row.original.last_seen * 1000;
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

					<ImgComparisonSlider value="50" hover={ false }>
						<figure slot="first">
							<img src={ image1 } alt="" className="urlslab-ImageCompare-img" />
							<figcaption>
								<DateTimeFormat datetime={ image1Date } />
							</figcaption>
						</figure>
						<figure slot="second">
							<img src={ image2 } alt="" className="urlslab-ImageCompare-img" />
							<figcaption>
								<DateTimeFormat datetime={ image2Date } />
							</figcaption>
						</figure>
					</ImgComparisonSlider>
				</div>
			}
		</div>
	);
};

export default memo( ImageCompare );
