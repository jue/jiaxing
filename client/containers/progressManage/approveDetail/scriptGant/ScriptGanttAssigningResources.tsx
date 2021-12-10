import ScriptGanttZoomToFit from './ScriptGanttZoomToFit';
import react from 'react';
import progressSvc from '../../../../services/ProgressSvc';
import { time } from 'highcharts';
import moment from 'antd/node_modules/moment';
import clsx from 'clsx';
import companySvc from '../../../../services/companySvc';
import accountSvc from '../../../../services/accountSvc';
import $ from 'jquery';
class ScriptGanttAssigningResources extends ScriptGanttZoomToFit {
  constructor() {
    super();
  }
  init(
    container,
    opts: {
      data?;
      delayClick?;
    }
  ) {
    const { data, delayClick } = opts;
    this.initZoom();
    // this.gantt.config.auto_scheduling = true;
    this.gantt.init(container);

    // this.setZoom('week');
    const gantt = this.gantt;
    const getParams = (item, type) => {
      // console.log(item);
      return {
        actionType: type,
        data: {
          text: item.text,
          start_date: item.start_date,
          end_date: item.end_date,
          actual_start_date: item.start_date,
          duration: item.duration,
          progress: item.progress,
          open: 'true',
          parent: item.parent + '',
          custom_data: item.custom_data
            ? item.custom_data
            : {
                priority: item.priority,
                BIMcoding: item.BIMcoding,
                jlPrincipal: item.jlPrincipal,
              },
          resource: item.resource ? item.resource : [item.sgPrincipal],
          delay: '',
          importantNode:
            item.importantNode && item.importantNode == '1' ? '1' : '0',
          taskTags: '',
        },
        id: item.id,
        ids: [''],
        projectId: '',
      };
    };
    const handleUpload = async (id, item) => {
      try {
        let new_task: any = getParams(item, 'update');
        // console.log(new_task);
        await progressSvc.update({ ...new_task, _id: new_task.id });
      } catch (error) {
        console.log(error);
      }
    };
    const handleCreate = async (id, item) => {
      console.log('新增');
      let obj: any = getParams(item, 'create');
      await progressSvc.create(obj);
    };

    const handleDelete = async (id) => {
      await progressSvc.delete({
        actionType: 'delete',
        id: id,
      });
    };
    //获取单位;
    gantt.attachEvent('onBeforeParse', function () {
      companySvc.query({}).then((data) => {
        // const companyData = data.map((item) => {
        //   item.key = item._id;
        //   item.label = item.name;
        //   return item;
        // });
        let sgArr = [];
        let jlArr = [];
        data.forEach((item) => {
          if (item.type === 'constructionUnit') {
            sgArr.push({
              key: item._id,
              label: item.name,
            });
          }
          if (item.type === 'constructionControlUnit') {
            jlArr.push({
              key: item._id,
              label: item.name,
            });
          }
        });
        gantt.config.lightbox.sections.map((item) => {
          if (item.name === 'sgCompany') {
            item.options = sgArr;
            return item.options;
          } else if (item.name === 'jlCompany') {
            item.options = jlArr;
            return item.options;
          }
          return item;
        });
        if (sgArr.length > 0) {
          handlePerson(sgArr, 'sg');
        }
        if (jlArr.length > 0) {
          handlePerson(jlArr, 'jl');
        }
        gantt._lightbox_methods.get_select_control;
      });
    });
    //获取负责人
    const handlePerson = (item, type) => {
      accountSvc
        .search({
          idCompany: item.target ? item.target.value : item[0].key,
        })
        .then((data) => {
          if (type === 'sg') {
            // 获取施工负责人
            const newsgPrincipalData = (data.data || []).map((item) => {
              item.key = item._id;
              item.label = item.userName;
              return item;
            });
            gantt.config.lightbox.sections.map((item) => {
              // console.log(item);
              if (item.name === 'sgPrincipal') {
                item.options = newsgPrincipalData;
              }
            });
            gantt.getLightboxSection('sgPrincipal').setValue();
            var sgPrincipal = gantt.getLightboxSection('sgPrincipal');
            let id = sgPrincipal.control.id;
            let sgSelection = document.getElementById(id);
            sgSelection.innerHTML = '';
            if (newsgPrincipalData.length > 0) {
              newsgPrincipalData.forEach((item) => {
                let options = document.createElement('option');
                options.value = item.key;
                options.innerHTML = item.label;
                sgSelection.appendChild(options);
              });
            }
          } else if (type === 'jl') {
            // 获取监理负责人
            const newjlPrincipalData = (data.data || []).map((item) => {
              item.key = item._id;
              item.label = item.userName;
              return item;
            });
            gantt.config.lightbox.sections.map((item) => {
              // console.log(item);
              if (item.name === 'jlPrincipal') {
                item.options = newjlPrincipalData;
              }
            });
            gantt.getLightboxSection('jlPrincipal').setValue();
            var glPrincipal = gantt.getLightboxSection('jlPrincipal');
            let id = glPrincipal.control.id;
            let glSelection = document.getElementById(id);
            glSelection.innerHTML = '';
            if (newjlPrincipalData.length > 0) {
              newjlPrincipalData.forEach((item) => {
                let options = document.createElement('option');
                options.value = item.key;
                options.innerHTML = item.label;
                glSelection.appendChild(options);
              });
            }
          }
        });
    };

    // //upload task
    gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      // handleUpload(id, task);
    });
    //add task
    gantt.attachEvent('onAfterTaskAdd', (id, task) => {
      // console.log(222222);
      // handleCreate(id, task);
    });
    //delete task
    gantt.attachEvent('onAfterTaskDelete', (id, task) => handleDelete(id));

    //dbrowClick
    gantt.attachEvent('onTaskDblClick', function (id, e) {
      //any custom logic here
      let data = gantt.getTask(id);
      // console.log(data);
      return true;
    });
    gantt.serverList('delay', [
      {
        key: 0,
        label: '未开始',
        backgroundColor: '#03A9F4',
        textColor: '#FFF',
      },
      {
        key: 1,
        // label: '进行中',
        label: '',
        backgroundColor: '#8FC220',
        textColor: '#FFF',
      },
      {
        key: 2,
        label: '已完成',
        backgroundColor: '#36CFC9  ',
        textColor: '#FFF',
      },
    ]);

    gantt.serverList('priority', [
      { key: 0, label: '低' },
      { key: 1, label: '普通' },
      { key: 2, label: '高' },
    ]);
    // gantt.serverList('sgPrincipal', [
    //   { key: 0, label: '777' },
    //   { key: 1, label: '3333' },
    // ]);

    // gantt.serverList('jlPrincipal', [
    //   { key: 0, label: 'celaing单位人员' },
    //   { key: 1, label: '监理单位人员' },
    // ]);
    //百分比
    var taskProgress = [];
    for (let i = 0; i <= 100; i = i + 10) {
      taskProgress.push({
        key: `${i / 100 == 0 ? 0.00001 : i / 100}`,
        label: `${i}%`,
      });
    }
    gantt.serverList('progress', taskProgress);

    // critical_path
    gantt.plugins({
      critical_path: true,
    });
    gantt.config.highlight_critical_path = true;
    gantt.config.work_time = true;
    // end test data
    gantt.config.grid_width = 720;
    gantt.config.grid_resize = true;
    gantt.config.open_tree_initially = true;

    var labels = gantt.locale.labels;

    labels.column_priority = labels.section_priority = '优先级';
    labels.column_sgPrincipal = labels.section_sgPrincipal = '施工负责人';
    labels.section_sgCompany = '施工单位';
    labels.section_jlCompany = '监理单位';
    labels.section_jlPrincipal = '监理负责人';
    labels.section_progress = '任务完成百分比';
    labels.section_BIMcoding = 'BIM专业构件编码';
    labels.section_importantNode = '';
    labels.column_delay = '状态';
    labels.message_ok = '确定';
    labels.column_batch = '';
    gantt.config.buttons_left = [];
    gantt.config.buttons_right = ['gantt_cancel_btn'];
    function byId(list, id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].key == id) return list[i].label || '';
      }
      return '';
    }

    //checkbox
    gantt.config.columns = [
      {
        name: 'delay',
        label: '标签',
        width: 80,
        align: 'center',
        template: function (item) {
          let labels = ``;
          if (item.taskTags == '0') {
            labels += `<div class='delay_tags delay_tags_delay'>延</div>`;
          } else if (item.taskTags == '1') {
            labels += `<div class='delay_tags delay_tags_vdelay'>严</div>`;
          }
          return `<div>${labels}</div>`;
          // const v = byId(gantt.serverList('delay'), item.delay);
          // return v;
        },
      },
      // {
      //   name: 'batch',
      //   height: 22,
      //   width: 20,
      //   label: '',
      //   // map_to: 'batch',
      //   template: function (item) {
      //     // console.log(item);
      //     return `<input id=${
      //       'input_' + item.id
      //     } type='checkbox' style="cursor:pointer" name="${
      //       item.text
      //     }" onclick="gantt.setCheckBoxValue(${item.id})"
      //     } />`;
      //   },
      // },
      { name: 'text', label: '名称', tree: true, width: '300' },
      {
        name: 'sgPrincipal',
        label: '负责人',
        width: 80,
        align: 'center',
        template: function (item) {
          // console.log(item.account.userName);
          return item.resourcAccount && item.resourcAccount.length > 0
            ? item.resourcAccount[0].userName
            : item.resource && item.resource.length > 0
            ? item.resource
            : '';
        },
      },
      {
        name: 'start_date',
        label: '计划时间',
        width: 100,
        align: 'center',
        template: function (item) {
          // console.log(item);
          const date = moment(new Date(item.start_date).toISOString()).format(
            'YYYY-MM-DD'
          );
          return date;
        },
      },
      {
        name: 'duration',
        label: '人天',
        width: 60,
        align: 'center',
      },
      // { name: 'add', width: 40 },
    ];
    gantt.config.lightbox.sections = [
      {
        name: 'description',
        height: 22,
        map_to: 'text',
        type: 'textarea',
        focus: true,
      },
      {
        name: 'priority',
        height: 22,
        map_to: 'priority',
        type: 'select',
        options: gantt.serverList('priority'),
      },
      {
        name: 'sgCompany',
        height: 22,
        map_to: 'sgCompany',
        type: 'select',
        focus: true,
        options: gantt.serverList('sgCompany'),
        // default_value: '',
        onchange: (item) => handlePerson(item, 'sg'),
      },
      {
        name: 'sgPrincipal',
        height: 22,
        map_to: 'sgPrincipal',
        type: 'select',
        focus: true,
        options: gantt.serverList('sgPrincipal'),
      },
      {
        name: 'jlCompany',
        height: 22,
        map_to: 'jlCompany',
        type: 'select',
        focus: true,
        options: gantt.serverList('jlCompany'),
        // default_value: '',
        onchange: (item) => handlePerson(item, 'jl'),
      },
      {
        name: 'jlPrincipal',
        type: 'select',
        height: 22,
        map_to: 'jlPrincipal',
        focus: true,
        options: gantt.serverList('jlPrincipal'),
      },
      {
        name: 'progress',
        height: 38,
        map_to: 'progress',
        type: 'select',
        options: gantt.serverList('progress'),
      },
      {
        name: 'time',
        type: 'duration',
        map_to: 'auto',
        time_format: ['%Y', '%m', '%d'],
      },
      {
        name: 'BIMcoding',
        height: 22,
        map_to: 'BIMcoding',
        type: 'textarea',
        options: gantt.serverList('BIMcoding'),
      },
      {
        name: 'importantNode',
        height: 22,
        map_to: 'importantNode',
        type: 'checkbox',
        options: [{ key: '1', label: '是否是重要节点' }],
      },
    ];

    gantt.delayFunction = (target, id) => {
      if (delayClick) {
        delayClick(target, id);
      }
    };

    gantt.templates.rightside_text = function (start, end, task) {
      const v = byId(gantt.serverList('delay'), task.delay);
      return v
        ? `<div onclick="gantt.delayFunction(this, ${task.id})" style="cursor: pointer"><i class="fa fa-flag" style="color: red; font-size: 24px;" /></div>`
        : '';
    };

    gantt.templates.grid_row_class = gantt.templates.task_row_class = gantt.templates.task_class = function (
      start,
      end,
      task
    ) {
      var css = [];
      if (task.$virtual || task.type == gantt.config.types.project)
        css.push('summary-bar');

      if (task.delay) {
        css.push('gantt_resource_task gantt_resource_' + task.delay);
      }

      return css.join(' ');
    };
    //task
    gantt.templates.task_text = function (start, end, task) {
      return `${task.text}(已完成${Math.round(task.progress * 100)}%)`;
    };
    // progress
    // gantt.templates.progress_text = function (start, end, task) {
    //   return (
    //     "<span style='text-align:left;'>" +
    //     '已完成' +
    //     Math.round(task.progress * 100) +
    //     '% </span>'
    //   );
    // };
    gantt.attachEvent('onParse', function () {
      var styleId = 'dynamicGanttStyles';
      var element = document.getElementById(styleId);
      if (!element) {
        element = document.createElement('style');
        element.id = styleId;
        document.querySelector('head').appendChild(element);
      }
      var html = [];
      var resources = gantt.serverList('delay');

      resources.forEach(function (r) {
        html.push(
          '.gantt_task_line.gantt_resource_' +
            r.key +
            '{' +
            'background-color:' +
            r.backgroundColor +
            '; ' +
            'color:' +
            r.textColor +
            ';' +
            '}'
        );
        // html.push(
        //   '.gantt_row.gantt_resource_' +
        //     r.key +
        //     ' .gantt_cell:nth-child(1) .gantt_tree_content{' +
        //     'background-color:' +
        //     r.backgroundColor +
        //     '; ' +
        //     'color:' +
        //     r.textColor +
        //     ';' +
        //     '}'
        // );
      });
      element.innerHTML = html.join('');
    });

    // if (!data) {
    //   // progressSvc.query({}).then((datas) => {
    //   //   const progressData: any = datas.data;
    //   //   // console.log(progressData);
    //   //   const taskInfo = {
    //   //     data: progressData.data.map((item) => {
    //   //       let endDate = new Date(item.start_date);
    //   //       let endDate1 = endDate.getTime() + item.duration * 3600 * 24 * 1000;
    //   //       item.start_date = moment(item.start_date).format('DD-MM-YYYY');
    //   //       item.end_date = moment(new Date(endDate1).toISOString()).format(
    //   //         'DD-MM-YYYY'
    //   //       );
    //   //       // item.check_value = false;
    //   //       item.importantNode =
    //   //         item.importantNode && item.importantNode == '1' ? '1' : '0';
    //   //       item.id = item._id;
    //   //       item.$custom_data = null;
    //   //       item.delay = 1;
    //   //       return item;
    //   //     }),
    //   //   };
    //   //   // console.log(taskInfo);
    //   //   gantt.parse(taskInfo);
    //   // });

    //   // gantt.load('/api/progress/search').then((data) => {
    //   //   console.log(data);
    //   // });
    // }
    function getAllChildrens(id) {
      let childs = gantt.getChildren(id);
      if (childs.length > 0) {
        childs.forEach((childsId) => {
          let childs1 = getAllChildrens(childsId);
          childs.push(...childs1);
        });
      }
      return childs;
    }
    // 选中状态
    gantt.setCheckBoxValue = (id) => {
      let childs = getAllChildrens(id);

      if ($(`#input_${id}`).is(':checked')) {
        $(`#input_${id}`).attr('checked', true);
        childs.forEach((id) => {
          $(`#input_${id}`).attr('checked', true); //or
        });
      } else {
        $(`#input_${id}`).attr('checked', false);
        childs.forEach((id) => {
          $(`#input_${id}`).attr('checked', false); //or
        });
      }
      // gantt.getChildren
    };
    gantt.render();
    // $("div.gantt_cell:[data-column-name='batch']").css('display', 'none');
  }
}

export default ScriptGanttAssigningResources;
