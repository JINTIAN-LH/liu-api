// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getAvatar POST /api/common/avatar */
export async function getAvatarUsingPost(body: { name?: string }, options?: { [key: string]: any }) {
  return request<API.BaseResponsestring>('/api/common/avatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
