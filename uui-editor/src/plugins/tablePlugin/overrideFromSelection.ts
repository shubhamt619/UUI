import {
    isRangeAcrossBlocks,
    isRangeInSameBlock,
    PlateEditor,
    TRange,
    Value,
} from '@udecode/plate-common';
import { getCellTypes, keyShiftEdges, moveSelectionFromCell } from '@udecode/plate-table';
import isHotkey from 'is-hotkey';

/**
   * Override the new selection if the previous selection and the new one are in different cells.
   */
export const overrideSelectionFromCell = <V extends Value = Value>(
    editor: PlateEditor<V>,
    newSelection?: TRange | null,
) => {
    let hotkey: string | undefined;

    // console.log('overrideFromSelection 0');

    if (
        !editor.currentKeyboardEvent
        || !['up', 'down', 'shift+up', 'shift+right', 'shift+down', 'shift+left'].some(
            (key) => {
                const valid = isHotkey(key, editor.currentKeyboardEvent!);
                if (valid) hotkey = key;
                return valid;
            },
        )
            || !editor.selection?.focus
            || !newSelection?.focus
            || !isRangeAcrossBlocks(editor, {
                at: {
                    anchor: editor.selection.focus,
                    focus: newSelection.focus,
                },
                match: { type: getCellTypes(editor) },
            })
    ) {
        // console.log('overrideFromSelection 1');
        return;
    }

    if (!hotkey) return;

    // console.log('overrideFromSelection 2');

    const edge = (keyShiftEdges as any)[hotkey];

    // if the previous selection was in many cells, return
    if (
        edge
        && !isRangeInSameBlock(editor, {
            at: editor.selection,
            match: { type: getCellTypes(editor) },
        })
    ) {
        // console.log('overrideFromSelection 3');
        return;
    }

    const prevSelection = editor.selection;
    const reverse = ['up', 'shift+up'].includes(hotkey);

    // console.log('overrideFromSelection');

    setTimeout(() => {
        moveSelectionFromCell(editor, {
            at: prevSelection,
            reverse,
            edge,
            fromOneCell: true,
        });
    }, 0);
};
