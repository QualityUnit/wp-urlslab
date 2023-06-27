import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { useI18n } from '@wordpress/react-i18n';

import { postFetch } from '../../api/fetching';
import useCloseModal from '../../hooks/useCloseModal';
import useTablePanels from '../../hooks/useTablePanels';
import useChangeRow from '../../hooks/useChangeRow';

import Table from '../TableComponent';
import '../../assets/styles/components/_ChangesPanel.scss';
import DateTimeFormat from '../../elements/DateTimeFormat';
import Checkbox from '../../elements/Checkbox';
import Chart from './Chart';
import ImageCompare from '../ImageCompare';
import Button from '../../elements/Button';

function ChangesPanel() {
	const { __ } = useI18n();
	const columnHelper = useMemo( () => createColumnHelper(), [] );
	const { CloseIcon, handleClose } = useCloseModal();
	const { title, slug } = useTablePanels( ( state ) => state.options.changesPanel );

	const { selectedRows, selectRow } = useChangeRow( {} );

	function hidePanel() {
		handleClose();
	}

	const { data, isSuccess } = useQuery( {
		queryKey: [ slug ],
		queryFn: async () => {
			const result = await postFetch( slug );
			return result.json();
		},
		refetchOnWindowFocus: false,
	} );

	const header = {
		screenshot: __( 'Screenshot' ),
		last_seen: __( 'Crawl date' ),
		last_changed: __( 'Change date' ),
		status_code: __( 'Status' ),
		load_duration: __( 'Page load duration' ),
		word_count: __( 'Word count' ),
		requests: __( 'Page requests' ),
		page_size: __( 'Page size' ),
	};

	console.log( selectedRows );

	const columns = [
		columnHelper.accessor( 'screenshot', {
			id: 'thumb',
			className: 'nolimit thumbnail',
			cell: ( cell ) => {
				const isSelected = cell.row.getIsSelected();
				return <div className="pos-relative pl-m">
					<Checkbox className="thumbnail-check" defaultValue={ isSelected } onChange={ ( val ) => {
						selectRow( ! val, cell );
					} }
					disabled={ selectedRows.length >= 2 && ! isSelected }
					/>
					{ selectedRows.length === 2 && isSelected && cell.row.id === selectedRows[ 1 ].row.id &&
					<Button active className="thumbnail-button" onClick={ () => useTablePanels.setState( { imageCompare: true } ) }>
						Show diff
					</Button>
					}
					<span className="thumbnail-wrapper" style={ { maxWidth: '3.75rem' } }>
						<img src={ cell?.getValue().thumbnail } alt={ title } />
					</span>
				</div>;
			},
			header: () => header.screenshot,
			size: 120,
		} ),
		columnHelper.accessor( 'last_seen', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() * 1000 } />,
			header: () => header.last_seen,
			size: 80,
		} ),
		columnHelper.accessor( 'last_changed', {
			cell: ( cell ) => <DateTimeFormat datetime={ cell.getValue() * 1000 } />,
			header: () => header.last_changed,
			size: 80,
		} ),
		columnHelper.accessor( 'status_code', {
			cell: ( cell ) => {
				const status = cell.getValue();
				if ( status >= 200 && status <= 299 ) {
					return <span className="c-saturated-green">OK</span>;
				}
				if ( status >= 300 && status <= 399 ) {
					return <span className="c-saturated-orange">Redirect</span>;
				}
				return <span className="c-saturated-red">{ status }</span>;
			},
			header: () => header.status_code,
			size: 60,
		} ),
		columnHelper.accessor( 'load_duration', {
			cell: ( cell ) => `${ parseFloat( cell.getValue() / 1000 ).toFixed( 2 ) }\u00A0s`,
			header: () => header.load_duration,
			size: 150,
		} ),
		columnHelper.accessor( 'word_count', {
			header: () => header.word_count,
			size: 100,
		} ),
		columnHelper.accessor( 'requests', {
			header: () => header.requests,
			size: 150,
		} ),
		columnHelper.accessor( 'page_size', {
			cell: ( cell ) => `${ parseFloat( cell.getValue() / 1024 / 1024 ).toFixed( 2 ) }\u00A0MB`,
			header: () => header.page_size,
			size: 150,
		} ),
	];

	const chartData = isSuccess && [ ...data ]?.reverse();

	return (
		<>
			{ selectedRows.length === 2 &&
			<ImageCompare selectedRows={ selectedRows } />
			}
			<div className={ `urlslab-panel-wrap urlslab-panel-modal urlslab-changesPanel-wrap fadeInto` }>
				<div className="urlslab-panel urlslab-changesPanel customPadding">
					<div className="urlslab-panel-header">
						<h3>{ title }</h3>
						<button className="urlslab-panel-close" onClick={ hidePanel }>
							<CloseIcon />
						</button>
					</div>
					{ chartData &&
						<Chart data={ chartData } header={ header } />
					}
					<div className="mt-l table-container">
						<Table
							slug={ slug }
							columns={ columns }
							data={ isSuccess && data }
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default memo( ChangesPanel );
