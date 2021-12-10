import { engineeringStyles } from '../styles';

const TableBody = ({
  tr,
  setTr,
  engineeringInfo,
  setEngineeringInfo,
  activeNo = '',
  setActiveNo,
  index,
}) => {
  const classes = engineeringStyles({});
  const { _id } = tr;
  let showInput = _id === 'root' || activeNo === tr.costProNumber;
  let addDisabled =
    tr.costProContent &&
    tr.costCompany &&
    tr.costBeforeCount &&
    tr.costBeforeUnit &&
    tr.costAfterCount &&
    tr.costAfterUnit;

  return (
    <div className={classes.payHeader}>
      <div className={classes.payShortTd}>{tr.costProNumber || '--'}</div>
      <div className={classes.payMiddleTd}>
        {showInput ? (
          <input
            className={classes.payInput}
            value={tr.costProContent || ''}
            onChange={(e) =>
              setTr({
                ...tr,
                costProContent: e.target.value.trim(),
              })
            }
          />
        ) : (
          tr.costProContent || '--'
        )}
      </div>
      <div className={classes.payShortTd}>
        {showInput ? (
          <input
            className={classes.payInput}
            value={tr.costCompany || ''}
            onChange={(e) =>
              setTr({
                ...tr,
                costCompany: e.target.value.trim(),
              })
            }
          />
        ) : (
          tr.costCompany || '--'
        )}
      </div>
      <div className={classes.payLongTd} style={{ display: 'flex' }}>
        <div className={classes.paySingle}>
          {showInput ? (
            <input
              type="number"
              className={classes.payInput}
              value={tr.costBeforeCount || ''}
              onChange={(e) =>
                setTr({
                  ...tr,
                  costBeforeCount: e.target.value.trim(),
                })
              }
            />
          ) : (
            tr.costBeforeCount || '--'
          )}
        </div>
        <div className={classes.paySingle}>
          {showInput ? (
            <input
              type="number"
              className={classes.payInput}
              value={tr.costBeforeUnit || ''}
              onChange={(e) =>
                setTr({
                  ...tr,
                  costBeforeUnit: e.target.value.trim(),
                })
              }
            />
          ) : (
            tr.costBeforeUnit || '--'
          )}
        </div>
        <div className={classes.paySingle}>
          {tr.costBeforeCount && tr.costBeforeUnit
            ? (Number(tr.costBeforeCount) * Number(tr.costBeforeUnit)).toFixed(
                2
              )
            : '--'}
        </div>
      </div>
      <div className={classes.payLongTd} style={{ display: 'flex' }}>
        <div className={classes.paySingle}>
          {showInput ? (
            <input
              type="number"
              className={classes.payInput}
              value={tr.costAfterCount || ''}
              onChange={(e) =>
                setTr({
                  ...tr,
                  costAfterCount: e.target.value.trim(),
                })
              }
            />
          ) : (
            tr.costAfterCount || '--'
          )}
        </div>
        <div className={classes.paySingle}>
          {showInput ? (
            <input
              type="number"
              className={classes.payInput}
              value={tr.costAfterUnit || ''}
              onChange={(e) =>
                setTr({
                  ...tr,
                  costAfterUnit: e.target.value.trim(),
                })
              }
            />
          ) : (
            tr.costAfterUnit || '--'
          )}
        </div>
        <div className={classes.paySingle}>
          {tr.costAfterCount && tr.costAfterUnit
            ? (Number(tr.costAfterCount) * Number(tr.costAfterUnit)).toFixed(2)
            : '--'}
        </div>
      </div>
      <div
        className={classes.payShortTd}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {_id === 'root' && (
          <button
            className={classes.payButton}
            disabled={!addDisabled}
            onClick={() => {
              const newCostStatement = JSON.parse(
                JSON.stringify(engineeringInfo.costStatement || [])
              );

              let newChangePayValue: any = {
                costProNumber: newCostStatement.length
                  ? newCostStatement.length + 1
                  : 1,
                costProContent: tr.costProContent,
                costCompany: tr.costCompany,
                costBeforeCount: tr.costBeforeCount,
                costBeforeUnit: tr.costBeforeUnit,
                costBeforePrice: (
                  Number(tr.costBeforeCount) * Number(tr.costBeforeUnit)
                ).toFixed(2),
                costAfterCount: tr.costAfterCount,
                costAfterUnit: tr.costAfterUnit,
                costAfterPrice: (
                  Number(tr.costAfterCount) * Number(tr.costAfterUnit)
                ).toFixed(2),
              };

              newCostStatement.push(newChangePayValue);
              setEngineeringInfo({
                ...engineeringInfo,
                costStatement: newCostStatement,
              });

              setTr({
                _id: 'root',
              });
            }}
          >
            增加
          </button>
        )}
        {_id !== 'root' && (
          <button
            className={classes.payButton}
            onClick={() => {
              setActiveNo(
                activeNo !== tr.costProNumber ? tr.costProNumber : ''
              );
            }}
          >
            {activeNo !== tr.costProNumber ? '编辑' : '保存'}
          </button>
        )}
        {_id !== 'root' && (
          <button
            className={classes.payButton}
            onClick={() => {
              const newCostStatement = JSON.parse(
                JSON.stringify(engineeringInfo.costStatement)
              );
              newCostStatement.splice(index, 1);
              setEngineeringInfo({
                ...engineeringInfo,
                costStatement: newCostStatement,
              });
            }}
          >
            删除
          </button>
        )}
      </div>
    </div>
  );
};

