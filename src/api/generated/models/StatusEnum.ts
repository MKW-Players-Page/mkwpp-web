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
 * * `pending` - pending
 * * `accepted` - accepted
 * * `rejected` - rejected
 * * `on_hold` - on_hold
 * @export
 */
export const StatusEnum = {
    Pending: 'pending',
    Accepted: 'accepted',
    Rejected: 'rejected',
    OnHold: 'on_hold'
} as const;
export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];


export function instanceOfStatusEnum(value: any): boolean {
    for (const key in StatusEnum) {
        if (Object.prototype.hasOwnProperty.call(StatusEnum, key)) {
            if (StatusEnum[key as keyof typeof StatusEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function StatusEnumFromJSON(json: any): StatusEnum {
    return StatusEnumFromJSONTyped(json, false);
}

export function StatusEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): StatusEnum {
    return json as StatusEnum;
}

export function StatusEnumToJSON(value?: StatusEnum | null): any {
    return value as any;
}

