import * as React from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl';
import { Values } from "@alephdata/followthemoney";
import { Button, ControlGroup, FormGroup, InputGroup, TagInput, TextArea, Tooltip } from "@blueprintjs/core";
import { ITypeProps } from "./common";

import "./TextEdit.scss";

const messages = defineMessages({
  add_additional: {
    id: 'editor.text.additional',
    defaultMessage: 'Add additional values',
  },
});

interface ITextEditProps extends ITypeProps, WrappedComponentProps {}

interface ITextEditState {
  forceMultiEdit: boolean,
  currMultiInputValue: string,
}

class TextEditBase extends React.PureComponent<ITextEditProps, ITextEditState> {
  static group = new Set(['date', 'text', 'string'])
  private containerRef: any | null = null;
  private multiInputRef: HTMLInputElement | null = null;
  private singleInputRef: HTMLTextAreaElement | null = null;

  constructor(props: ITextEditProps) {
    super(props);

    this.state = {
      forceMultiEdit: false,
      currMultiInputValue: ''
    }

    this.triggerMultiEdit = this.triggerMultiEdit.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    if (this.singleInputRef) {
      this.singleInputRef.focus();
      if (this.singleInputRef?.value?.length) {
        const valLength = this.singleInputRef.value.length;
        this.singleInputRef.setSelectionRange(valLength, valLength);
      }
    }
    this.multiInputRef && this.multiInputRef.focus();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate(prevProps: ITextEditProps, prevState: ITextEditState) {
    // ensure multi input is focused
    if (this.state.forceMultiEdit && !prevState.forceMultiEdit) {
      this.multiInputRef && this.multiInputRef.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e: MouseEvent) {
    const { onSubmit, values } = this.props;
    const { currMultiInputValue } = this.state;
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as Element;
    if (target && this.containerRef && !this.containerRef.contains(target)) {
      if (currMultiInputValue) {
        onSubmit([...values, ...[currMultiInputValue]]);
      } else {
        onSubmit(values);
      }
    }
  }

  onChange = (values: Array<string | React.ReactNode>) => {
    // remove duplicates
    this.props.onChange(Array.from(new Set(values)) as unknown as Values)
    if (values.length <= 1) {
      this.setState({ forceMultiEdit: false });
    }
  }

  triggerMultiEdit(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ forceMultiEdit: true });
  }

  render() {
    const { intl, onSubmit, property, values } = this.props;
    const { currMultiInputValue, forceMultiEdit } = this.state;
    const numVals = values.length;
    // don't show multi button if there is no existing input
    const showMultiToggleButton = numVals !== 0 && values[0] !== '';

    return (
      <div ref={(node) => this.containerRef = node}>
        <form onSubmit={(e: any) => { e.preventDefault(); e.stopPropagation(); onSubmit(values); }}>
          <FormGroup>
            {(!forceMultiEdit && numVals <= 1) && (
              <div className="bp3-input-group">
                <TextArea
                  className="TextEdit__singleInput"
                  inputRef={(ref) => this.singleInputRef = ref}
                  value={values[0] as string || ''}
                  rows={1}
                  growVertically
                  fill
                  style={{resize:"none", overflow:"hidden"}}
                  onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => {
                    const value = e.target.value;
                    // avoid setting an empty string val
                    return this.onChange(value ? [value] : [])
                  }}
                  onKeyDown={(e:any) => {
                    // override textarea Enter to submit input
                    if (e.keyCode == 13) {
                      e.preventDefault();
                      e.stopPropagation();
                      onSubmit(values);
                    }
                  }}
                />
                {showMultiToggleButton && (
                  <Button
                    className="TextEdit__toggleMulti"
                    minimal
                    small
                    icon="plus"
                    onClick={this.triggerMultiEdit}
                  />
                )}
              </div>
            )}
            {(forceMultiEdit || numVals > 1) && (
              <TagInput
                inputRef={(ref) => this.multiInputRef = ref}
                tagProps={{
                  minimal:true,
                }}
                addOnPaste
                fill
                onChange={this.onChange}
                values={this.props.values}
                inputValue={currMultiInputValue}
                onInputChange={(e:React.ChangeEvent<HTMLInputElement>) => (
                  this.setState({ currMultiInputValue: e.target.value })
                )}
              />
            )}
          </FormGroup>
        </form>
      </div>
    );
  }
}

export const TextEdit = injectIntl(TextEditBase);
