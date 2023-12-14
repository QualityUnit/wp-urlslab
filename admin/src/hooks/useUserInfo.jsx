/**
 * Hook to get user data
 */

import useUserInfoQuery from '../queries/useUserInfoQuery';
import useCheckApiKey from './useCheckApiKey';

export default function useUserInfo() {
	const { apiKeySet } = useCheckApiKey();
	const { data: userInfo } = useUserInfoQuery();

	return {
		isPaidUser: apiKeySet,
		userCompletedOnboarding: userInfo?.onboarding_finished,
	};
}
