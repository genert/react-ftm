import * as React from 'react'
import truncateText from 'truncate';

import { Date, Numeric, URL } from 'types';
import { Point } from 'NetworkDiagram/layout/Point'

const labelTruncate = 30;

interface IVertexLabelRendererProps {
  label: string,
  center: Point,
  onClick?: (e: any) => void,
  color?: string
  type: string
}

export class VertexLabelRenderer extends React.PureComponent<IVertexLabelRendererProps> {
  formatLabel() {
    const { label, type } = this.props;

    if (type === 'url') {
      return <URL value={label} onClick={(e: React.MouseEvent) => e.stopPropagation()} truncate={labelTruncate} />;
    }
    if (type === 'date') {
      return <Date value={label} />;
    }
    if (type === 'number') {
      return <Numeric num={Number(label)} />;
    }

    return truncateText(label, labelTruncate);
  }

  render() {
    const { center, onClick, color } = this.props;
    const style = {
      fontSize: "5px",
      fontFamily: "sans-serif",
      fontWeight: "bold"
    } as React.CSSProperties
    return (
      <text x={center.x}
        y={center.y}
        textAnchor="middle"
        alignmentBaseline="middle"
        filter="url(#solid)"
        style={style}
        pointerEvents="none"
        fill={color || 'black'}
        onClick={onClick}>
        {this.formatLabel()}
      </text>
    );
  }
}
