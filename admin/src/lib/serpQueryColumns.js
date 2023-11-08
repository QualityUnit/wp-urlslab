import {__} from "@wordpress/i18n";

export const queryTypes = {
    U: __('User Defined'),
    C: __('Search Console'),
    S: __('People also search for'),
    F: __('People also ask'),
};

export const queryStatuses = {
    X: __('Not processed'),
    P: __('Processing'),
    A: __('Processed'),
    E: __('Disabled'),
    S: __('Irrelevant'),
};

export const countryVolumeStatuses = {
    N: __('Waiting'),
    P: __('Processing'),
    F: __('Available'),
    E: __('Not available'),
};

export const queryScheduleIntervals = {
    D: __('Daily'),
    W: __('Weekly'),
    M: __('Monthly'),
    Y: __('Yearly'),
    O: __('Once'),
    '': __('System Default'),
};
export const queryLevels = {
    H: __('High'),
    M: __('Medium'),
    L: __('Low'),
    '': __('-'),
};

export const queryIntents = {
    U: __('Undefined'),
    O: __('Other'),
    Q: __('Question'),
    I: __('Informational'),
    C: __('Commercial'),
    N: __('Navigational'),
    T: __('Transactional'),
};

export const queryHeaders = {
    query: __('Query'),
    country: __('Country'),
    type: __('Type'),
    status: __('Status'),
    'updated': __('Updated'),
    comp_intersections: __('Competitors in top 10'),
    comp_urls: __('Competitor URLs'),
    my_position: __('My Position'),
    my_urls: __('My URLs'),
    my_urls_ranked_top10: __('My URLs in Top10'),
    my_urls_ranked_top100: __('My URLs in Top100'),
    internal_links: __('Internal Links'),
    schedule_interval: __('Update Interval'),
    schedule: __('Next update'),
    country_vol_status: __('Volumes Status'),
    country_last_updated: __('Volumes Updated'),
    country_volume: __('Volume'),
    country_kd: __('Competition Index'),
    country_level: __('Level'),
    country_high_bid: __('High Bid'),
    country_low_bid: __('Low Bid'),
    intent: __('Intent'),
    labels: __('Tags'),
};

