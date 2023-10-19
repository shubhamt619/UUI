import { Button, FlexCell, FlexSpacer, IconButton, Panel, RadioInput, Spinner, Switch } from '@epam/uui';
import css from './ComponentEditorView.module.scss';
import { ClassValue, cx, INotification } from '@epam/uui-core';
import { FlexRow, MultiSwitch, NotificationCard, ScrollBars, Text, Tooltip } from '@epam/promo';
import { copyTextToClipboard } from '../../../helpers';
import * as React from 'react';
import { ReactComponent as FlashIcon } from '@epam/assets/icons/common/action-flash-18.svg';
import { ReactComponent as CopyIcon } from '../../../icons/icon-copy.svg';
import { ReactComponent as ResetIcon } from '../../../icons/reset-icon.svg';
import { ReactComponent as NotificationIcon } from '../../../icons/notification-check-fill-24.svg';
import { DemoComponentProps, PropDoc, IPropSamplesCreationContext } from '@epam/uui-docs';
import { PropEditor } from './PropEditor';
import { svc } from '../../../services';

interface IComponentEditorViewProps {
    isInited: boolean;
    onPropExampleChange: (props: { propName: string, exampleId: string, propValue?: string, remountOnChange: boolean }) => void;
    propSamplesCreationContext: IPropSamplesCreationContext,
    DemoComponent: React.ComponentType<any>;
    SelectedDemoContext: React.ComponentType<DemoComponentProps>;
    availableCtxNames: string[],
    canReset: boolean;
    currentTheme: string;
    demoComponentProps: { [p: string]: any }
    onChangeSelectedCtx: (name: string) => void;
    onGetPropExampleId: (name: string) => string;
    onGetPropValue: (propName: string) => any;
    onReset: () => void;
    onToggleShowCode: () => void;
    onResetProp: (name: string) => void;
    propDoc: PropDoc<any, string | number | symbol>[]
    propsCx: ClassValue;
    selectedCtxName: string,
    showCode: boolean;
    tagName: string;
    title: string;
    generateDoc: boolean;
    isGenerateDocSupported: boolean;
    onChangeGenerateDoc: (b: boolean) => void;
}
export function ComponentEditorView(props: IComponentEditorViewProps) {
    const {
        onGetPropValue,
        propSamplesCreationContext,
        DemoComponent,
        SelectedDemoContext,
        availableCtxNames,
        canReset,
        currentTheme,
        demoComponentProps,
        onChangeSelectedCtx,
        onGetPropExampleId,
        onReset,
        onToggleShowCode,
        onResetProp,
        propDoc,
        propsCx,
        selectedCtxName,
        showCode,
        tagName,
        title,
        generateDoc,
        onChangeGenerateDoc,
        isGenerateDocSupported,
        onPropExampleChange,
        isInited,
    } = props;

    if (!isInited) {
        return <Spinner />;
    }

    const renderPropertyRow = (prop: PropDoc<any, string | number | symbol>, index: number) => {
        const key = `${prop.name}_${index}`;
        return (
            <FlexRow key={ key } size="36" borderBottom padding="12" spacing="6">
                <FlexCell key="name" width={ 130 }>
                    <Text>{prop.name}</Text>
                </FlexCell>
                <FlexCell key="default" width={ 110 }>
                    {!prop.isRequired && (
                        <RadioInput
                            label={ prop.defaultValue == null ? 'none' : prop.defaultValue + '' }
                            size="18"
                            value={ !onGetPropExampleId(prop.name) }
                            onValueChange={ () => onResetProp(prop.name) }
                        />
                    )}
                </FlexCell>
                <FlexCell key="examples" grow={ 1 }>
                    <FlexRow size="36" spacing="6">
                        <PropEditor
                            onGetPropValue={ onGetPropValue }
                            onGetPropExampleId={ onGetPropExampleId }
                            prop={ prop }
                            propSamplesCreationContext={ propSamplesCreationContext }
                            onPropExampleChange={ onPropExampleChange }
                        />
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <div className={ cx(css.root, propsCx) }>
            <div className={ css.container }>
                <FlexRow key="head" size="36" padding="12" borderBottom spacing="6" cx={ css.boxSizing }>
                    <Text fontSize="16" lineHeight="24" cx={ css.vPadding } font="sans-semibold">
                        {title}
                    </Text>
                    { isGenerateDocSupported
                        && (
                            <Tooltip placement="auto" content="Toggle auto-generated docs">
                                <IconButton icon={ FlashIcon } onClick={ () => onChangeGenerateDoc(!generateDoc) } color={ generateDoc ? 'info' : undefined } />
                            </Tooltip>
                        )}
                    <FlexSpacer />
                    <Tooltip placement="auto" content={ canReset && 'Reset setting' }>
                        <IconButton
                            isDisabled={ !canReset }
                            icon={ ResetIcon }
                            onClick={ onReset }
                            color="info"
                        />
                    </Tooltip>
                </FlexRow>
                <FlexRow key="table-head" size="36" background="gray5" padding="12" spacing="6" borderBottom cx={ css.boxSizing }>
                    <FlexCell key="name" width={ 130 }>
                        <Text size="24" font="sans-semibold">
                            NAME
                        </Text>
                    </FlexCell>
                    <FlexCell key="default" width={ 100 }>
                        <Text size="24" font="sans-semibold">
                            DEFAULT
                        </Text>
                    </FlexCell>
                    <FlexCell key="examples" grow={ 1 }>
                        <Text size="24" font="sans-semibold">
                            PRESET
                        </Text>
                    </FlexCell>
                </FlexRow>
                <div className={ css.rowProps }>
                    <ScrollBars cx={ css.lastBorder }>{propDoc.map((i: any, index: number) => renderPropertyRow(i, index))}</ScrollBars>
                </div>
                <FlexRow key="code-head" size="36" padding="12" spacing="6" borderBottom={ showCode }>
                    <Switch label="View Code" value={ showCode } onValueChange={ onToggleShowCode } />
                    <FlexSpacer />
                    <Tooltip content="Copy code" placement="top">
                        <IconButton icon={ CopyIcon } onClick={ () => copyTextToClipboard(renderCode({ demoComponentProps, tagName }), showNotification) } />
                    </Tooltip>
                </FlexRow>
                {showCode && (
                    <FlexRow key="code" size="36" padding="12">
                        <pre className={ css.code }>{renderCode({ demoComponentProps, tagName })}</pre>
                    </FlexRow>
                )}
            </div>
            <div className={ css.demoContext }>
                <FlexRow key="head" size="36" padding="12" spacing="6" borderBottom background="white" cx={ css.contextSettingRow }>
                    <MultiSwitch
                        key="multi-switch"
                        items={ availableCtxNames.map((id) => ({ caption: id, id })) }
                        value={ selectedCtxName }
                        onValueChange={ onChangeSelectedCtx }
                        size="24"
                    />
                </FlexRow>
                <div className={ cx(css.demoContainer, currentTheme) }>
                    <ScrollBars>
                        <LocalErrorBoundary key={ `${generateDoc}_${title}` }>
                            <SelectedDemoContext DemoComponent={ DemoComponent } props={ demoComponentProps } />
                        </LocalErrorBoundary>
                    </ScrollBars>
                </div>
            </div>
        </div>
    );
}

function renderCode(params: Pick<IComponentEditorViewProps, 'demoComponentProps' | 'tagName'>) {
    const {
        demoComponentProps,
        tagName,
    } = params;
    const props: string[] = [];
    let children: string = null;
    Object.keys(demoComponentProps).forEach((name) => {
        const val = demoComponentProps[name];

        if (val) {
            if (name === 'children') {
                children = '{/* ' + (val.displayName || 'children') + ' */}';
            } else if (val === true) {
                props.push(name);
            } else if (typeof val === 'string') {
                props.push(`${name}="${val}"`);
            } else if (typeof val === 'number') {
                props.push(`${name}={${val}}`);
            } else if (val.displayName) {
                props.push(`${name}={${val.displayName}}`);
            } else if (typeof val === 'function') {
                props.push(`${name}={() => { /* code */ }`);
            } else if (name === 'dataSource') {
                props.push(`${name}={() => { /* code */ }`);
            } else {
                props.push(`${name}={${JSON.stringify(val)}}`);
            }
        }
    });

    let propsStr = props.join(' ');
    if (propsStr.length > 0) {
        propsStr = ' ' + propsStr;
    }
    if (propsStr.length > 80) {
        propsStr = '\n' + props.map((p) => '    ' + p).join('\n') + '\n';
    }

    if (children) {
        return `<${tagName}${propsStr}>${children}</${tagName}>`;
    } else {
        return `<${tagName}${propsStr}/>`;
    }
}

function showNotification() {
    svc.uuiNotifications.show(
        (props: INotification) => (
            <NotificationCard { ...props } icon={ NotificationIcon } color="gray60" onClose={ null }>
                <Text size="36" font="sans">
                    Code was copied to the clipboard
                </Text>
            </NotificationCard>
        ),
        { duration: 3 },
    ).catch(() => {});
}

type TLocalErrorBoundaryState = {
    isRenderBlocked: boolean;
    error?: Error
    errorInfo?: React.ErrorInfo
};
class LocalErrorBoundary extends React.Component<{ children: React.ReactNode }, TLocalErrorBoundaryState> {
    static displayName = 'LocalErrorBoundary';
    state: TLocalErrorBoundaryState = { isRenderBlocked: false };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
            isRenderBlocked: true,
        });
    }

    handleRetry = () => {
        this.setState({
            error: undefined,
            errorInfo: undefined,
            isRenderBlocked: false,
        });
    };

    render() {
        const { children } = this.props;
        const { isRenderBlocked, errorInfo } = this.state;
        if (isRenderBlocked) {
            return (
                <Panel>
                    <Text color="red">
                        {
                            errorInfo.componentStack
                        }
                    </Text>
                    <Button caption="Retry" onClick={ this.handleRetry } />
                </Panel>
            );
        }
        return children;
    }
}
