/* eslint-disable indent */
import {useCallback, useEffect, useMemo, memo} from 'react';
import {__} from '@wordpress/i18n/';

import {
    useInfiniteFetch,
    TagsMenu,
    SortBy,
    InputField,
    Checkbox,
    Loader,
    Table,
    ModuleViewHeaderBottom,
    TooltipSortingFiltering,
    RowActionButtons,
    TextArea, DateTimeFormat, Tooltip, IconButton, SvgIcon,
} from '../lib/tableImports';

import useChangeRow from '../hooks/useChangeRow';
import useTablePanels from '../hooks/useTablePanels';
import useTableStore from '../hooks/useTableStore';
import DescriptionBox from '../elements/DescriptionBox';
import Stack from "@mui/joy/Stack";
import httpStatusTypes from '../lib/httpStatuses';

const title = __('Add New Backlink Monitor');
const paginationId = 'from_url_id';
const optionalSelector = 'to_url_id';
const header = {
    from_url_name: __('From URL'),
    from_http_status: __('URL HTTP Status'),
    to_url_name: __('My Link'),
    anchor_text: __('Anchor text'),
    status: __('Backlink Status'),
    created: __('Created'),
    updated: __('Updated'),
    last_seen: __('Link last seen'),
    note: __('Notes'),
    labels: __('Tags'),
    link_attributes: __('Link attributes'),
};

const linkStatuses = {
    'N': __('Waiting'),
    'O': __('OK'),
    'M': __('Missing'),
}

export default function BacklinksTable({slug}) {
    const {
        data,
        status,
        isSuccess,
        isFetchingNextPage,
        columnHelper,
        ref,
    } = useInfiniteFetch({slug});

    const {isSelected, selectRows, deleteRow, updateRow} = useChangeRow();

    const activatePanel = useTablePanels((state) => state.activatePanel);
    const setRowToEdit = useTablePanels((state) => state.setRowToEdit);
    const setOptions = useTablePanels((state) => state.setOptions);


    useEffect(() => {
        useTableStore.setState(() => (
            {
                activeTable: slug,
                tables: {
                    ...useTableStore.getState().tables,
                    [slug]: {
                        title,
                        paginationId,
                        slug,
                        header,
                        id: 'from_url_name',
                        optionalSelector,
                    },
                },
            }
        ));
    }, [slug]);

    useEffect(() => {
        useTableStore.setState(() => (
            {
                tables: {
                    ...useTableStore.getState().tables,
                    [slug]: {
                        ...useTableStore.getState().tables[slug],
                        data,
                    },
                },
            }
        ));
    }, [data, slug]);

    const ActionHTTPStatusButton = useMemo(() => ({cell, onClick}) => {
        const {from_http_status} = cell?.row?.original;

        return (
            from_http_status > 0 &&
            <Tooltip title={__('Re-check status')} disablePortal>
                <IconButton size="xs" onClick={() => onClick('-1')}>
                    <SvgIcon name="refresh"/>
                </IconButton>
            </Tooltip>
        );
    }, []);

    const columns = useMemo(() => [
        columnHelper.accessor('check', {
            className: 'checkbox',
            cell: (cell) => <Checkbox defaultValue={isSelected(cell)} onChange={() => {
                selectRows(cell);
            }}/>,
            header: (head) => <Checkbox defaultValue={isSelected(head, true)} onChange={() => {
                selectRows(head, true);
            }}/>,
            enableResizing: false,
        }),
        columnHelper.accessor('from_url_name', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => <a href={cell.getValue()} title={cell.getValue()} target="_blank"
                               rel="noreferrer">{cell.getValue()}</a>,
            header: (th) => <SortBy {...th} />,
            minSize: 200,
        }),
        columnHelper?.accessor('from_http_status', {
            filterValMenu: httpStatusTypes,
            cell: (cell) => (
                <Stack direction="row" alignItems="center" spacing={1}>
                    <>
                        <ActionHTTPStatusButton cell={cell} onClick={(val) => updateRow({
                            optionalSelector,
                            changeField: 'from_http_status',
                            newVal: val,
                            cell
                        })}/>
                        <span>{httpStatusTypes[cell?.getValue()] ? httpStatusTypes[cell?.getValue()] : cell?.getValue()}</span>
                    </>
                </Stack>
            ),
            header: (th) => <SortBy {...th} />,
            size: 80,
        }),

        columnHelper.accessor('to_url_name', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => <a href={cell.getValue()} title={cell.getValue()} target="_blank"
                               rel="noreferrer">{cell.getValue()}</a>,
            header: (th) => <SortBy {...th} />,
            minSize: 200,
        }),

        columnHelper.accessor('status', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => (cell?.getValue() && linkStatuses[cell?.getValue()]) ? linkStatuses[cell?.getValue()] : cell?.getValue(),
            header: (th) => <SortBy {...th} />,
            minSize: 30,
        }),
        columnHelper.accessor('anchor_text', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => cell.getValue(),
            header: (th) => <SortBy {...th} />,
            minSize: 100,
        }),
        columnHelper.accessor('link_attributes', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => cell.getValue(),
            header: (th) => <SortBy {...th} />,
            minSize: 100,
        }),
        columnHelper.accessor('note', {
            tooltip: (cell) => cell.getValue(),
            cell: (cell) => cell.getValue(),
            header: (th) => <SortBy {...th} />,
            minSize: 100,
        }),

        columnHelper.accessor('created', {
            cell: (val) => <DateTimeFormat datetime={val.getValue()}/>,
            header: (th) => <SortBy {...th} />,
            minSize: 40,
        }),
        columnHelper.accessor('updated', {
            cell: (val) => <DateTimeFormat datetime={val.getValue()}/>,
            header: (th) => <SortBy {...th} />,
            minSize: 40,
        }),
        columnHelper.accessor('last_seen', {
            cell: (val) => <DateTimeFormat datetime={val.getValue()}/>,
            header: (th) => <SortBy {...th} />,
            minSize: 40,
        }),

        columnHelper.accessor('labels', {
            className: 'nolimit',
            cell: (cell) => <TagsMenu defaultValue={cell.getValue()} slug={slug} onChange={(newVal) => updateRow({
                optionalSelector,
                newVal,
                cell,
                id: 'keyword'
            })}/>,
            header: header.labels,
            size: 150,
        }),

        columnHelper.accessor('editRow', {
            className: 'editRow',
            cell: (cell) => <RowActionButtons
                onEdit={() => updateRow({cell, optionalSelector, id: 'from_url_name'})}
                onDelete={() => deleteRow({cell, optionalSelector, id: 'from_url_name'})}
            >
            </RowActionButtons>,
            header: () => null,
            size: 0,
        }),

    ], [columnHelper, deleteRow, header.labels, isSelected, selectRows, slug, updateRow]);

    if (status === 'loading') {
        return <Loader isFullscreen/>;
    }

    return (
        <>
            <DescriptionBox title={__('About this table')} tableSlug={slug} isMainTableDescription>
                {__("Implementing a regular backlinks monitoring schedule is indispensable for maintaining the integrity and efficacy of your website's backlink profile. By keeping a vigilant watch on your backlinks, you ensure that the connections you've cultivated with various online partners remain robust and continue to contribute positively to your site's SEO. With an effective monitoring system in place, you empower your outreach team to quickly identify when previously established backlinks are no longer present on your partners' websites. Promptly noticing these changes allows you to be proactive and engage in constructive dialogue with your partners. You can inquire about the disappearance of the agreed-upon links and work collaboratively to resolve any issues. This proactive approach is both beneficial for the relationship with your partners and crucial for sustaining your website's SEO health. Maintaining existing backlinks is generally more cost-efficient than acquiring new ones, as the process of building new partnerships and securing new links often requires a significant investment of time, effort, and sometimes financial resources. Thus, restoring access to backlinks that have been removed—preserving the value of your already invested resources—is a strategic advantage.")}
            </DescriptionBox>

            <ModuleViewHeaderBottom/>

            <Table className="fadeInto"
                   initialState={{
                       columnVisibility: {
                           created: false,
                           updated: false,
                           note: false,
                           anchor_text: false,
                           link_attributes: false
                       }
                   }}
                   columns={columns}
                   data={isSuccess && data?.pages?.flatMap((page) => page ?? [])}
                   referrer={ref}
                   loadingRows={isFetchingNextPage}
            >
                <TooltipSortingFiltering/>
            </Table>
            <TableEditorManager slug={slug}/>
        </>
    );
}


