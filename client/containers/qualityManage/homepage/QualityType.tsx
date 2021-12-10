import { Select } from 'antd';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return createStyles({
    title: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      hieght: 40,
      '& :nth-child(1)': {
        paddingLeft: 5,
      },
    },
    content: {
      height: 240,
      overflow: 'auto',
    },
    progress: {},
    progressTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#809AB1',
      fontSize: 12,
      marginTop: 10,
    },
    progressLine: {
      width: '100%',
      height: 8,
      background: '#F6F6F7',
      borderRadius: 4,
      marginTop: 2,
    },
    innerLine0: {
      height: 8,
      background: '#3E76C2',
      borderRadius: 4,
    },
    innerLine1: {
      height: 8,
      background: '#A9CDFF',
      borderRadius: 4,
    },
    innerLine2: {
      height: 8,
      background: '#3E76C2',
      borderRadius: 4,
    },
    innerLine3: {
      height: 8,
      background: '#4E93F0',
      borderRadius: 4,
    },
  });
});

const QualityType = () => {
  const classes = useStyles({});

  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      name: '钢筋材料',
      all: 245,
      finish: 100,
    });
  }

  return (
    <>
      <div className={classes.title}>
        <div>质量问题类别</div>
        <Select
          style={{ width: 135 }}
          defaultValue="材料"
          bordered={false}
          onChange={() => {}}
        />
      </div>

      <div className={classes.content}>
        {data.map((item, index) => {
          const key = index % 4;

          return (
            <div className={classes.progress} key={index}>
              <div className={classes.progressTitle}>
                <span>{item.name}</span>
                <span>{item.all}</span>
              </div>

              <div className={classes.progressLine}>
                <div
                  className={classes[`innerLine${key}`]}
                  style={{
                    width: `${parseInt(
                      ((item.finish / item.all) * 100).toString()
                    )}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default QualityType;
