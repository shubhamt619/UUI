import { PropDoc, IPropSamplesCreationContext } from '@epam/uui-docs';
import { ArrayDataSource } from '@epam/uui-core';
import { FlexCell, IconButton, PickerInput, RadioInput, TextInput } from '@epam/uui';
import { MultiSwitch, Tooltip } from '@epam/promo';
import * as React from 'react';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-help-fill-18.svg';

interface IPropEditor {
    prop: PropDoc<any, any>;
    onGetPropExampleId: (name: string) => string;
    onGetPropValue: (propName: string) => any;
    onPropExampleChange: (props: { propName: string, exampleId: string, propValue?: string, remountOnChange: boolean }) => void;
    propSamplesCreationContext: IPropSamplesCreationContext;
}
export function PropEditor(props: IPropEditor): React.ReactElement {
    const { prop, propSamplesCreationContext, onPropExampleChange, onGetPropExampleId, onGetPropValue } = props;
    const { remountOnChange, name, description, examples, type, renderEditor } = prop;

    const _onPropExampleChange = (exampleId: string, propValue?: string) => {
        let exampleIdEffective = exampleId;
        if (!propExamplesList.find(({ id }) => id === exampleIdEffective)) {
            const found = propExamplesList.find((e) => {
                return e.value === exampleIdEffective;
            });
            if (found) {
                exampleIdEffective = found.id;
            } else {
                exampleIdEffective = undefined;
            }
        }
        onPropExampleChange({ propName: prop.name, exampleId: exampleIdEffective, propValue, remountOnChange });
    };

    const propExamplesList = (() => {
        if (typeof examples === 'function') {
            return examples(propSamplesCreationContext);
        } else if (examples.length) {
            return examples;
        }
    })();

    const propValue = onGetPropValue(name);

    const items = propExamplesList.map((example) => ({
        caption: example.name,
        id: example.id,
    }));

    const getPropsDataSource = (exampleItems: any[] | any) => new ArrayDataSource({ items: exampleItems, getId: (i) => i.id });

    const selectedExampleId = onGetPropExampleId(name);
    const descriptionElement = description ? (
        <Tooltip placement="top" content={ description }>
            <IconButton icon={ InfoIcon } color="default" />
        </Tooltip>
    ) : null;

    if (renderEditor) {
        return renderEditor(
            {
                value: selectedExampleId,
                onValueChange: _onPropExampleChange,
            },
            propExamplesList && propExamplesList.map((ex) => ex.value),
        ) as React.ReactElement;
    } else if (propExamplesList.length > 1) {
        if (type === 'string') {
            return (
                <>
                    <FlexCell minWidth={ 150 }>
                        <PickerInput
                            size="24"
                            dataSource={ getPropsDataSource(propExamplesList) }
                            selectionMode="single"
                            value={ propExamplesList.find((i) => i.value === propValue)?.id }
                            onValueChange={ (inputValue) => _onPropExampleChange(inputValue, propExamplesList[Number(inputValue)]?.value) }
                            valueType="id"
                            entityName={ name }
                            placeholder={ propValue }
                        />
                    </FlexCell>
                    <FlexCell minWidth={ 150 }>
                        <TextInput
                            onCancel={ () => _onPropExampleChange('', '') }
                            size="24"
                            onValueChange={ (inputValue) => _onPropExampleChange(undefined, inputValue) }
                            value={ propValue }
                        />
                    </FlexCell>
                    {descriptionElement}
                </>
            );
        } else {
            return (
                <React.Fragment>
                    <MultiSwitch
                        items={ items }
                        onValueChange={ (id) => _onPropExampleChange(id, propExamplesList.find((li) => li.id === id).value) }
                        value={ selectedExampleId }
                        size="24"
                        rawProps={ { style: { flexWrap: 'wrap' } } }
                    />
                    {descriptionElement}
                </React.Fragment>
            );
        }
    } else if (propExamplesList.length === 1) {
        return (
            <React.Fragment>
                <RadioInput
                    value={ !!selectedExampleId }
                    onValueChange={ () => _onPropExampleChange(propExamplesList[0].id, propExamplesList[0].value) }
                    size="18"
                    label={ propExamplesList[0].name }
                />
                {descriptionElement}
            </React.Fragment>
        );
    } else {
        return null;
    }
}
