import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, TSkin,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { Dropdown } from '@epam/uui-components';
import { DropdownProps } from '@epam/uui-core';
import * as loveship from '@epam/loveship';
import { DocBuilder } from '@epam/uui-docs';
import * as promo from '@epam/promo';

export class DropdownDoc extends BaseDocsBlock {
    title = 'Dropdown';

    override config: TDocConfig = {
        name: 'Dropdown',
        bySkin: {
            [TSkin.UUI3_loveship]: {
                type: '@epam/uui-core:DropdownProps',
                component: Dropdown,
                doc: (db: DocBuilder<DropdownProps>) => {
                    db.prop('renderBody', {
                        isRequired: true,
                        examples: [
                            {
                                value: (props) => (
                                    <loveship.DropdownMenuBody { ...props }>
                                        <loveship.DropdownMenuHeader caption="Tools" />
                                        <loveship.DropdownMenuButton caption="Button111" />
                                        <loveship.DropdownMenuButton caption="Button2" />
                                        <loveship.DropdownMenuButton caption="Button3232" />
                                        <loveship.DropdownMenuSplitter />
                                        <loveship.DropdownMenuButton caption="Button2" />
                                        <loveship.DropdownMenuButton caption="Button323442" />
                                    </loveship.DropdownMenuBody>
                                ),
                                isDefault: true,
                            },
                        ],
                    })
                        .prop('renderTarget', {
                            isRequired: true,
                            examples: [
                                {
                                    value: (props) => <loveship.Button caption="Target" { ...props } />,
                                    isDefault: true,
                                },
                            ],
                        });
                },
            },
            [TSkin.UUI4_promo]: {
                type: '@epam/uui-core:DropdownProps',
                component: Dropdown,
                doc: (db: DocBuilder<DropdownProps>) => {
                    db.prop('renderBody', {
                        isRequired: true,
                        examples: [
                            {
                                value: () => {
                                    return (
                                        <promo.Panel background="white" shadow={ true }>
                                            <promo.FlexRow padding="12" vPadding="12">
                                                <promo.Text>Dropdown body content. You can use any components as a dropdown body.</promo.Text>
                                            </promo.FlexRow>
                                        </promo.Panel>
                                    );
                                },
                                isDefault: true,
                            },
                        ],
                    })
                        .prop('renderTarget', {
                            isRequired: true,
                            examples: [
                                {
                                    value: (props) => <promo.Button caption="Target" { ...props } />,
                                    isDefault: true,
                                },
                            ],
                        });
                },
            },
        },

    };

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/dropdown.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/dropdown.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dropdown-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/dropdown/Basic.example.tsx" />

                <DocExample title="Dropdown Open/Close modifiers" path="./_examples/dropdown/CloseOpenModifiers.example.tsx" />

                <DocExample title="Set delay for dropdown body opening or closing" path="./_examples/dropdown/DelayForOpenAndClose.example.tsx" />

                <DocExample title="Handle dropdown state by yourself" path="./_examples/dropdown/HandleStateByYourself.example.tsx" />

                <DocExample title="Close dropdown from body" path="./_examples/dropdown/CloseFromBody.example.tsx" />
            </>
        );
    }
}
