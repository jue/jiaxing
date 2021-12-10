import schedule from 'node-schedule';
import { ProgressModel } from '../services/mongoose-models/progress';
import moment from 'moment'
import wxService from '../services/WxService';

/**
 *  2.定时更新：扫描当前“未完成”任务，
 *  若“（当前时间-计划截止时间）>0”则按实际数字存储更新“延期天数”，单位：天，四舍五入取整；
 * 
 * 
 */
export default async function progressSchedule() {

    /*
      *    *    *    *    *    *
      ┬    ┬    ┬    ┬    ┬    ┬
      │    │    │    │    │    │
      │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
      │    │    │    │    └───── month (1 - 12)
      │    │    │    └────────── day of month (1 - 31)
      │    │    └─────────────── hour (0 - 23)
      │    └──────────────────── minute (0 - 59)
      └───────────────────────── second (0 - 59, OPTIONAL)
    */
    // 定时 每天凌晨1点
    schedule.scheduleJob('0 0 1 * * *', async () => {
        // console.log('testeee')
        try {
            await handleDelayDays()
        } catch (error) {
            console.log('error', error)
        }
    })

    // 定时 每天凌晨9点
    // schedule.scheduleJob('0 0 9 * * *', async () => {
    //     // console.log('testeee')
    //     try {
    //         await handleSendWechatMessage()
    //     } catch (error) {
    //         console.log('error', error)
    //     }
    // })



    async function handleDelayDays() {
        // "_id" : "7808"
        const data = await ProgressModel.find({ delay: 'doing' }) //  delayDays: { $exists: false } 
        // console.log('data',data)
        // const data = await ProgressModel.find({ "_id" : "7808" })
        // console.log('data', data.length)
        const currDate = new Date() // 当前时间 任务完成时间
        for (let i = 0; i < data.length; i++) {
            // console.log('end_date',data[i].end_date)
            const diffDays = moment(currDate).diff(moment(data[i].end_date), 'days');
            //console.log('diffDays',diffDays)
            await ProgressModel.updateOne(
                { _id: data[i]._id },
                {
                    $set: {
                        delayDays: diffDays > 0 ? diffDays : 0
                    }
                },
            )
        }

    }


    
    // const templateid = 'odZQZdnH-NAHz7RnwsKSw__RmK-EvNHYk-Hy8GxXmqI'; 
    const templateid = 'ANqc8ZBza9_GlFFeRg8k0SOxd41Co2VsuVkPzEv0AQQ'
    const url = '';
    const color = '#FF0000';
    const params = {
        first: {
            value: '',
            color: '#173177',
        },
        keyword1: {
            value: '',
            color: '#173177',
        },
        keyword2: {
            value: '',
            color: '#173177',
        },
        keyword3: {
            value: '',
            color: '#173177',
        },
        keyword4: {
            value: '',
            color: '#173177',
        },
        remark: {
            value: '具体信息请至系统平台查看！',
            color: '#173177',
        },
    };
    async function handleSendWechatMessage() {
        //taskTags =
        // | '0' // 延期（30天内）
        // | '1'; // 严重延期（大于30天）
        // delay: Status; 'notstart' | 'doing' | 'done';
        // 模版ID：待补充；
        // first.DATA：即消息标题，%任务名称%”-%延期/严重延期%预警；
        // 计划开始时间（keyword1.DATA）：即任务计划开始时间；
        // 计划工期（keyword2.DATA）：即任务计划工期；
        // 实际开始时间（keyword3.DATA）：即任务完成度更新时间，若未开始，则显示“未开始”；
        // 延期天数（keyword4.DATA）：若已开始，则“当前时间”减去“计划结束时间”，若未开始，则“当前时间”减去“计划开始时间”；
        // remark.DATA：具体信息请至系统平台查看！
        const data = await ProgressModel.find({
            taskTags: {
                $in: ['0', '1']
            }
        })
        
        const currDate = new Date() 
       
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const accountid = element.idCreatedBy;
          
            params.first.value = element.taskTags === '0' ? `${element.text}-延期预警` :`${element.text}-严重延期预警`
            params.keyword1.value = moment(element.start_date).format('YYYY MM DD HH:mm:ss') ;
            params.keyword2.value = element.duration + '';
            params.keyword3.value =element.actual_start_date? moment(element.actual_start_date).format('YYYY MM DD HH:mm:ss'):'未开始' ;
           
            
            if(element.delay === 'doing'){
                params.keyword4.value = moment(currDate).diff(moment(element.end_date), 'days') + '';
            }
            if(element.delay === 'notstart'){
                params.keyword4.value = moment(currDate).diff(moment(element.start_date), 'days') + '';
            }
            await wxService.sendTemplateMessageByAccountid(
                templateid,
                accountid,
                url,
                color,
                params
            );
        }
    }

}
