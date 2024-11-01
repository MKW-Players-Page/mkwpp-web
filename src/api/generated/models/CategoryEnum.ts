/* tslint:disable */
/* eslint-disable */
/**
 * Mario Kart Wii Players\' Page API
 * The brains of the Mario Kart Wii Players\' Page.
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * * `nonsc` - nonsc
 * * `sc` - sc
 * * `unres` - unres
 * @export
 */
export const CategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type CategoryEnum = typeof CategoryEnum[keyof typeof CategoryEnum];


export function instanceOfCategoryEnum(value: any): boolean {
    for (const key in CategoryEnum) {
        if (Object.prototype.hasOwnProperty.call(CategoryEnum, key)) {
            if (CategoryEnum[key as keyof typeof CategoryEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function CategoryEnumFromJSON(json: any): CategoryEnum {
    return CategoryEnumFromJSONTyped(json, false);
}

export function CategoryEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): CategoryEnum {
    return json as CategoryEnum;
}

export function CategoryEnumToJSON(value?: CategoryEnum | null): any {
    return value as any;
}

