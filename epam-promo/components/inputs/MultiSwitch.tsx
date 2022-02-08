import * as React from 'react';
import { IEditable, IHasForwardedRef, IHasRawProps } from '@epam/uui';
import { ButtonProps } from '@epam/uui-components';
import { ControlGroup } from '../layout';
import { Button, ButtonColor, ButtonMods } from '../buttons';
import { SizeMod } from '../types';

interface MultiSwitchItem<TValue> extends ButtonProps, ButtonMods {
    id: TValue;
}

export interface MultiSwitchProps<TValue> extends IEditable<TValue>, SizeMod, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    items: MultiSwitchItem<TValue>[];
    color?: ButtonColor;
}

export class MultiSwitch<TValue> extends React.Component<MultiSwitchProps<TValue>> {
    render() {
        return (
            <ControlGroup ref={ this.props.forwardedRef } rawProps={ { ...this.props.rawProps, role: 'tablist' } }>
                {
                    this.props.items.map((item, index) =>
                        <Button
                            {  ...item }
                            isDisabled={ this.props.isDisabled }
                            key={ index + '-' + item.id }
                            onClick={ () => this.props.onValueChange(item.id) }
                            fill={ this.props.value === item.id ? 'solid' : 'white' }
                            color={ item.color || 'blue' }
                            size={ this.props.size }
                            rawProps={ { 'aria-current': this.props.value === item.id, role: 'tab' } }
                        />,
                    )
                }
            </ControlGroup>
        );
    }
}