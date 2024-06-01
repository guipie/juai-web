import { BACKEND_ERROR_CODE, createFlatRequest } from '@sa/axios';
import { localStg } from '@/utils/storage';
import { NOT_LOGGED_IN_CODE, NOT_PERSSION_CODE } from '~/packages/axios/src/constant';
import { createServiceConfig } from '@/utils/service';

const { baseURL } = createServiceConfig(import.meta.env);
interface InstanceState {
  /** whether the request is refreshing token */
  isRefreshingToken: boolean;
}

export const request = createFlatRequest<App.Service.Response, InstanceState>(
  {
    baseURL: baseURL,
    headers: {
      "X-Authorization": `Bearer ${localStg.get('refreshToken')}`
    },
    timeout: 10000
  },
  {
    async onRequest(config) {
      window.$loadingBar?.start();
      const { headers } = config;
      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      console.log("isBackendSuccess:", response);
      return (response.status === 200 && response.data.code === 200) || response.request.responseURL.endsWith("/chat");
    },
    async onBackendFail(_response, instance) {
      // when the backend response code is not "0000", it means the request is fail
      // for example: the token is expired, refetch token and retry request

      console.log("onBackendFail:", _response);
      // if (_response.data.code == 401 || _response.data.code == 403) {
      //   if (request.state.isRefreshingToken) {
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
      //     if (request.state.isRefreshingToken)
      //       await new Promise((resolve) => setTimeout(resolve, 2000));
      //     if (request.state.isRefreshingToken)
      //       await new Promise((resolve) => setTimeout(resolve, 3000));
      //     _response.config.headers.Authorization = `Bearer ${localStg.get('token')}`;
      //     return instance.request(_response.config) as Promise<AxiosResponse>;
      //   }
      //   request.state.isRefreshingToken = true;
      //   let refreshSuccess = await handleRefreshToken();
      //   request.state.isRefreshingToken = false;
      //   debugger
      //   if (refreshSuccess) {
      //     _response.config.headers.Authorization = `Bearer ${localStg.get('token')}`;
      //     return instance.request(_response.config) as Promise<AxiosResponse>;
      //   }
      // }
      // else if (_response.status === 200 && typeof _response.data != "string" && _response.data.code != 200) {
      //   window.$notification?.warning({ content: _response.data.message, duration: 5000, title: "警告提示" });
      // }
      if (_response.data.code != 200 && _response.data.message)
        window.$notification?.error({ title: "错误提示", content: _response.data.message, duration: 8000 });
      return _response;
    },
    transformBackendResponse(response) {
      if (response.headers['access-token'] && response.headers['x-access-token']) {
        localStg.set('token', response.headers['access-token']);
        localStg.set('refreshToken', response.headers['x-access-token']);
      }
      window.$loadingBar?.finish();
      return response.data.result;
    },
    onError(error) {
      console.log("onError", error);
      window.$loadingBar?.error();
      // when the request is fail, you can show error message
      let message = error.message;
      // show backend error message
      if (error.response?.status === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message ?? (error.response?.data as unknown as string) ?? message;
      }
      else if (error.response?.status == NOT_LOGGED_IN_CODE || error.response?.status == NOT_PERSSION_CODE) {
        message = "登录已过期，请重新登录.";
      }
      window.$message?.destroyAll();
      window.$notification?.error({ content: message, duration: 6000, title: "错误提示" });
      throw new Error(message);
    }
  }
);
// export const demoRequest = createRequest<App.Service.DemoResponse>(
//   {
//     baseURL: isHttpProxy ? createProxyPattern('demo') : otherBaseURL.demo
//   },
//   {
//     async onRequest(config) {
//       const { headers } = config;

//       // set token
//       const token = localStg.get('token');
//       const Authorization = token ? `Bearer ${token}` : null;
//       Object.assign(headers, { Authorization });

//       return config;
//     },
//     isBackendSuccess(response) {
//       // when the backend response code is "200", it means the request is success
//       // you can change this logic by yourself
//       return response.data.status === '200';
//     },
//     async onBackendFail(_response) {
//       // when the backend response code is not "200", it means the request is fail
//       // for example: the token is expired, refetch token and retry request
//     },
//     transformBackendResponse(response) {
//       return response.data.result;
//     },
//     onError(error) {
//       // when the request is fail, you can show error message

//       let message = error.message;

//       // show backend error message
//       if (error.code === BACKEND_ERROR_CODE) {
//         message = error.response?.data?.message || message;
//       }

//       window.$message?.error(message);
//     }
//   }
// );
