
export default function cronReducer( state, action ) {
	switch ( action.type ) {
		case 'setCronRun':
			return {
				...state,
				cronRunning: action.cronRunning,
			};
		case 'setCronTasks':
			return {
				...state,
				cronTasksResult: action.cronTasksResult,
			};
		case 'setCronPanelActive':
			return {
				...state,
				cronPanelActive: action.cronPanelActive,
			};
		case 'setCronPanelError':
			return {
				...state,
				cronPanelError: action.cronPanelError,
			};
		default:
			return state;
	}
}
