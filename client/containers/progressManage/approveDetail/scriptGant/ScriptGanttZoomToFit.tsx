import ScriptGantt from './ScriptGantt';
import { getScaleConfigs } from './ScriptGanttConfig';
import progressSvc from '../../../../services/ProgressSvc';

class ScriptGanttZoomToFit extends ScriptGantt {
  cachedSettings = {} as any;
  constructor() {
    super();
  }

  toggleMode(fitToView, callback) {
    if (!fitToView) {
      //Saving previous scale state for future restore
      this.saveConfig();
      this.zoomToFit();
    } else {
      //Restore previous scale state
      this.restoreConfig();
      this.gantt.render();
    }
    callback();
  }

  saveConfig() {
    var config = this.gantt.config;
    this.cachedSettings = {};
    this.cachedSettings.scales = config.scales;
    this.cachedSettings.start_date = config.start_date;
    this.cachedSettings.end_date = config.end_date;
  }

  restoreConfig() {
    this.applyConfig(this.cachedSettings);
  }

  applyConfig(config, dates?) {
    this.gantt.config.scales = config.scales;

    if (dates && dates.start_date && dates.end_date) {
      this.gantt.config.start_date = this.gantt.date.add(
        dates.start_date,
        -1,
        config.scales[0].subscale_unit
      );
      this.gantt.config.end_date = this.gantt.date.add(
        this.gantt.date[config.scales[0].subscale_unit + '_start'](
          dates.end_date
        ),
        2,
        config.scales[0].subscale_unit
      );
    } else {
      this.gantt.config.start_date = this.gantt.config.end_date = null;
    }
  }

  zoomToFit() {
    var project = this.gantt.getSubtaskDates(),
      areaWidth = this.gantt.$task.offsetWidth;
    const scaleConfigs = getScaleConfigs(this.gantt);
    for (var i = 0; i < scaleConfigs.length; i++) {
      var columnCount = this.getUnitsBetween(
        project.start_date,
        project.end_date,
        scaleConfigs[i].scales[0].subscale_unit,
        scaleConfigs[i].scales[0].step
      );

      if ((columnCount + 2) * this.gantt.config.min_column_width >= areaWidth) {
        --i;
        break;
      }
    }

    if (i == scaleConfigs.length) {
      i--;
    }

    this.applyConfig(scaleConfigs[i], project);
    this.gantt.render();
  }

  // get number of columns in timeline
  getUnitsBetween(from, to, unit, step) {
    var start = new Date(from),
      end = new Date(to);
    var units = 0;
    while (start.valueOf() < end.valueOf()) {
      units++;
      start = this.gantt.date.add(start, step, unit);
    }
    return units;
  }
}

export default ScriptGanttZoomToFit;
