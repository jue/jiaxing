import schedule from 'node-schedule';
import { QualityInspectThemeModel } from '../services/mongoose-models/quality_inspect_theme';
import moment from 'moment'


/**
 *  2.定时更新：扫描当前“未完成”任务，
 *  若“（当前时间-计划截止时间）>0”则按实际数字存储更新“延期天数”，单位：天，四舍五入取整；
 * 
 * 
 */
export default async function qualityInspectSchedule() {

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
    // 定时 每天凌晨2点 0 0 2 * * *
    // test */5 * * * * *
    schedule.scheduleJob('0 0 2 * * *', async () => {
        // console.log('testeee')
        try {
            await handle()
        } catch (error) {
            console.log('error', error)
        }
    })



    async function handle() {
        // "_id" : "7808"
        const data = await QualityInspectThemeModel.find({ status: '1' }) //  delayDays: { $exists: false }
        console.log('data',data)
        // const data = await ProgressModel.find({ "_id" : "7808" })
        // console.log('data', data.length)
        const currDate = new Date() // 当前时间 任务完成时间
        for (let i = 0; i < data.length; i++) {
            // console.log('end_date',data[i].end_date)
                const diffDays = moment(currDate).diff(moment(data[i].endTime), 'days');
                //console.log('diffDays',diffDays)
                await QualityInspectThemeModel.updateOne(
                    { _id: data[i]._id },
                    {
                        $set: {
                            delayDays: diffDays > 0 ? diffDays : 0
                        }
                    },
                )
            }
    }


}
