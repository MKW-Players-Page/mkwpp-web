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


import * as runtime from '../runtime';
import type {
  Auth,
  User,
} from '../models/index';
import {
    AuthFromJSON,
    AuthToJSON,
    UserFromJSON,
    UserToJSON,
} from '../models/index';

export interface CreateUserRequest {
    user: Omit<User, 'player'>;
}

export interface LoginRequest {
    auth: Omit<Auth, 'token'|'expiry'>;
}

/**
 * 
 */
export class CoreApi extends runtime.BaseAPI {

    /**
     */
    async createUserRaw(requestParameters: CreateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters['user'] == null) {
            throw new runtime.RequiredError(
                'user',
                'Required parameter "user" was null or undefined when calling createUser().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/core/signup/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserToJSON(requestParameters['user']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async createUser(requestParameters: CreateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.createUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async currentUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // knoxApiToken authentication
        }

        const response = await this.request({
            path: `/api/core/user/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async currentUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.currentUserRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async loginRaw(requestParameters: LoginRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Auth>> {
        if (requestParameters['auth'] == null) {
            throw new runtime.RequiredError(
                'auth',
                'Required parameter "auth" was null or undefined when calling login().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/core/login/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: AuthToJSON(requestParameters['auth']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => AuthFromJSON(jsonValue));
    }

    /**
     */
    async login(requestParameters: LoginRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Auth> {
        const response = await this.loginRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async logoutRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // knoxApiToken authentication
        }

        const response = await this.request({
            path: `/api/core/logout/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async logout(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.logoutRaw(initOverrides);
    }

}
