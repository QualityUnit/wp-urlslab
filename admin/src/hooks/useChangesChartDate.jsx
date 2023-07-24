import { useState } from 'react';

export default function useChangesChartDate() {
	const [ startDate, setStartDate ] = useState( Math.floor( new Date().setDate( new Date().getDate() - 90 ) / 1000 ) );
	const [ endDate, setEndDate ] = useState( Math.floor( new Date() / 1000 ) );

	return {
		startDate, setStartDate, endDate, setEndDate,
	};
}
