import { useContext, useState, useEffect } from 'react';
import { EngineeringContext } from '../context/EngineeringContext';
import { engineeringStyles } from '../styles';
import PreViewFile from '../../../components/FilePreview/temPreView';
import { FlowContext } from '../../../contexts/FlowContext';
import {
  EngineeringLevelTabType,
  EngineeringLevelTypeDesc,
} from '../../../../constants/enums';

const StepTemplate = () => {
  const { engineeringInfo, setEngineeringInfo } = useContext(
    EngineeringContext
  );
  const { flows, queryFileFillData } = useContext(FlowContext);
  const [preViewFile, setPreViewFile] = useState<any>();

  const classes = engineeringStyles({});

  useEffect(() => {
    let customize = {};
    flows.map((item) => {
      if (item.bizData) {
        customize = { ...customize, ...item.bizData };
      }
    });

    setEngineeringInfo({
      ...engineeringInfo,
      ...customize,
    });
  }, [flows]);

  return (
    <div className={classes.root}>
      <div className={classes.row} style={{ fontSize: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {engineeringInfo &&
            engineeringInfo.modelFile &&
            engineeringInfo.modelFile.map((item) => {
              console.log(engineeringInfo.changeLevel);

              if (engineeringInfo.changeLevel === 'common') {
                engineeringInfo.changeLevel = '一般变更';
              } else if (engineeringInfo.changeLevel === 'great') {
                engineeringInfo.changeLevel = '重大变更';
              }
              return (
                <div
                  key={item.bizFormId}
                  className={classes.formModel}
                  onClick={async () => {
                    queryFileFillData(
                      engineeringInfo,
                      item.bizFormId,
                      item.bizFormName,
                      setPreViewFile
                    );
                  }}
                >
                  {item.bizFormName}
                </div>
              );
            })}
        </div>
      </div>
      <PreViewFile preViewFile={preViewFile} setPreViewFile={setPreViewFile} />
    </div>
  );
};
export default StepTemplate;
