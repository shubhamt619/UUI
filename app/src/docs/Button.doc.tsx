import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TSkin } from '../common';
import * as uui from '@epam/uui';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';

export class ButtonDoc extends BaseDocsBlock {
    title = 'Button';

    override config: TDocConfig = {
        name: 'Button',
        type: '@epam/uui:ButtonProps',
        component: uui.Button,
        doc: (doc: DocBuilder<uui.ButtonProps>) => {
            doc
                .propMerge('size', { defaultValue: '36' })
                .propMerge('mode', { defaultValue: 'solid' })
                .propMerge('iconPosition', { defaultValue: 'left' });
        },
    };

    getPropsDocPath() {
        return {
            [TSkin.UUI3_loveship]: './app/src/docs/_props/loveship/components/buttons/button.props.tsx',
            [TSkin.UUI4_promo]: './app/src/docs/_props/epam-promo/components/buttons/button.props.tsx',
            [TSkin.UUI]: './app/src/docs/_props/uui/components/buttons/button.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="button-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/button/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/button/Size.example.tsx" />
                <DocExample title="Styles" path="./_examples/button/Styling.example.tsx" />
                <DocExample title="Button with Icon" path="./_examples/button/Icon.example.tsx" />
                <DocExample title="Button with link" path="./_examples/button/Link.example.tsx" />
                <DocExample title="Button as a Toggler" path="./_examples/button/Toggler.example.tsx" />
            </>
        );
    }
}
