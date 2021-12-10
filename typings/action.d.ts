interface ActionDataI {}

type NotificationType =
  | 'create_quality_inspect_plan'
  | 'update_quality_inspect_plan'
  | 'delete_quality_inspect_plan'
  | 'create_quality_inspect_subject'
  | 'update_quality_inspect_subject'
  | 'delete_quality_inspect_subject'
  | 'create_quality_inspect_report'
  | 'update_quality_inspect_report'
  | 'delete_quality_inspect_report'
  | 'create_quality_inspect_checkItem'
  | 'update_quality_inspect_checkItem'
  | 'delete_quality_inspect_checkItem'
  | 'create_quality_inspect_rectification'
  | 'update_quality_inspect_rectification'
  | 'create_quality_inspect_task'
  | 'update_quality_inspect_task'
  | 'delete_quality_inspect_task'
  | 'create_company'
  | 'update_company'
  | 'delete_company'
  | 'create_department'
  | 'update_department'
  | 'delete_department'
  | 'create_job'
  | 'update_job'
  | 'delete_job'
  | 'create_account'
  | 'update_account'
  | 'delete_account'
  | 'update_account_password'
  | 'update_account_role'
  | 'insert_account_role'
  | 'create_auth'
  | 'update_auth'
  | 'delete_auth'
  | 'create_engineering'
  | 'update_engineering'
  | 'delete_engineering'
  | 'create_contract'
  | 'update_contract'
  | 'delete_contract'
  | 'create_model'
  | 'update_model'
  | 'delete_model'
  | 'EC_pass'
  | 'EC_todo'
  | 'EC_reject'
  | 'EC_update'
  | 'EC_create';

interface ScorePatentActionData extends ActionDataI {
  idPatent: string;
  filename: string;
}

interface BaseActionI {
  type: NotificationType;
  idEntity: string;
  data: {
    [key: string]: any;
  };
}

export interface DBActionI extends BaseActionI {
  _id: string;
  atCreated: Date;
  idCreatedBy: string;
}

export interface CreateActionI<T> extends BaseActionI {
  data: T;
  idCreatedBy: string;
}
