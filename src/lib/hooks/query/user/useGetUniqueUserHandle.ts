import { createMutation } from 'react-query-kit';
import { queryKeys } from '../queryKeys';
import { RouteHandlerErrorBody } from '@/lib/types/api.types';
import { endpoints } from '@/lib/endpoints';

type Data = {
  userHandle: string;
};

type Variables = {
  base: string;
};

export const useGetUniqueUserHandle = createMutation<
  Data,
  Variables,
  RouteHandlerErrorBody
>({
  mutationKey: [queryKeys.user.getUniqueUserHandle],
  mutationFn: async ({ base }) => {
    const response = await fetch(endpoints.user.getUniqueUserHandle, {
      method: 'POST',
      body: JSON.stringify({
        base,
      }),
    });
    const data = await response.json();
    return data;
  },
});
