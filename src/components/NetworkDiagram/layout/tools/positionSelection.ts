import { GraphLayout } from 'NetworkDiagram/layout';
import alignCircle from './alignCircle';
import alignHorizontal from './alignHorizontal';
import alignVertical from './alignVertical';
import arrangeTree from './arrangeTree';
import forceLayout from './forceLayout';

const positioning = {
  'alignCircle': alignCircle,
  'alignHorizontal': alignHorizontal,
  'alignVertical': alignVertical,
  'arrangeTree': arrangeTree,
  'forceLayout': forceLayout,
}

const positionSelection = (layout: GraphLayout, type: string, options?: any) => {
  let vertices;
  let edges;
  let groupings;

  if (layout.hasSelection()) {
    vertices = layout.getSelectedVertices().filter(v => !v.isHidden());
    edges = layout.getSelectionAdjacentEdges();
    groupings = layout.getSelectedGroupings();
  } else {
    vertices = layout.getVertices().filter(v => !v.isHidden());
    edges = layout.getEdges();
    groupings = layout.getGroupings();
  }

  const positioningFunc = positioning[type]({ vertices, edges, groupings, options });

  return layout.applyPositioning(positioningFunc, vertices);
}

export default positionSelection;
