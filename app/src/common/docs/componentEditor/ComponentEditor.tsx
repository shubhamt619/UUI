import * as React from 'react';
import { IHasCX } from '@epam/uui-core';
import { IComponentDocs, IPropSamplesCreationContext, PropDoc, PropExample } from '@epam/uui-docs';
import { FlexRow, Panel } from '@epam/promo';
import { svc } from '../../../services';
import { ComponentEditorView } from './ComponentEditorView';
import { TSkin } from '../docBuilderGen/types';

interface ComponentEditorProps extends IHasCX {
    docs?: IComponentDocs<any>;
    skin: TSkin;
    title: string;
    generateDoc: boolean;
    isGenerateDocSupported: boolean;
    onChangeGenerateDoc: (b: boolean) => void;
}

interface ComponentEditorState {
    showCode: boolean;
    isInited: boolean;
    selectedContext?: string;
    selectedPropsIds: { [name: string]: string };
    inputValues: { [name: string]: string };
    componentKey?: string;
}

export class ComponentEditor extends React.Component<ComponentEditorProps, ComponentEditorState> {
    propSamplesCreationContext = new PropSamplesCreationContext(this);
    initialProps: any;

    constructor(props: ComponentEditorProps) {
        super(props);

        this.state = {
            showCode: false,
            selectedPropsIds: {},
            inputValues: {},
            componentKey: undefined,
            isInited: false,
        };
    }

    componentDidMount() {
        this.initProps();
    }

    componentDidUpdate(prevProps:Readonly<ComponentEditorProps>) {
        if (prevProps.docs !== this.props.docs) {
            this.initProps();
        }
    }

    handleResetDocs = (onAfterReset?: () => void) => {
        this.initialProps = undefined;
        this.setState(() => {
            return {
                showCode: false,
                isInited: false,
                selectedPropsIds: {},
                inputValues: {},
                componentKey: undefined,
            };
        }, onAfterReset);
    };

    initProps() {
        const { docs } = this.props;
        this.handleResetDocs(() => {
            if (docs) {
                const selectedPropsIds: ComponentEditorState['selectedPropsIds'] = {};
                const inputValues: ComponentEditorState['inputValues'] = {};
                docs.props.forEach((prop) => {
                    const defaultExample = this.getPropExampleByPropValue(prop);
                    if (defaultExample) {
                        selectedPropsIds[prop.name] = defaultExample.id;
                    }

                    inputValues[prop.name] = defaultExample?.value;
                });
                this.initialProps = selectedPropsIds;
                this.setState({ selectedPropsIds, inputValues, isInited: true });
            }
        });
    }

    getPropExamples = (prop: PropDoc<any, any>) => {
        const { examples } = prop;
        let ex;
        if (typeof examples === 'function') {
            ex = examples(this.propSamplesCreationContext);
        } else if (examples.length) {
            ex = examples;
        }
        return ex;
    };

    getPropExampleByPropValue = (prop: PropDoc<any, any>, propValue?: any): PropExample<any> => {
        const propExamples = this.getPropExamples(prop);
        let exampleResolved;
        if (typeof propValue !== 'undefined') {
            exampleResolved = propExamples.find((i) => i.value === propValue);
        } else {
            exampleResolved = propExamples.find((i) => i.isDefault);
            if (!exampleResolved && prop.isRequired) {
                exampleResolved = propExamples[0];
            }
        }

        return exampleResolved;
    };

    getProps() {
        const { selectedPropsIds, inputValues, componentKey: key } = this.state;
        const props: { [name: string]: any } = {
            ...inputValues,
            key,
        };

        Object.keys(selectedPropsIds).forEach((propName: string) => {
            const exampleId = selectedPropsIds[propName];
            const propValue = inputValues[propName];
            const docComponent = this.props.docs.props.find((doc) => doc.name === propName);
            if (typeof propValue !== 'undefined') {
                props[propName] = propValue;
            } else if (docComponent) {
                if (typeof exampleId !== 'undefined') {
                    const propExamples = this.getPropExamples(docComponent);
                    props[propName] = propExamples.find((e) => e.id === exampleId).value;
                } else {
                    const selectedExample = this.getPropExampleByPropValue(docComponent);
                    if (selectedExample) {
                        props[propName] = selectedExample.value;
                    }
                }
            }
        });

        return props;
    }

    getSelectedDemoContext() {
        const { selectedContext } = this.state;
        const { docs } = this.props;
        if (docs) {
            const defaultContext = docs.contexts[0];
            if (!selectedContext) {
                return defaultContext.context;
            } else {
                return docs.contexts.filter((ctx) => ctx.name === selectedContext)[0].context;
            }
        }
    }

    handleChangeValueOfPropertyValue = (newValue: any) => {
        const propertyName = 'value';
        const prop = this.props.docs.props.find((p) => p.name === propertyName);
        const selectedExample = this.getPropExampleByPropValue(prop, newValue);

        this.setState((prev) => {
            return {
                inputValues: { ...prev.inputValues, [propertyName]: newValue },
                selectedPropsIds: { ...prev.selectedPropsIds, [propertyName]: selectedExample?.id },
            };
        });
    };

