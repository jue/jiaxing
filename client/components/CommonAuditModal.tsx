import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { FlowContext } from '../contexts/FlowContext';
import { AuthContext, AuthContextI } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

function CommonAuditModal({ visible, setVisible, info }) {
  const router = useRouter();

  const {
    currentNode,
    nextNode,
    companyInfos,
    departInfos,
    jobInfos,
    queryAuditFlow,
    flows,
    taskInfos,
    auditMap,
    // iframeUrl,
    // setIframeUrl,
  } = useContext(FlowContext);
  const { account } = useContext<AuthContextI>(AuthContext);
  const [iframeUrl, setIframeUrl] = useState('http://localhost:3003');

  const is_change_construction = router.pathname.includes(
    '/quality/v2/construction'
  );

  useEffect(() => {
    if (JSON.stringify(info) !== '{}') {
      queryAuditFlow(info.idAuditing);
    }
  }, [info.idAuditing]);

  useEffect(() => {
    let url = window.location.href;
    let testJxUrl = 'https://dev-jxtram.tylinsh.com';
    let prodJxUrl = 'https://jxtram.tylinsh.com';

    let testGAUrl = 'https://dev-approval.tylinsh.com';
    let prodGAUrl = 'https://approval.tylinsh.com';

    if (url.includes(testJxUrl)) {
      setIframeUrl(testGAUrl);
    } else if (url.includes(prodJxUrl)) {
      setIframeUrl(prodGAUrl);
    } else if (is_change_construction) {
      if (url.includes(testJxUrl)) {
        setIframeUrl(testGAUrl);
      } else if (url.includes(prodJxUrl)) {
        setIframeUrl(prodGAUrl);
      } else if (url.includes('http://localhost:3000')) {
        setIframeUrl('http://localhost:3003');
      }
    }
  }, [info]);

  const smallMedia = visible && document.body.clientWidth < 1300;

  return (
    <Modal
      visible={visible}
      width={smallMedia ? 700 : 918}
      footer={null}
      bodyStyle={{ height: smallMedia ? 500 : 650 }}
      style={{ left: 100, overflow: 'hidden', top: smallMedia ? 150 : 100 }}
      onCancel={() => {
        setVisible(false);
        is_change_construction && setIframeUrl('');
      }}
    >
      <iframe
        src={iframeUrl}
        style={{
          border: 0,
          width: '100%',
          height: '100%',
        }}
        id="commonAudit"
        // random='+randomnumber+'"
        onLoad={() => {
          let iframe = document.getElementById(
            'commonAudit'
          ) as HTMLIFrameElement;
          let iWindow = iframe.contentWindow;

          //通过postMessage向通用审批项目传值
          iWindow.postMessage(
            {
              currentNodeInfo: currentNode,
              nextNodeInfo: nextNode,
              companyInfos: companyInfos,
              departInfos: departInfos,
              jobInfos: jobInfos,
              approvalInfo: info,
              nodeFlows: flows,
              auditMap: auditMap,
              taskInfos: taskInfos,
              accountInfo: account,
            },
            '*'
          );
        }}
      ></iframe>
    </Modal>
  );
}

export default CommonAuditModal;
