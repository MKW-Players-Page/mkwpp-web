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

import * as runtime from "../runtime";
import type { Auth, User, VerificationToken } from "../models/index";
import {
  AuthFromJSON,
  AuthToJSON,
  UserFromJSON,
  UserToJSON,
  VerificationTokenFromJSON,
  VerificationTokenToJSON,
} from "../models/index";

export interface CoreLoginCreateRequest {
  auth: Omit<Auth, "token" | "expiry">;
}

export interface CoreSignupCreateRequest {
  user: Omit<User, "player">;
}

export interface CoreVerifyCreateRequest {
  verificationToken: VerificationToken;
}

/**
 *
 */
export class CoreApi extends runtime.BaseAPI {
  /**
   */
  async coreLoginCreateRaw(
    requestParameters: CoreLoginCreateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Auth>> {
    if (requestParameters["auth"] == null) {
      throw new runtime.RequiredError(
        "auth",
        'Required parameter "auth" was null or undefined when calling coreLoginCreate().',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    const response = await this.request(
      {
        path: `/api/core/login/`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: AuthToJSON(requestParameters["auth"]),
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      AuthFromJSON(jsonValue),
    );
  }

  /**
   */
  async coreLoginCreate(
    requestParameters: CoreLoginCreateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Auth> {
    const response = await this.coreLoginCreateRaw(
      requestParameters,
      initOverrides,
    );
    return await response.value();
  }

  /**
   */
  async coreLogoutCreateRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        await this.configuration.apiKey("Authorization"); // knoxApiToken authentication
    }

    const response = await this.request(
      {
        path: `/api/core/logout/`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   */
  async coreLogoutCreate(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.coreLogoutCreateRaw(initOverrides);
  }

  /**
   */
  async coreSignupCreateRaw(
    requestParameters: CoreSignupCreateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    if (requestParameters["user"] == null) {
      throw new runtime.RequiredError(
        "user",
        'Required parameter "user" was null or undefined when calling coreSignupCreate().',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    const response = await this.request(
      {
        path: `/api/core/signup/`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: UserToJSON(requestParameters["user"]),
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   */
  async coreSignupCreate(
    requestParameters: CoreSignupCreateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.coreSignupCreateRaw(requestParameters, initOverrides);
  }

  /**
   */
  async coreUserRetrieveRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<User>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters["Authorization"] =
        await this.configuration.apiKey("Authorization"); // knoxApiToken authentication
    }

    const response = await this.request(
      {
        path: `/api/core/user/`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserFromJSON(jsonValue),
    );
  }

  /**
   */
  async coreUserRetrieve(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<User> {
    const response = await this.coreUserRetrieveRaw(initOverrides);
    return await response.value();
  }

  /**
   */
  async coreVerifyCreateRaw(
    requestParameters: CoreVerifyCreateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    if (requestParameters["verificationToken"] == null) {
      throw new runtime.RequiredError(
        "verificationToken",
        'Required parameter "verificationToken" was null or undefined when calling coreVerifyCreate().',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    const response = await this.request(
      {
        path: `/api/core/verify/`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: VerificationTokenToJSON(requestParameters["verificationToken"]),
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   */
  async coreVerifyCreate(
    requestParameters: CoreVerifyCreateRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.coreVerifyCreateRaw(requestParameters, initOverrides);
  }
}
