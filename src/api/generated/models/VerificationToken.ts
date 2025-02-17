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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface VerificationToken
 */
export interface VerificationToken {
    /**
     * 
     * @type {string}
     * @memberof VerificationToken
     */
    token: string;
}

/**
 * Check if a given object implements the VerificationToken interface.
 */
export function instanceOfVerificationToken(value: object): value is VerificationToken {
    if (!('token' in value) || value['token'] === undefined) return false;
    return true;
}

export function VerificationTokenFromJSON(json: any): VerificationToken {
    return VerificationTokenFromJSONTyped(json, false);
}

export function VerificationTokenFromJSONTyped(json: any, ignoreDiscriminator: boolean): VerificationToken {
    if (json == null) {
        return json;
    }
    return {
        
        'token': json['token'],
    };
}

export function VerificationTokenToJSON(value?: VerificationToken | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'token': value['token'],
    };
}