const TableEditorManager = memo(({slug}) => {
    const setRowToEdit = useTablePanels((state) => state.setRowToEdit);
    const rowToEdit = useTablePanels((state) => state.rowToEdit);

    const rowEditorCells = useMemo(() => ({
        from_url_name: <InputField liveUpdate autoFocus defaultValue="" label={header.from_url_name}
                                   onChange={(val) => {
                                       setRowToEdit({from_url_name: val});
                                   }} required
                                   description={__('Enter URL of page where you arranged backlink to your website and you want to monitor it.')}/>,

        to_url_name: <InputField liveUpdate defaultValue="" label={header.to_url_name} onChange={(val) => {
            setRowToEdit({to_url_name: val});
        }} required
                                 description={__('Specify the URL included in the content of the monitored webpage. If you enter just your domain name without specific path, we will check if there is ANY link to your domain.')}/>,

        note: <TextArea rows="5"
                        description={__('Add a note about the monitored backlink. For example, record the contact details of the partner responsible for managing the backlink.')}
                        liveUpdate defaultValue="" label={header.note} onChange={(val) => setRowToEdit({note: val})}/>,

        labels: <TagsMenu optionItem label={header.labels} slug={slug}
                          onChange={(val) => setRowToEdit({labels: val})}/>,

    }), [rowToEdit?.from_url_name, rowToEdit?.to_url_name, setRowToEdit, slug]);

    useEffect(() => {
        useTablePanels.setState(() => (
            {
                ...useTablePanels.getState(),
                rowEditorCells,
                deleteCSVCols: [paginationId, 'to_url_id'],
            }
        ));
    }, [rowEditorCells]);
});