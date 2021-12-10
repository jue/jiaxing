import React, { useState, useContext, useEffect } from 'react';
import { contract_special_terms } from '../../../constants/contract_special_terms';
// import TitleCommon from '../../../components/Title/TitleCommon';
import { Input, Button, Radio } from 'antd';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ExpertMemberListModal from './compontents/ExpertMemberListModal';
import { ContractManageContext } from './context/ContractManageContext';
import NumberToChinese from '../../components/NumberToChinese';
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
        background: '#8FC320',
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
      marginTop: 16,
      padding: '20px 20px 0 20px',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    num: {
      fontSize: 20,
      display: 'inline-block',
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

function ContractSpecialTerms() {
  const classes = useStyles({});
  const [visiable, setVisiable] = useState(false);
  const [contractSpecialTermsList, setContractSpecialTermsList] = useState([
    ...contract_special_terms,
  ]);
  const [expertMemberArr, setExpertMemberArr] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const { contractMsg, setContractMsg, setSpecialTerms } = useContext(
    ContractManageContext
  );

  let arr = contractMsg.specialTerms.length
    ? [...contractMsg.specialTerms]
    : [...contractSpecialTermsList];
  console.log('arr', arr);
  const radioStyle = {
    display: 'block',
  };

  return (
    <div className={classes.contanier}>
      {/* <TitleCommon title="合同创建" content="" /> */}
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
            {item.content && (
              <div className={classes.num}>
                {NumberToChinese(index + 1)}、{item.title}
              </div>
            )}
            {item.title === '' && (
              <div
                style={{
                  display: 'inline-flex',
                }}
              >
                <Input
                  placeholder="请输入"
                  className={classes.input}
                  onChange={e => {
                    const { value } = e.target;

                    arr[index] = { ...arr[index], new_title: value };

                    setContractSpecialTermsList([...arr]);
                  }}
                />
              </div>
            )}
            {index === 1 && (
              <div className={classes.manager}>
                <div>
                  <span>承包人任命的项目经理姓名：</span>
                  <Input
                    placeholder="请输入姓名"
                    className={classes.input}
                    defaultValue={item.manager_name}
                    onChange={e => {
                      const { value } = e.target;
                      arr[index] = {
                        ...arr[index],
                        manager_name: value,
                        qualification_number: number,
                      };
                      setName(value);

                      setContractSpecialTermsList([...arr]);
                    }}
                  />
                </div>
                <div>
                  <span>资格证编号：</span>
                  <Input
                    placeholder="请输入编号"
                    className={classes.input}
                    defaultValue={item.qualification_number}
                    onChange={e => {
                      const { value } = e.target;
                      arr[index] = {
                        ...arr[index],
                        qualification_number: value,
                        manager_name: name,
                      };
                      setNumber(value);
                      setContractSpecialTermsList([...arr]);
                    }}
                  />
                </div>
              </div>
            )}
            {item.content && (
              <TextArea
                defaultValue={item.content}
                style={{
                  color: index === 1 && '#D9001B',
                }}
                placeholder="请输入"
                rows={4}
                onChange={e => {
                  const { value } = e.target;

                  arr[index] = { ...arr[index], content: value };

                  setContractSpecialTermsList([...arr]);
                }}
              />
            )}
            {item.resolution_conditions && (
              <Radio.Group
                onChange={e => {
                  const { value } = e.target;

                  arr[index] = { ...arr[index], radio: value };

                  setContractSpecialTermsList([...arr]);
                }}
                style={{ marginBottom: 20 }}
              >
                {item.resolution_conditions.map((r, rIndex) => (
                  <Radio value={rIndex} style={radioStyle}>
                    {r}
                  </Radio>
                ))}
              </Radio.Group>
            )}
            {item.description && (
              <>
                <Button onClick={() => setVisiable(true)}>
                  点击编辑专家组成员表
                </Button>
                <TextArea
                  defaultValue={item.description}
                  rows={7}
                  style={{
                    color: '#D9001B',
                  }}
                  onChange={e => {
                    const { value } = e.target;
                    arr[index] = { ...arr[index], description: value };
                    setContractSpecialTermsList([...arr]);
                  }}
                />
              </>
            )}
          </div>
        ))}

        <Button
          onClick={() => {
            setContractSpecialTermsList([
              ...contractSpecialTermsList,
              { title: '', content: '' },
            ]);
          }}
        >
          添加其他条款
        </Button>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            style={{
              marginTop: 20,
            }}
            onClick={() => {
              setContractMsg({
                ...contractMsg,
                specialTerms: [
                  ...contractSpecialTermsList,
                  { expert_member: expertMemberArr },
                ],
              });
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
        review={false}
        // contractSpecialTermsList={contractSpecialTermsList}
        // setContractSpecialTermsList={setContractSpecialTermsList}
      />
    </div>
  );
}

export default ContractSpecialTerms;
