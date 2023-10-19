import { Type } from 'ts-morph';
import { TOneOfItemType, TPropEditor, TPropEditorType } from '../../types/sharedTypes';

export class PropEditorUtils {
    static getLiteralValueFromType(type: Type): TOneOfItemType | undefined {
        if (type.isLiteral()) {
            if (type.isBooleanLiteral()) {
                return type.getText() === 'true';
            }
            return type.getLiteralValue();
        }
    }

    static getPropEditorByType(type: Type): TPropEditor | undefined {
        const map = {
            [TPropEditorType.oneOf]: {
                condition: (t: Type) => t.isLiteral(),
                paramsBuilder: (t: Type): TOneOfItemType[] => {
                    return [PropEditorUtils.getLiteralValueFromType(t)];
                },
            },
            [TPropEditorType.string]: {
                condition: (t: Type) => t.isString(),
            },
            [TPropEditorType.number]: {
                condition: (t: Type) => t.isNumber(),
            },
            [TPropEditorType.bool]: {
                condition: (t: Type) => t.isBoolean(),
            },
            [TPropEditorType.component]: {
                condition: (t: Type) => {
                    const sign = t.getCallSignatures();
                    if (sign?.length === 1) {
                        const first = sign[0];
                        const returnTypeText = first.getReturnType().getText();
                        const returnsNode = returnTypeText.startsWith('React.ReactNode') || returnTypeText.startsWith('React.ReactElement');
                        const hasOneOrZeroParams = first.getParameters().length <= 2;
                        return returnsNode && hasOneOrZeroParams;
                    }
                    const text = t.getText();
                    const isReactFC = /^React\.FC<.+>$/.test(text);
                    return isReactFC;
                },
            },
            [TPropEditorType.func]: {
                condition: (t: Type) => {
                    const sign = t.getCallSignatures();
                    return sign?.length > 0;
                },
            },
        };
        const keys = Object.keys(map) as (keyof typeof map)[];
        const found = keys.find((key) => map[key].condition(type));
        if (found) {
            if (found === TPropEditorType.oneOf) {
                const args = map[found];
                return {
                    type: found,
                    options: args.paramsBuilder(type),
                };
            }
            return {
                type: found,
            };
        }
    }

    static getPropEditorByUnionType(unionType: Type): TPropEditor | undefined {
        const typeArr = unionType.getUnionTypes();
        let canBeNull = false;
        const arrNorm = typeArr.reduce((acc, ta) => {
            if (ta.isUndefined()) {
                return acc;
            } else if (ta.isNull()) {
                canBeNull = true;
                return acc;
            }
            acc.push(ta);
            return acc;
        }, []);

        if (arrNorm.length > 0) {
            const isAllLiterals = arrNorm.every((t) => t.isLiteral());
            if (isAllLiterals) {
                if (arrNorm.length === 2 && arrNorm[0].isBooleanLiteral() && arrNorm[1].isBooleanLiteral()) {
                    return {
                        type: TPropEditorType.bool,
                    };
                }
                const options = arrNorm.map((t) => {
                    return PropEditorUtils.getLiteralValueFromType(t);
                });
                if (canBeNull) {
                    options.push(null);
                }
                return {
                    type: TPropEditorType.oneOf,
                    options,
                };
            } else if (arrNorm.length === 1) {
                return PropEditorUtils.getPropEditorByType(arrNorm[0]);
            }
        }
    }
}
