import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api/user/auth';

/**
 * refresh token
 *
 * @param axiosConfig - request config when the token is expired
 */
export async function handleRefreshToken(refreshToken?: string | null) {
  const { userInfo } = useAuthStore();
  refreshToken = refreshToken ?? (localStg.get('refreshToken'));
  const { error, data } = await fetchRefreshToken(refreshToken!);
  console.log(data);

  if (!error && data) {
    userInfo.accessToken = refreshToken!;
    userInfo.refreshToken = data;
    localStg.set('token', refreshToken!);
    localStg.set('refreshToken', data);
    return true;
  }
  return false;
}
