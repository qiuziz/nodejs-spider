/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-15 10:33:02
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-15 16:45:48
 */
import Taro from '@tarojs/taro';

export const CloudResouce =  {
  getImgs: (data: any) => CloudRequest('getImgs', data),
  getLikeImgs: (data: any) => CloudRequest('getLikeImgs', data),
  like: (data: any) => CloudRequest('like', data),
  unlike: (data: any) => CloudRequest('unlike', data),
  deleteImg: (data: any) => CloudRequest('deleteImg', data),
  login: (data: any) => CloudRequest('login', data),
}

const CloudRequest = async (fun: string, bodyParams: any) => {
  try {
    let res: any = await Taro.cloud.callFunction({
      name: 'api',
      data: {
        fun,
        data: bodyParams
      }
    });
    console.log(res);
    const { result = {} } = res;
    if (result && result.errmsg) {
      Taro.showToast({ title: result.errmsg, icon: 'none', });
      throw result.errmsg;
    }
    return res;
  }
  catch (err) {
    throw err;
  }
}
