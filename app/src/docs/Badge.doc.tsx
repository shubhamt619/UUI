import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3, UUI,
} from '../common';
import { TDocConfig } from '../common/docs/docBuilderGen/types';
import { DocBuilder } from '@epam/uui-docs';
import * as uui from '@epam/uui';

export class BadgeDoc extends BaseDocsBlock {
    title = 'Badge';

    override config: TDocConfig = {
        name: 'Button',
        type: '@epam/uui:BadgeProps',
        component: uui.Badge,
        doc: (doc: DocBuilder<uui.BadgeProps>) => {
            doc
                .propMerge('size', { defaultValue: '36' })
                .propMerge('fill', { defaultValue: 'solid' })
                .propMerge('iconPosition', { defaultValue: 'left' });
        },
    };

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/badge.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/badge.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/badge.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="badge-descriptions" />
                {this.renderSectionTitle('Overview')}
                <DocExample title="Types" path="./_examples/badge/Types.example.tsx" />
                <DocExample title="Color variants" path="./_examples/badge/Colors.example.tsx" />
                <DocExample title="Styles" path="./_examples/badge/Styles.example.tsx" />
                <DocExample title="Sizes" path="./_examples/badge/Size.example.tsx" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Attributes" path="./_examples/badge/Attributes.example.tsx" />
                <DocExample title="Dropdown" path="./_examples/badge/Dropdown.example.tsx" />
                <DocExample title="Indicator mode" path="./_examples/badge/Indicator.example.tsx" />
            </>
        );
    }
}
