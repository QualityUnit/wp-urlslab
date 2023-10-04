/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useI18n} from '@wordpress/react-i18n';
import {memo, useMemo, useRef, useState} from 'react';
import {createColumnHelper} from '@tanstack/react-table';
import {useQuery} from '@tanstack/react-query';
import useTablePanels from '../hooks/useTablePanels';

import {getSimilarUrls} from '../lib/serpUrls';

import Loader from '../components/Loader';
import Table from '../components/TableComponent';
import InputField from '../elements/InputField';
import {getTooltipUrlsList} from '../lib/elementsHelpers';
import {SortBy, TooltipSortingFiltering} from '../lib/tableImports';
import Button from '@mui/joy/Button';
import ProgressBar from '../elements/ProgressBar';
import ExportCSVButton from '../elements/ExportCSVButton';
import useCloseModal from '../hooks/useCloseModal';
import ColumnsMenu from '../elements/ColumnsMenu';

function SerpUrlDetailSimilarUrlsTable({url, slug}) {
    const {__} = useI18n();
    const columnHelper = useMemo(() => createColumnHelper(), []);
    const {activatePanel, setOptions} = useTablePanels();
    const [exportStatus, setExportStatus] = useState();
    const stopFetching = useRef(false);
    const defaultSorting = [ { key: 'comp_intersections', dir: 'DESC', op: '<' } ];
    const {handleClose} = useCloseModal();

    const hidePanel = () => {
        stopFetching.current = true;

        handleClose();
    };

    const handleExportStatus = (val) => {
        setExportStatus(val);
        if (val === 100) {
            setTimeout(() => {
                setExportStatus();
            }, 1000);
        }
    };

    const {data: similarQueries, isSuccess: UrlsSuccess} = useQuery({
        queryKey: [slug, url],
        sorting: defaultSorting,
        queryFn: async () => {
            return await getSimilarUrls(url);
        },
    });

    const header = {
        url_name: __('URL'),
    };

    const cols = [
        columnHelper.accessor('url_name', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => cell.getValue(),
            header: (th) => <SortBy {...th} customHeader={header}/>,
            size: 100,
        }),
    ];

    return (
        <div>
            <div className="urlslab-serpPanel-title">
                <div className="urlslab-serpPanel-description">
                    <h4>{__('Similar URLs intersecting through ranked queries')}</h4>
                    <p>{__('Table shows list of URLs most similar to selected URL based on number of intersecting queries')}</p>
                </div>
            </div>

            {!UrlsSuccess && <Loader/>}
            {UrlsSuccess && similarQueries?.length > 0 &&
                <div className="urlslab-panel-content">

                    <div className="mt-l mb-l table-container">
                        <Table
                            columns={cols}
                            data={UrlsSuccess && similarQueries}
                        >
                            <TooltipSortingFiltering/>
                        </Table>
                    </div>

                    <div className="mt-l padded">
                        {exportStatus
                            ? <ProgressBar className="mb-m" notification="Exporting…" value={exportStatus}/>
                            : null
                        }
                    </div>
                    <div className="flex mt-m ma-left">
                        <Button variant="plain" color="neutral" onClick={hidePanel}
                                sx={{ml: 'auto'}}>{__('Cancel')}</Button>
                        <ExportCSVButton
                            className="ml-s"
                            options={{slug: 'serp-urls/url/queries', stopFetching, fetchBodyObj: {url}}}
                            onClick={handleExportStatus}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default memo(SerpUrlDetailSimilarUrlsTable);
