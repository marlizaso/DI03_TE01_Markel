import { CHART_PALETTE } from '../utils/chart-colors';
// dentro de render():
const colorMichelin = CHART_PALETTE[2];
const colorRepsol   = CHART_PALETTE[3];
// y en los datasets:
borderColor: colorMichelin, backgroundColor: colorMichelin + '22', pointBorderColor: colorMichelin,
borderColor: colorRepsol,   backgroundColor: colorRepsol + '22',   pointBorderColor: colorRepsol,