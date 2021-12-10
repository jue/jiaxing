import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC<{}> = () => (
  <Result
    status={404}
    title="404"
    subTitle="出错啦！"
    extra={
      <Button type="primary" onClick={() => history.go(-1)}>
        返回
      </Button>
    }
  />
);

export default NoFoundPage;
