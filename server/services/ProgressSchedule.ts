import schedule from 'node-schedule';
import { ProgressModel } from './mongoose-models/progress';
import auditingService from './AuditingService';
import { AccountModel } from './mongoose-models/account';
import { DictionariesModel } from './mongoose-models/dictionaries';

export default async function scheduleCronstyle() {
  //每5分钟定时执行一次:

  // */5 * * * * * test
  // 0 0 1 * * * 
  schedule.scheduleJob('0 0 1 * * *', async function () {
    try {
      console.log('延期预警执行开始:' + new Date());
      findProgressAsNotStart();
      findProgressAsDoing();
      console.log('延期预警执行结束:' + new Date());
    } catch (error) {
      console.log('errer', error);
    }
  });

  async function findProgressAsNotStart() {
    return new Promise(async (resolve, reject) => {
      await ProgressModel.find({
        delay: 'notstart',
      })
        .then((progressList) => {
          if (progressList.length > 0) {
            let currDate = new Date();
            let ids1 = []; // 延期
            let data1 = []; // 延期数据
            let ids2 = []; // 严重延期
            let data2 = []; // 严重延期数据

            progressList.forEach((progress) => {
              let start_date = progress.start_date;
              let diffDate = getDateDiff(currDate, start_date);
              if (diffDate >= 3 && diffDate <= 15) {
                ids1.push(progress._id);
                data1.push(progress);
              } else if (diffDate > 15) {
                ids2.push(progress._id);
                data2.push(progress);
              }
            });

            if (ids1.length > 0) {
              updateTaskTags(ids1, '0').then((boolean) => {
                if (boolean) {
                  sendMessages(data1, 1);
                }
              });
            }
            if (ids2.length > 0) {
              updateTaskTags(ids2, '1').then((boolean) => {
                if (boolean) {
                  sendMessages(data2, 2);
                }
              });
            }
          }
          resolve(true);
        })
        .catch((error) => {
          console.log('查询数据失败', error.message);
          resolve(true);
        });
    });
  }

  async function findProgressAsDoing() {
    return new Promise(async (resolve, reject) => {
      await ProgressModel.find({
        delay: 'doing',
      })
        .then((progressList) => {
          if (progressList.length > 0) {
            let currDate = new Date();
            let ids1 = []; // 延期
            let data1 = []; // 延期数据
            let ids2 = []; // 严重延期
            let data2 = []; // 严重延期数据
            progressList.forEach((progress) => {
              let end_date = progress.end_date;
              let diffDate = getDateDiff(currDate, end_date);
              if (diffDate >= 3 && diffDate <= 15) {
                ids1.push(progress._id);
                data1.push(progress);
              } else if (diffDate > 15) {
                ids2.push(progress._id);
                data2.push(progress);
              }
            });

            if (ids1.length > 0) {
              updateTaskTags(ids1, '0').then((boolean) => {
                if (boolean) {
                  sendMessages(data1, 1);
                }
              });
            }
            if (ids2.length > 0) {
              updateTaskTags(ids2, '1').then((boolean) => {
                if (boolean) {
                  sendMessages(data2, 2);
                }
              });
            }
          } else {
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function getDateDiff(startTime: Date, endTime: Date) {
    let divNum = 1000 * 3600 * 24;
    let diff = startTime.getTime() - endTime.getTime();
    return parseInt((diff / divNum).toFixed());
  }

  async function updateTaskTags(ids: Array<String>, taskTags: string) {
    return new Promise(async (resolve, reject) => {
      await ProgressModel.updateMany(
        {
          _id: {
            $in: ids,
          },
        },
        {
          $set: {
            taskTags: taskTags,
          },
        }
      )
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.log('标签修改失败', error.message);
          reject(false);
        });
    });
  }

  async function sendMessages(progressList: any, type: number) {
    let dict = await DictionariesModel.findOne({ dataType: 'SYSTEM' });
    if (!dict) {
      console.log('字典不存在', 'dataType: SYSTEM');
      return;
    }

    let name = '';

    //抄送人
    let cc = [];
    if (type === 1) {
      name = '延期预警';
    } else {
      name = '严重延期预警';
      cc = await getCcAccounts();
    }

    for (let i = 0; i < progressList.length; i++) {
      let progress = progressList[i];

      //接收人
      let receivers = await getReceivers(progress);
      if (receivers.length <= 0) {
        console.log('通知人不存在');
        return;
      }

      let content = getContent(progress);

      let data = {
        title: progress.text + name,
        content: content,
        receivers: receivers,
        cc: cc,
        operatorId: dict.dataValue,
        operatorName: '系统',
      };

      await auditingService
        .sendMessages(data)
        .then((messageData) => {
          if (messageData.code !== 0) {
            console.log(
              '发送消息失败',
              'name:' + progress.text,
              messageData.msg
            );
            return;
          }
          console.log('发送消息成功');
        })
        .catch((error) => {
          console.log('发送消息失败', 'name:' + progress.text, error.message);
        });
    }
  }

  async function getReceivers(progress: any) {
    let receiverIds: Array<String> = progress.resource;
    if (progress.custom_data) {
      if (progress.custom_data.jlPrincipal) {
        receiverIds.push(progress.custom_data.jlPrincipal);
      }
    }
    let receivers = [];
    if (receiverIds.length <= 0) {
      return receivers;
    }

    let accounts = await AccountModel.find({ _id: { $in: receiverIds } });

    accounts.forEach((account) => {
      receivers.push({
        receiver: account._id,
        receiverName: account.userName,
      });
    });

    return receivers;
  }

  async function getCcAccounts() {
    let cc = [];
    let ids = [];
    let dictData = await DictionariesModel.find({ dataType: 'CC_MESSAGE' });
    dictData.forEach((element) => {
      ids.push(element.dataValue);
    });

    if (dictData.length <= 0) {
      return cc;
    }

    let accounts = await AccountModel.find({
      idDepartment: { $in: ids },
    });

    accounts.forEach((element) => {
      cc.push({
        receiver: element._id,
        receiverName: element.userName,
      });
    });

    return cc;
  }

  function getContent(progress: any) {
    let content = '';

    let actual_start_date =
      progress.delay === 'notstart' ? '未开始' : progress.actual_start_date;

    let dataCount =
      progress.delay === 'notstart'
        ? getDateDiff(new Date(), progress.start_date)
        : getDateDiff(new Date(), progress.end_date);

    content += '计划开始时间:' + progress.start_date + '/n';
    content += '计划工期:' + progress.duration + '/n';
    content += '实际开始时间:' + actual_start_date + '/n';
    content += '延期天数:' + dataCount;
    return content;
  }
}
