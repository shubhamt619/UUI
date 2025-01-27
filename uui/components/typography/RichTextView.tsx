import style from './RichTextView.module.scss';
import * as uuiComponents from '@epam/uui-components';
import { withMods } from '@epam/uui-core';

export interface RichTextViewMods {
    size?: '12' | '14' | '16';
}

export type RichTextViewProps = uuiComponents.RichTextViewProps & RichTextViewMods;

export const RichTextView = withMods<uuiComponents.RichTextViewProps, RichTextViewMods>(
    uuiComponents.RichTextView,
    (mods: RichTextViewMods) => [style.typographyUui, style['typography-' + (mods.size || '14')]],
);