    handleResetProp = (name: string) => this.setState((prev) => ({
        selectedPropsIds: {
            ...prev.selectedPropsIds,
            [name]: undefined,
        },
        inputValues: {
            ...prev.inputValues,
            [name]: undefined,
        },
    }));

    handleReset = () => {
        this.setState(() => {
            return {
                selectedPropsIds: { ...this.initialProps },
                selectedContext: this.props.docs?.contexts[0].name,
            };
        }, () => {
            this.initProps();
        });
    };

    handlePropExampleChange = (params: { propName: string, exampleId: string, propValue?: string, remountOnChange: boolean }) => {
        const {
            propName,
            exampleId,
            propValue,
            remountOnChange,
        } = params;

        const newStateValues: ComponentEditorState = {
            ...this.state,
            selectedPropsIds: { ...this.state.selectedPropsIds, [propName]: exampleId },
            inputValues: { ...this.state.inputValues, [propName]: propValue },
        };

        if (remountOnChange) {
            newStateValues.componentKey = new Date().getTime().toString();
        }

        this.setState(newStateValues);
    };

    handleChangeContext = (selectedContext: string) => {
        this.setState({ selectedContext });
    };

    handleToggleShowCode = () => this.setState((prev) => {
        return { showCode: !prev.showCode };
    });

    render() {
        const { title, cx: propsCx, skin, generateDoc, onChangeGenerateDoc, isGenerateDocSupported, docs } = this.props;
        if (!docs) {
            return null;
        }
        const { showCode, selectedPropsIds, selectedContext, inputValues, isInited } = this.state;
        const currentTheme = getTheme(skin);
        const selectedDemoCtx = this.getSelectedDemoContext();
        const { component: DemoComponent, name: tagName, contexts, props } = docs || {};
        const availableCtxNames = contexts?.map((i) => i.name) || [];
        const selectedCtxName = selectedContext || contexts?.length > 0 ? contexts[0].name : undefined;
        const canReset = Object.keys(selectedPropsIds).length > 0;
        const demoComponentProps = this.getProps();

        if (!isInited) {
            return null;
        }

        return (
            <ComponentEditorView
                isInited={ isInited }
                isGenerateDocSupported={ isGenerateDocSupported }
                generateDoc={ generateDoc }
                onChangeGenerateDoc={ onChangeGenerateDoc }
                availableCtxNames={ availableCtxNames }
                canReset={ canReset }
                currentTheme={ currentTheme }
                DemoComponent={ DemoComponent }
                demoComponentProps={ demoComponentProps }
                propDoc={ props }
                propsCx={ propsCx }
                selectedCtxName={ selectedCtxName }
                SelectedDemoContext={ selectedDemoCtx }
                showCode={ showCode }
                tagName={ tagName }
                title={ title }
                onChangeSelectedCtx={ this.handleChangeContext }
                onGetPropExampleId={ (name: string) => selectedPropsIds[name] }
                onGetPropValue={ (name: string) => inputValues[name] }
                onPropExampleChange={ this.handlePropExampleChange }
                onReset={ this.handleReset }
                onResetProp={ this.handleResetProp }
                onToggleShowCode={ this.handleToggleShowCode }
                propSamplesCreationContext={ this.propSamplesCreationContext }
            />
        );
    }
}

class PropSamplesCreationContext implements IPropSamplesCreationContext<any> {
    constructor(
        private reactClassComponent: {
            forceUpdate: () => void;
            getProps: () => { [p: string]: any },
            handleChangeValueOfPropertyValue: (newValue: string) => void
        },
    ) {
    }

    getCallback = (name: string) => {
        return function Callback(...args: any[]) {
            svc.uuiNotifications
                .show(
                    () => (
                        <Panel background="white" shadow={ true }>
                            <FlexRow padding="12" borderBottom={ true }>
                                <pre>
                                    {name}
                                    (
                                    {args.length}
                                    {' '}
                                    args)
                                </pre>
                            </FlexRow>
                        </Panel>
                    ),
                    { position: 'bot-right' },
                )
                .catch(() => null);
            // eslint-disable-next-line no-console
            console.log(`${name} (`, args, ')');
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getChangeHandler = (_propName: string) => {
        return (newValue: string) => {
            this.reactClassComponent.handleChangeValueOfPropertyValue(newValue);
        };
    };

    getSelectedProps = () => this.reactClassComponent.getProps();

    forceUpdate = () => {
        this.reactClassComponent.forceUpdate();
    };

    demoApi = svc.api.demo;
}

function getTheme(skin: TSkin) {
    switch (skin) {
        case TSkin.UUI:
            return 'uui-theme-vanilla_thunder';
        case TSkin.UUI4_promo:
            return 'uui-theme-promo';
        case TSkin.UUI3_loveship:
            return 'uui-theme-loveship';
        default:
            return '';
    }
}
