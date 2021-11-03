import React, { CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Scrollbars, * as CustomScrollBars from 'react-custom-scrollbars-2';
import { IHasCX, cx } from '@epam/uui';
import * as css from './ScrollBars.scss';

export interface ScrollbarProps extends IHasCX, CustomScrollBars.ScrollbarProps {
    hasTopShadow?: boolean;
    hasBottomShadow?: boolean;
    ref?: React.MutableRefObject<Scrollbars>;
    horizontal?: boolean;
    vertical?: boolean;
}

export interface PositionValues extends CustomScrollBars.positionValues {}

export interface ScrollbarsApi extends Scrollbars {}

enum uuiScrollbars {
    uuiShadowTop = 'uui-shadow-top',
    uuiShadowBottom = 'uui-shadow-bottom',
    uuiThumbVertical = 'uui-thumb-vertical',
    uuiThumbHorizontal = 'uui-thumb-horizontal',
    uuiShadowTopVisible = 'uui-shadow-top-visible',
    uuiShadowBottomVisible = 'uui-shadow-bottom-visible',
};

export const ScrollBars = forwardRef(({
    style,
    hasBottomShadow,
    hasTopShadow,
    horizontal = true,
    vertical = true,
    ...props
}: ScrollbarProps, ref) => {
    const bars = useRef<Scrollbars>();

    useImperativeHandle(ref, () => bars.current, [bars.current]);

    const handleUpdateScroll = (event?: React.UIEvent) => {
        if (!bars.current) return;
        event && props.onScroll?.(event);

        const scrollBars = bars.current.container;
        const { scrollTop, scrollHeight, clientHeight } = bars.current.getValues();
        const showBottomShadow = hasBottomShadow && (scrollHeight - clientHeight > scrollTop);

        if (hasTopShadow && scrollTop > 0) {
            scrollBars?.classList?.add(uuiScrollbars.uuiShadowTopVisible);
        } else {
            scrollBars?.classList?.remove(uuiScrollbars.uuiShadowTopVisible);
        }

        if (showBottomShadow) {
            scrollBars?.classList?.add(uuiScrollbars.uuiShadowBottomVisible);
        } else {
            scrollBars?.classList?.remove(uuiScrollbars.uuiShadowBottomVisible);
        }
    };

    useEffect(handleUpdateScroll);

    const renderView = ({ style, ...rest }: { style: CSSProperties, rest: {} }) => (
        <div
            style={ { ...style, ...{ position: 'relative', flex: '1 1 auto' } } }
            { ...rest }
        />
    );

    return (
        <CustomScrollBars.default
            className={ cx(
                css.root,
                props.cx,
                props.className,
                hasTopShadow && uuiScrollbars.uuiShadowTop,
                hasBottomShadow && uuiScrollbars.uuiShadowBottom,
            ) }
            renderView={ renderView }
            renderThumbHorizontal={ horizontal ? () => <div className={ uuiScrollbars.uuiThumbHorizontal } /> : undefined }
            renderThumbVertical={ vertical ? () => <div className={ uuiScrollbars.uuiThumbVertical } /> : undefined }
            style={ { ...{ display: 'flex' }, ...style } }
            onScroll={ handleUpdateScroll }
            ref={ bars }
            { ...props }
        >
            { props.children }
        </CustomScrollBars.default>
    );
});