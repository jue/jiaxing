import react, { useContext, useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Input, Button, Modal, Tooltip } from 'antd';
import { ContractManageContext } from '../context/ContractManageContext';

interface ExpertMember {
  name: string;
  group_job: string;
  job_title: string;
  job: string;
  remark: string;
}

const expertMemberType = {
  name: '',
  group_job: '',
  job_title: '',
  job: '',
  remark: '',
};

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    modalContent: {},
    item: {
      display: 'flex',
      borderBottom: '1px solid #d9d9d9',
      padding: '10px 0',
      '& div': {
        width: 100,
        textAlign: 'center',
        marginRight: 10,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
      '& div:nth-of-type(1)': {
        width: 38,
        marginRight: 0,
        borderLeft: 'none',
      },
      '& div:nth-of-type(3)': {
        width: 150,
      },
    },
    tr: {
      display: 'flex',
      borderBottom: '1px solid #d9d9d9',
      alignItems: 'center',
      '& div': {
        width: 100,
        textAlign: 'center',
        marginRight: 10,
        padding: '10px 0',
      },
      '& div:nth-of-type(3)': {
        width: 150,
      },
      '& input': {
        width: '100%',
      },

      '& div:nth-of-type(1)': {
        width: 38,
        marginRight: 0,
      },
      '& .ant-input:focus, .ant-input-focused': {
        borderColor: '#8fc220 !important',
        outline: 0,
        WebkitBoxShadow: 'none !important',
        boxShadow: 'none !important',
      },
      '& .ant-input:hover': {
        borderColor: '#8fc220 !important',
      },
      '& .ant-select:not(.ant-select-disabled):hover .ant-select-selector': {
        borderColor: '#8fc220 !important',
      },
      '& .ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector': {
        WebkitBoxShadow: 'none !important',
        boxShadow: 'none !important',
        borderColor: '#8fc220 !important',
      },
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 16,
      '& .ant-btn': {
        color: '#fff',
        width: 'auto',
        height: 32,
        fontSize: 14,
        background: '#8FC320',
        fontWeight: 400,
        borderColor: 'none',
        borderRadius: 4,
        border: 'none',
        marginLeft: 10,
      },
    },
  })
);

const ExpertMemberListModal = ({
  visiable,
  setVisiable,
  expertMemberArr,
  setExpertMemberArr,
  review,
}) => {
  const classes = useStyles({});

  const [expertMember, setExpertMember] = useState<ExpertMember>(
    expertMemberType
  );
  const [list, setList] = useState<ExpertMember[]>([]);
  const { contractMsg, auditContractDetail } = useContext(
    ContractManageContext
  );

  useEffect(() => {
    setExpertMember({ ...expertMemberType });
  }, [visiable]);

  useEffect(() => {
    if (contractMsg.specialTerms.length && !review) {
      const expert_member = contractMsg.specialTerms.filter(
        f => f.expert_member
      );
      if (expert_member.length) {
        const emList = expert_member[0].expert_member;
        setList([...list, ...emList]);
      }
    } else if (review) {
      const expert_member = auditContractDetail.specialTerms.filter(
        f => f.expert_member
      );
      if (expert_member.length) {
        const emList = expert_member[0].expert_member;
        setList([...emList]);
      }
    }
  }, [contractMsg, review, auditContractDetail]);

  return (
    <Modal
      title="专家组成员表"
      visible={visiable}
      footer={false}
      width={700}
      onCancel={() => setVisiable(false)}
    >
      <div className={classes.modalContent}>
        <div
          className={classes.item}
          style={{
            backgroundColor: '#d9d9d9',
          }}
        >
          <div>序号</div>
          <div>姓名</div>
          <div>专家组中担任职务</div>
          <div>职称</div>
          <div>职务</div>
          <div>备注</div>
        </div>
        {list &&
          list.map((item, index) => (
            <div className={classes.item}>
              <div>{index + 1}</div>
              <Tooltip title={item.name}>
                <div>{item.name}</div>
              </Tooltip>
              <Tooltip title={item.group_job}>
                <div>{item.group_job}</div>
              </Tooltip>
              <Tooltip title={item.job_title}>
                <div>{item.job_title}</div>
              </Tooltip>
              <Tooltip title={item.job}>
                <div>{item.job}</div>
              </Tooltip>
              <Tooltip title={item.remark}>
                <div>{item.remark}</div>
              </Tooltip>
            </div>
          ))}
        {!review && (
          <div className={classes.tr}>
            <div>{list.length + 1}</div>
            <div>
              <Input
                placeholder="请输入姓名"
                value={expertMember.name}
                onChange={e => {
                  const { value } = e.target;
                  setExpertMember({
                    ...expertMember,
                    name: value,
                  });
                }}
              />
            </div>
            <div>
              <Input
                placeholder="请输入专家组中担任职务"
                value={expertMember.group_job}
                onChange={e => {
                  const { value } = e.target;
                  setExpertMember({
                    ...expertMember,
                    group_job: value,
                  });
                }}
              />
            </div>
            <div>
              <Input
                placeholder="请输入职称"
                value={expertMember.job_title}
                onChange={e => {
                  const { value } = e.target;
                  setExpertMember({
                    ...expertMember,
                    job_title: value,
                  });
                }}
              />
            </div>
            <div>
              <Input
                placeholder="请输入职务"
                value={expertMember.job}
                onChange={e => {
                  const { value } = e.target;
                  setExpertMember({
                    ...expertMember,
                    job: value,
                  });
                }}
              />
            </div>
            <div>
              <Input
                placeholder="请输入备注"
                value={expertMember.remark}
                onChange={e => {
                  const { value } = e.target;
                  setExpertMember({
                    ...expertMember,
                    remark: value,
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
      <div className={classes.footer}>
        {!review && (
          <Button
            onClick={() => {
              if (expertMember.name !== '') {
                setList([...list, { ...expertMember }]);
                setExpertMember({ ...expertMemberType });
              }
            }}
          >
            添加一行
          </Button>
        )}
        <Button
          onClick={() => {
            if (!review) {
              setExpertMemberArr([...list]);
              // setContractSpecialTermsList(contractSpecialTermsList);
            }
            setVisiable(false);
          }}
        >
          {review ? '确定' : '保存'}
        </Button>
      </div>
    </Modal>
  );
};
export default ExpertMemberListModal;
