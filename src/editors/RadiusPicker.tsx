import * as React from 'react'
import { Slider } from '@blueprintjs/core';
import { GraphContext } from 'NetworkDiagram/GraphContext';
import { Schema as FTMSchema } from "@alephdata/followthemoney";
import { Schema } from 'types';


interface IRadiusPickerProps {
  currSelected?: number
  onChange: (radius: number) => void
  schema: FTMSchema
  radius: number
}

import './RadiusPicker.scss'

class RadiusPicker extends React.PureComponent<IRadiusPickerProps> {
  static contextType = GraphContext;

  render() {
    const { layout } = this.context;
    const { onChange, radius, schema } = this.props;
    const defaultRadius = layout.config.DEFAULT_VERTEX_RADIUS;
    const radiusRange = [defaultRadius * .5, defaultRadius * 1.5];
    return (
      <div className='RadiusPicker'>
        <div className='RadiusPicker__icon'>
          <Schema.Icon
            size={10}
            schema={schema}
          />
        </div>
        <Slider
          value={radius || defaultRadius}
          onChange={(value) => onChange(value)}
          min={radiusRange[0]}
          max={radiusRange[1]}
          showTrackFill={false}
          stepSize={.1}
          labelRenderer={false}
          className='RadiusPicker__slider'
        />
        <div className='RadiusPicker__icon'>
          <Schema.Icon
            size={20}
            schema={schema}
          />
        </div>
      </div>
    )
  }
}

export default RadiusPicker;
