import type { ChartType } from 'chart.js';
import type { Options } from 'chartjs-plugin-datalabels';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    datalabels?: Options<TType>;
  }
}