const CostCalculationList = ({
  defaultPayTr,
  setDefaultPayTr,
  activeNo,
  setActiveNo,
  engineeringInfo,
  setEngineeringInfo,
  index,
}) => {
  const classes = engineeringStyles({});
  return (
    <div className={classes.row}>
      <div style={{ fontSize: 12 }}>费用计算清单</div>
      <div className={classes.payTable}>
        <div className={classes.payHeader}>
          <div className={classes.payShortTd}>项目号</div>
          <div className={classes.payMiddleTd}>项目内容</div>
          <div className={classes.payShortTd}>单位</div>
          <div className={classes.payLongTd}>变更前费用</div>
          <div className={classes.payLongTd}>变更后费用</div>
          <div className={classes.payShortTd}>操作</div>
        </div>

        <div className={classes.payHeader}>
          <div className={classes.payShortTd}>--</div>
          <div className={classes.payMiddleTd}>--</div>
          <div className={classes.payShortTd}>--</div>
          <div className={classes.payLongTd} style={{ display: 'flex' }}>
            <div className={classes.paySingle}>数量</div>
            <div className={classes.paySingle}>单价</div>
            <div className={classes.paySingle}>金额</div>
          </div>
          <div className={classes.payLongTd} style={{ display: 'flex' }}>
            <div className={classes.paySingle}>数量</div>
            <div className={classes.paySingle}>单价</div>
            <div className={classes.paySingle}>金额</div>
          </div>
          <div className={classes.payShortTd}>--</div>
        </div>

        <TableBody
          tr={defaultPayTr}
          setTr={setDefaultPayTr}
          engineeringInfo={engineeringInfo}
          setEngineeringInfo={setEngineeringInfo}
          setActiveNo={setActiveNo}
          index={index}
        />

        {(engineeringInfo.costStatement || []).map((item, index) => {
          return (
            <TableBody
              key={index}
              tr={item}
              setTr={(tr) => {
                const newCostStatement = JSON.parse(
                  JSON.stringify(engineeringInfo.costStatement)
                );
                newCostStatement[index] = tr;
                newCostStatement[index].costBeforePrice = (
                  Number(tr.costBeforeCount) * Number(tr.costBeforeUnit)
                ).toFixed(2);

                newCostStatement[index].costAfterPrice = (
                  Number(tr.costAfterCount) * Number(tr.costAfterUnit)
                ).toFixed(2);
                setEngineeringInfo({
                  ...engineeringInfo,
                  costStatement: newCostStatement,
                });
              }}
              engineeringInfo={engineeringInfo}
              setEngineeringInfo={setEngineeringInfo}
              activeNo={activeNo}
              setActiveNo={setActiveNo}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CostCalculationList;
