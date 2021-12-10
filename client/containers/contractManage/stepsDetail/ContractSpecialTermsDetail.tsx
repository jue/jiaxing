import React, { useState, useContext, useEffect } from 'react';
import { contract_special_terms } from '../../../../constants/contract_special_terms';
import { Input, Button } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpertMemberListModal from '../compontents/ExpertMemberListModal';
import { ContractManageContext } from '../context/ContractManageContext';
import NumberToChinese from '../../../components/NumberToChinese';
import { CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    contanier: {},
    contractContanier: {
      padding: '24px 21px 24px',
      height: 'calc(100% - 70px)',
      overflow: 'auto',
      backgroundColor: '#fff',
      '& textarea': {
        margin: '10px 0 25px 0',
      },
      '& .ant-btn': {
        color: '#fff',
        width: 'auto',
        height: 32,
        fontSize: 14,
        background:
          'linear-gradient(270deg,rgba(30,207,247,1) 0%,rgba(46,155,255,1) 100%)',
        fontWeight: 400,
        borderColor: 'none',
        borderRadius: 4,
        border: 'none',
      },
    },
    title: {
      fontSize: 20,
      fontWeight: 500,
      backgroundColor: '#fff',
      padding: '16px 20px 0 20px',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    num: {
      fontSize: 20,
    },
    divider: {
      backgroundColor: '#fafafa',
      height: 16,
    },
    manager: {
      display: 'flex',
      '& div': {
        marginRight: 10,
      },
    },
    input: {
      width: 200,
    },
  });
});

function ContractSpecialTermsDetail() {
  const classes = useStyles({});
  const [visiable, setVisiable] = useState(false);
  const [contractSpecialTermsList, setContractSpecialTermsList] = useState([
    ...contract_special_terms,
  ]);
  const [expertMemberArr, setExpertMemberArr] = useState([]);

  const { auditContractDetail, setContractMsg, setSpecialTerms } = useContext(
    ContractManageContext
  );

  let arr = auditContractDetail.specialTerms.length
    ? [...auditContractDetail.specialTerms]
    : [...contractSpecialTermsList];

  return (
    <div className={classes.contanier}>
      <div className={classes.title}>
        <div>专用条款</div>
        <div>
          <CloseOutlined
            style={{ opacity: 0.4 }}
            onClick={() => setSpecialTerms(false)}
          />
        </div>
      </div>
      <div className={classes.contractContanier}>
        {arr.map((item, index) => (
          <div>
            {(item.title || item.new_title || item.content) && (
              <>
                <div className={classes.num}>
                  {NumberToChinese(index + 1)}、{item.title || item.new_title}
                </div>

                {index === 1 && (
                  <div className={classes.manager}>
                    <div>
                      <span>承包人任命的项目经理姓名：</span>
                      <span>{item.manager_name}</span>
                    </div>
                    <div>
                      <span>资格证编号：</span>
                      <span>{item.qualification_number}</span>
                    </div>
                  </div>
                )}
                {item.content && (
                  <TextArea
                    value={item.content}
                    style={{
                      color: index === 1 && '#D9001B',
                    }}
                    placeholder="请输入"
                    rows={4}
                    disabled
                  />
                )}
                {item.description && (
                  <>
                    <Button onClick={() => setVisiable(true)}>
                      查看专家组成员表
                    </Button>
                    <div>{item.description}</div>
                    <TextArea
                      defaultValue={item.description}
                      rows={7}
                      style={{
                        color: '#D9001B',
                      }}
                      disabled
                      onChange={e => {
                        const { value } = e.target;
                        arr[index] = { ...arr[index], description: value };
                        setContractSpecialTermsList([...arr]);
                      }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        ))}

        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            style={{
              marginTop: 20,
            }}
            onClick={() => {
              setSpecialTerms(false);
            }}
          >
            确定
          </Button>
        </div>
      </div>

      <ExpertMemberListModal
        visiable={visiable}
        setVisiable={setVisiable}
        expertMemberArr={expertMemberArr}
        setExpertMemberArr={setExpertMemberArr}
        review={true}
      />
    </div>
  );
}

export default ContractSpecialTermsDetail;
