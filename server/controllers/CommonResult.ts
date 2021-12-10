export enum BaseCode {
  SUCCESS = 200, //操作成功

  FAILED = 500, //操作失败

  PARAM_FAILED = 10001, //参数不全

  DATA_NOT_EXIST = 10002, //数据不存在

  DICT_NOT_EXIST = 10003, //字典不存在

  UPDATE_IDAUDITING_FAILED = 10004, //更新审核流程ID失败

  APPROVAL_FAILED = 10005, //审批服务统一错误码
}

/**
 * 成功返回
 */
export function success(data: any, msg?: String) {
  return {
    code: BaseCode.SUCCESS,
    msg: msg || '操作成功',
    data: data,
  };
}

/**
 * 失败返回
 */
export function failed(code?: number, msg?: String) {
  return {
    code: code || BaseCode.FAILED,
    msg: msg || '操作失败',
  };
}
