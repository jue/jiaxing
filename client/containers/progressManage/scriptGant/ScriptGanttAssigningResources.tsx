import ScriptGanttZoomToFit from './ScriptGanttZoomToFit';
import react from 'react';
import progressSvc from '../../../services/ProgressSvc';
import { time } from 'highcharts';
import moment from 'antd/node_modules/moment';
import { Checkbox, message } from 'antd';
import clsx from 'clsx';
import companySvc from '../../../services/companySvc';
import accountSvc from '../../../services/accountSvc';
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
    // console.log(gantt);
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
          progress: item.progress <= 0.00001 ? 0.00001 : item.progress,
          open: 'true',
          parent: item.parent + '',
          custom_data: {
            priority: item.priority,
            BIMcoding: item.BIMcoding,
            jlPrincipal: item.jlPrincipal,
          },
          resource: [item.sgPrincipal],
          delay: '',
          importantNode:
            item.importantNode && item.importantNode == '1' ? '1' : '0',
          taskTags: '',
        },
        _id: item.id,
        ids: [''],
        projectId: '',
      };
    };
    const handleUpdate = async (id, item) => {
      try {
        let new_task: any = getParams(item, 'update');
        // console.log(new_task);
        const data = await progressSvc.update({
          ...new_task,
        });
        if (data.code == 200) {
          message.success('任务更新已提交审批，具体请至“进度审批列表”查看!');
        } else {
          message.error(data.msg);
        }
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        gantt.updateFlag = false;
      }, 200);
    };
    const handleCreate = async (id, item) => {
      // console.log('执行了');
      let obj: any = getParams(item, 'create');
      const data = await progressSvc.create(obj);
      if (data.code == 200) {
        message.success('新增任务已提交审批，具体请至“进度审批列表”查看!');
      } else {
        message.error(data.msg);
      }
      setTimeout(() => {
        gantt.timer = false;
      }, 200);
    };

    const handleDelete = async (id) => {
      const data = await progressSvc.delete({
        actionType: 'delete',
        _id: id,
        // data: {},
      });
      if (data.code == 200) {
        message.success('删除已提交审批，具体请至“进度审批列表”查看！');
      } else {
        message.error(data.msg);
      }
      setTimeout(() => {
        gantt.deleteFlag = false;
      }, 200);
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
    gantt.updateFlag = false;
    gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      if (!gantt.updateFlag) {
        handleUpdate(id, task);
        gantt.updateFlag = true;
      }
    });
    //add task
    gantt.timer = false;
    gantt.attachEvent('onAfterTaskAdd', (id, task) => {
      if (!gantt.timer) {
        handleCreate(id, task);
        gantt.timer = true;
      }
    });
    //delete task
    gantt.deleteFlag = false;
    gantt.attachEvent('onAfterTaskDelete', (id, task) => {
      if (!gantt.deleteFlag) {
        handleDelete(id);
        gantt.deleteFlag = true;
      }
    });
    //dbrowClick
    gantt.attachEvent('onTaskDblClick', function (id, e) {
      //any custom logic here
      let data = gantt.getTask(id);
      // console.log(data);
      return true;
    });
    // gantt.attachEvent('onDataRender', function () {
    //   $(".gantt_cell[data-column-name='batch']").css('display', 'none');
    // });
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
    // gantt.serverList('progress', taskProgress);
    // critical_path
    gantt.plugins({
      critical_path: true,
    });
    gantt.config.highlight_critical_path = true;
    // gantt.config.work_time = true;

    // end test data
    gantt.config.grid_width = 720;
    gantt.config.grid_resize = true;
    gantt.config.open_tree_initially = true;

    var labels = gantt.locale.labels;
    // console.log(labels);

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
    labels.confirm_deleting = '是否删除此任务';
    function byId(list, id) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].key == id) return list[i].label || '';
      }
      return '';
    }
    // 会重新渲染
    // gantt.config.smart_rendering = false;
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
        },
      },
      {
        name: 'batch',
        height: 22,
        width: 20,
        label: '',
        template: function (item) {
          if (gantt.children.indexOf(item.id) == -1) {
            return `<input id=${
              'input_' + item.id
            } type='checkbox' style="cursor:pointer" name="${
              item.text
            }" onclick="gantt.setCheckBoxValue('${item._id}')" />`;
          } else {
            return `<input id=${
              'input_' + item.id
            } type='checkbox' style="cursor:pointer" name="${
              item.text
            }" checked="checked" onclick="gantt.setCheckBoxValue('${
              item.id
            }')" />`;
          }
        },
      },
      { name: 'text', label: '名称', tree: true, width: '300' },
      {
        name: 'sgPrincipal',
        label: '负责人',
        width: 80,
        align: 'center',
        template: function (item) {
          // console.log(item);
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
      { name: 'add', width: 40 },
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
        options: [
          { key: 0, label: '低' },
          { key: 1, label: '普通' },
          { key: 2, label: '高' },
        ],
      },
      {
        name: 'sgCompany',
        height: 22,
        map_to: 'sgCompany',
        type: 'select',
        focus: true,
        options: gantt.serverList('sgCompany'),
        // default_value: '',
        onchange: (item) => {
          // console.log(arguments);
          handlePerson(item, 'sg');
        },
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
        focus: true,
        // options: gantt.serverList('progress'),
        options: taskProgress,
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

    if (!data) {
      progressSvc.query({}).then((datas) => {
        const progressData: any = datas.data;
        // console.log(progressData);
        const taskInfo: any = {
          data: progressData.data.filter((item) => {
            if (!item.deleted) {
              let endDate = new Date(item.start_date);
              let endDate1 =
                endDate.getTime() + item.duration * 3600 * 24 * 1000;
              item.start_date = moment(item.start_date).format('DD-MM-YYYY');
              item.end_date = moment(new Date(endDate1).toISOString()).format(
                'DD-MM-YYYY'
              );
              item.sgPrincipal =
                item.resource.length > 0 ? item.resource[0] : '';
              item.id = item._id;
              // item.$custom_data = null;
              item.BIMcoding = item.custom_data.BIMcoding;
              item.jlPrincipal = item.custom_data.jlPrincipal;
              item.priority = item.custom_data.priority;
              item.progress =
                item.progress <= 0.00001 ? 0.00001 : item.progress;
              item.delay = 1;
              item.importantNode =
                item.importantNode && item.importantNode == '1' ? '1' : '0';
              return item;
            }
          }),
          // links:
          //   progressData.data &&
          //   progressData.data.length > 0 &&
          //   progressData.data[0].detail
          //     ? progressData.data[0].detail.links
          //     : [],
        };
        for (let i = 0; i < progressData.data.length; i++) {
          if (progressData.data[i].detail) {
            taskInfo.links = progressData.data[i].detail.links;
            break;
          }
        }
        // console.log(taskInfo);
        // gantt.clearAll();
        gantt.parse(taskInfo);
      });
    }
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
    gantt.checkFlag = null;
    gantt.children = [];
    // 选中状态
    gantt.setCheckBoxValue = (id) => {
      gantt.checkFlag = true;
      let childs = getAllChildrens(id);
      childs.unshift(id);
      // $(`#input_${id}`).prop("checked", true);
      if ($(`#input_${id}`).is(':checked')) {
        // $(`#input_${id}`).attr('checked', true);
        childs.forEach((id1) => {
          // $(`#input_${id1}`).attr('checked', true); //or
          $(`#input_${id1}`).prop('checked', true);
          if (gantt.children.indexOf(id1) == -1) {
            gantt.children.push(id1);
          }
        });
      } else {
        let newChildren = gantt.children.filter((item) => {
          return childs.indexOf(item) == -1;
        });
        childs.forEach((item) => {
          // $(`#input_${item}`).attr('checked', false);
          $(`#input_${item}`).prop('checked', false);
        });
        gantt.children = newChildren;
      }
    };
    // 列选中 样式
    var selected_column = null;
    gantt.attachEvent('onScaleClick', function (e, date) {
      selected_column = date;
      var pos = gantt.getScrollState();
      gantt.render();
      gantt.scrollTo(pos.x, pos.y);
    });
    function is_selected_column(column_date) {
      if (
        selected_column &&
        column_date.valueOf() == selected_column.valueOf()
      ) {
        return true;
      }
      return false;
    }
    let date1 = new Date().toJSON().split('T');
    let currentDate = new Date(date1[0]).getTime();
    gantt.templates.scale_cell_class = function (date) {
      let time = date.toJSON().split('T');
      let time1 = new Date(time[0]).getTime();
      if (time1 == currentDate) {
        return 'highlighted-column';
      }
      if (is_selected_column(date)) return 'highlighted-column';
    };
    gantt.templates.timeline_cell_class = function (item, date) {
      let time = date.toJSON().split('T');
      let time1 = new Date(time[0]).getTime();
      if (time1 == currentDate) {
        return 'highlighted-column';
      }
      if (is_selected_column(date)) return 'highlighted-column';
    };
    gantt.attachEvent('onTaskClick', function (id, e) {
      if (gantt.checkFlag) {
        gantt.checkFlag = null;
        return false;
      }
      return true;
    });
    gantt.render();
  }
  destructor() {
    // $('#ganttContainer').html('');
    // this.gantt.destructor();
  }
}

export default ScriptGanttAssigningResources;
