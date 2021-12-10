import { getZoomConfig } from './ScriptGanttConfig';
// import gantt_app from '../gantt_app.js';
class ScriptGantt {
  gantt = null;
  dataProcessor = null;

  constructor() {
    this.gantt = require('../../../progressManage/dhtmlxgantt').gantt;
    // this.gantt = require('dhtmlx-gantt').gantt;
    // // require('dhtmlx-gantt/codebase/locale/locale_cn');
    // require('dhtmlx-gantt/codebase/dhtmlxgantt');
    // require('../gantt_app');
  }

  init(container, data) {
    this.gantt.config.xml_date = '%Y-%m-%d %H:%i';
    this.initZoom();
    // this.gantt.config.auto_scheduling = true;
    this.gantt.init(container);
    if (data) {
      this.gantt.parse(data);
      this.initGanttDataProcessor();
    }
    // this.setZoom('Days');
  }

  initZoom() {
    this.gantt.ext.zoom.init(getZoomConfig(this.gantt));
  }

  // setZoom(value) {
  //   this.gantt.ext.zoom.setLevel(value);
  // }

  zoomIn() {
    this.gantt.ext.zoom.zoomIn();
  }
  zoomOut() {
    this.gantt.ext.zoom.zoomOut();
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */
    const onDataUpdated = console.log;
    this.dataProcessor = this.gantt.createDataProcessor(
      (type, action, item, id) => {
        return new Promise((resolve, reject) => {
          if (onDataUpdated) {
            onDataUpdated(type, action, item, id);
          }

          // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
          // resolve({id: databaseId});
          return resolve();
        });
      }
    );
  }

  destructor() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }
}

export default ScriptGantt;
