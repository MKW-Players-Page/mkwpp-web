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
  Player,
  PlayerBasic,
  PlayerMatchup,
  PlayerStats,
  Region,
  RegionStats,
  Score,
  ScoreSubmission,
  ScoreWithPlayer,
  StandardLevel,
  Track,
  TrackCup,
} from '../models/index';
import {
    PlayerFromJSON,
    PlayerToJSON,
    PlayerBasicFromJSON,
    PlayerBasicToJSON,
    PlayerMatchupFromJSON,
    PlayerMatchupToJSON,
    PlayerStatsFromJSON,
    PlayerStatsToJSON,
    RegionFromJSON,
    RegionToJSON,
    RegionStatsFromJSON,
    RegionStatsToJSON,
    ScoreFromJSON,
    ScoreToJSON,
    ScoreSubmissionFromJSON,
    ScoreSubmissionToJSON,
    ScoreWithPlayerFromJSON,
    ScoreWithPlayerToJSON,
    StandardLevelFromJSON,
    StandardLevelToJSON,
    TrackFromJSON,
    TrackToJSON,
    TrackCupFromJSON,
    TrackCupToJSON,
} from '../models/index';

export interface TimetrialsMatchupsRetrieveRequest {
    category: TimetrialsMatchupsRetrieveCategoryEnum;
    lapMode: TimetrialsMatchupsRetrieveLapModeEnum;
    pk1: number;
    pk2: number;
}

export interface TimetrialsPlayersRetrieveRequest {
    id: number;
}

export interface TimetrialsPlayersScoresListRequest {
    category: TimetrialsPlayersScoresListCategoryEnum;
    id: number;
    lapMode?: TimetrialsPlayersScoresListLapModeEnum;
    region?: number;
}

export interface TimetrialsPlayersStatsRetrieveRequest {
    category: TimetrialsPlayersStatsRetrieveCategoryEnum;
    id: number;
    lapMode: TimetrialsPlayersStatsRetrieveLapModeEnum;
    region: number;
}

export interface TimetrialsRankingsListRequest {
    category: TimetrialsRankingsListCategoryEnum;
    lapMode: TimetrialsRankingsListLapModeEnum;
    metric: TimetrialsRankingsListMetricEnum;
    region: number;
}

export interface TimetrialsRecordsListRequest {
    category: TimetrialsRecordsListCategoryEnum;
    lapMode?: TimetrialsRecordsListLapModeEnum;
    region?: number;
}

export interface TimetrialsRegionsRankingsListRequest {
    category: TimetrialsRegionsRankingsListCategoryEnum;
    lapMode: TimetrialsRegionsRankingsListLapModeEnum;
    top: TimetrialsRegionsRankingsListTopEnum;
    type: TimetrialsRegionsRankingsListTypeEnum;
}

export interface TimetrialsStandardsListRequest {
    isLegacy?: boolean;
}

export interface TimetrialsSubmissionsCreateCreateRequest {
    scoreSubmission: Omit<ScoreSubmission, 'id'|'player'|'status'|'time_submitted'|'time_reviewed'|'reviewed_by'>;
}

export interface TimetrialsTracksScoresListRequest {
    category: TimetrialsTracksScoresListCategoryEnum;
    id: number;
    lapMode: TimetrialsTracksScoresListLapModeEnum;
    region?: number;
}

export interface TimetrialsTracksTopsListRequest {
    category: TimetrialsTracksTopsListCategoryEnum;
    id: number;
    lapMode: TimetrialsTracksTopsListLapModeEnum;
    region?: number;
}

/**
 * 
 */
export class TimetrialsApi extends runtime.BaseAPI {

    /**
     */
    async timetrialsCupsListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<TrackCup>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/cups/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TrackCupFromJSON));
    }

    /**
     */
    async timetrialsCupsList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<TrackCup>> {
        const response = await this.timetrialsCupsListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsMatchupsRetrieveRaw(requestParameters: TimetrialsMatchupsRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlayerMatchup>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsMatchupsRetrieve().'
            );
        }

        if (requestParameters['lapMode'] == null) {
            throw new runtime.RequiredError(
                'lapMode',
                'Required parameter "lapMode" was null or undefined when calling timetrialsMatchupsRetrieve().'
            );
        }

        if (requestParameters['pk1'] == null) {
            throw new runtime.RequiredError(
                'pk1',
                'Required parameter "pk1" was null or undefined when calling timetrialsMatchupsRetrieve().'
            );
        }

        if (requestParameters['pk2'] == null) {
            throw new runtime.RequiredError(
                'pk2',
                'Required parameter "pk2" was null or undefined when calling timetrialsMatchupsRetrieve().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/matchups/{pk1}/{pk2}/`.replace(`{${"pk1"}}`, encodeURIComponent(String(requestParameters['pk1']))).replace(`{${"pk2"}}`, encodeURIComponent(String(requestParameters['pk2']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PlayerMatchupFromJSON(jsonValue));
    }

    /**
     */
    async timetrialsMatchupsRetrieve(requestParameters: TimetrialsMatchupsRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlayerMatchup> {
        const response = await this.timetrialsMatchupsRetrieveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsPlayersListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<PlayerBasic>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/players/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PlayerBasicFromJSON));
    }

    /**
     */
    async timetrialsPlayersList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<PlayerBasic>> {
        const response = await this.timetrialsPlayersListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsPlayersRetrieveRaw(requestParameters: TimetrialsPlayersRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Player>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling timetrialsPlayersRetrieve().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/players/{id}/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PlayerFromJSON(jsonValue));
    }

    /**
     */
    async timetrialsPlayersRetrieve(requestParameters: TimetrialsPlayersRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Player> {
        const response = await this.timetrialsPlayersRetrieveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsPlayersScoresListRaw(requestParameters: TimetrialsPlayersScoresListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Score>>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsPlayersScoresList().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling timetrialsPlayersScoresList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['region'] != null) {
            queryParameters['region'] = requestParameters['region'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/players/{id}/scores/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ScoreFromJSON));
    }

    /**
     */
    async timetrialsPlayersScoresList(requestParameters: TimetrialsPlayersScoresListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Score>> {
        const response = await this.timetrialsPlayersScoresListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsPlayersStatsRetrieveRaw(requestParameters: TimetrialsPlayersStatsRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PlayerStats>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsPlayersStatsRetrieve().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling timetrialsPlayersStatsRetrieve().'
            );
        }

        if (requestParameters['lapMode'] == null) {
            throw new runtime.RequiredError(
                'lapMode',
                'Required parameter "lapMode" was null or undefined when calling timetrialsPlayersStatsRetrieve().'
            );
        }

        if (requestParameters['region'] == null) {
            throw new runtime.RequiredError(
                'region',
                'Required parameter "region" was null or undefined when calling timetrialsPlayersStatsRetrieve().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['region'] != null) {
            queryParameters['region'] = requestParameters['region'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/players/{id}/stats/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PlayerStatsFromJSON(jsonValue));
    }

    /**
     */
    async timetrialsPlayersStatsRetrieve(requestParameters: TimetrialsPlayersStatsRetrieveRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PlayerStats> {
        const response = await this.timetrialsPlayersStatsRetrieveRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsRankingsListRaw(requestParameters: TimetrialsRankingsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<PlayerStats>>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsRankingsList().'
            );
        }

        if (requestParameters['lapMode'] == null) {
            throw new runtime.RequiredError(
                'lapMode',
                'Required parameter "lapMode" was null or undefined when calling timetrialsRankingsList().'
            );
        }

        if (requestParameters['metric'] == null) {
            throw new runtime.RequiredError(
                'metric',
                'Required parameter "metric" was null or undefined when calling timetrialsRankingsList().'
            );
        }

        if (requestParameters['region'] == null) {
            throw new runtime.RequiredError(
                'region',
                'Required parameter "region" was null or undefined when calling timetrialsRankingsList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['metric'] != null) {
            queryParameters['metric'] = requestParameters['metric'];
        }

        if (requestParameters['region'] != null) {
            queryParameters['region'] = requestParameters['region'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/rankings/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PlayerStatsFromJSON));
    }

    /**
     */
    async timetrialsRankingsList(requestParameters: TimetrialsRankingsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<PlayerStats>> {
        const response = await this.timetrialsRankingsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsRecordsListRaw(requestParameters: TimetrialsRecordsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ScoreWithPlayer>>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsRecordsList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['region'] != null) {
            queryParameters['region'] = requestParameters['region'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/records/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ScoreWithPlayerFromJSON));
    }

    /**
     */
    async timetrialsRecordsList(requestParameters: TimetrialsRecordsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ScoreWithPlayer>> {
        const response = await this.timetrialsRecordsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsRegionsListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Region>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/regions/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RegionFromJSON));
    }

    /**
     */
    async timetrialsRegionsList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Region>> {
        const response = await this.timetrialsRegionsListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsRegionsRankingsListRaw(requestParameters: TimetrialsRegionsRankingsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<RegionStats>>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsRegionsRankingsList().'
            );
        }

        if (requestParameters['lapMode'] == null) {
            throw new runtime.RequiredError(
                'lapMode',
                'Required parameter "lapMode" was null or undefined when calling timetrialsRegionsRankingsList().'
            );
        }

        if (requestParameters['top'] == null) {
            throw new runtime.RequiredError(
                'top',
                'Required parameter "top" was null or undefined when calling timetrialsRegionsRankingsList().'
            );
        }

        if (requestParameters['type'] == null) {
            throw new runtime.RequiredError(
                'type',
                'Required parameter "type" was null or undefined when calling timetrialsRegionsRankingsList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['top'] != null) {
            queryParameters['top'] = requestParameters['top'];
        }

        if (requestParameters['type'] != null) {
            queryParameters['type'] = requestParameters['type'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/regions/rankings/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RegionStatsFromJSON));
    }

    /**
     */
    async timetrialsRegionsRankingsList(requestParameters: TimetrialsRegionsRankingsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<RegionStats>> {
        const response = await this.timetrialsRegionsRankingsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsStandardsListRaw(requestParameters: TimetrialsStandardsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<StandardLevel>>> {
        const queryParameters: any = {};

        if (requestParameters['isLegacy'] != null) {
            queryParameters['is_legacy'] = requestParameters['isLegacy'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/standards/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(StandardLevelFromJSON));
    }

    /**
     */
    async timetrialsStandardsList(requestParameters: TimetrialsStandardsListRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<StandardLevel>> {
        const response = await this.timetrialsStandardsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsSubmissionsCreateCreateRaw(requestParameters: TimetrialsSubmissionsCreateCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ScoreSubmission>> {
        if (requestParameters['scoreSubmission'] == null) {
            throw new runtime.RequiredError(
                'scoreSubmission',
                'Required parameter "scoreSubmission" was null or undefined when calling timetrialsSubmissionsCreateCreate().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // knoxApiToken authentication
        }

        const response = await this.request({
            path: `/api/timetrials/submissions/create/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ScoreSubmissionToJSON(requestParameters['scoreSubmission']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ScoreSubmissionFromJSON(jsonValue));
    }

    /**
     */
    async timetrialsSubmissionsCreateCreate(requestParameters: TimetrialsSubmissionsCreateCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ScoreSubmission> {
        const response = await this.timetrialsSubmissionsCreateCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsSubmissionsListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ScoreSubmission>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // knoxApiToken authentication
        }

        const response = await this.request({
            path: `/api/timetrials/submissions/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ScoreSubmissionFromJSON));
    }

    /**
     */
    async timetrialsSubmissionsList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ScoreSubmission>> {
        const response = await this.timetrialsSubmissionsListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsTracksListRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Track>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/tracks/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TrackFromJSON));
    }

    /**
     */
    async timetrialsTracksList(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Track>> {
        const response = await this.timetrialsTracksListRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsTracksScoresListRaw(requestParameters: TimetrialsTracksScoresListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ScoreWithPlayer>>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsTracksScoresList().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling timetrialsTracksScoresList().'
            );
        }

        if (requestParameters['lapMode'] == null) {
            throw new runtime.RequiredError(
                'lapMode',
                'Required parameter "lapMode" was null or undefined when calling timetrialsTracksScoresList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['region'] != null) {
            queryParameters['region'] = requestParameters['region'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/tracks/{id}/scores/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ScoreWithPlayerFromJSON));
    }

    /**
     */
    async timetrialsTracksScoresList(requestParameters: TimetrialsTracksScoresListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ScoreWithPlayer>> {
        const response = await this.timetrialsTracksScoresListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async timetrialsTracksTopsListRaw(requestParameters: TimetrialsTracksTopsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ScoreWithPlayer>>> {
        if (requestParameters['category'] == null) {
            throw new runtime.RequiredError(
                'category',
                'Required parameter "category" was null or undefined when calling timetrialsTracksTopsList().'
            );
        }

        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling timetrialsTracksTopsList().'
            );
        }

        if (requestParameters['lapMode'] == null) {
            throw new runtime.RequiredError(
                'lapMode',
                'Required parameter "lapMode" was null or undefined when calling timetrialsTracksTopsList().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['category'] != null) {
            queryParameters['category'] = requestParameters['category'];
        }

        if (requestParameters['lapMode'] != null) {
            queryParameters['lap_mode'] = requestParameters['lapMode'];
        }

        if (requestParameters['region'] != null) {
            queryParameters['region'] = requestParameters['region'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/timetrials/tracks/{id}/tops/`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ScoreWithPlayerFromJSON));
    }

    /**
     */
    async timetrialsTracksTopsList(requestParameters: TimetrialsTracksTopsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ScoreWithPlayer>> {
        const response = await this.timetrialsTracksTopsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const TimetrialsMatchupsRetrieveCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsMatchupsRetrieveCategoryEnum = typeof TimetrialsMatchupsRetrieveCategoryEnum[keyof typeof TimetrialsMatchupsRetrieveCategoryEnum];
/**
 * @export
 */
export const TimetrialsMatchupsRetrieveLapModeEnum = {
    Course: 'course',
    Lap: 'lap',
    Overall: 'overall'
} as const;
export type TimetrialsMatchupsRetrieveLapModeEnum = typeof TimetrialsMatchupsRetrieveLapModeEnum[keyof typeof TimetrialsMatchupsRetrieveLapModeEnum];
/**
 * @export
 */
export const TimetrialsPlayersScoresListCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsPlayersScoresListCategoryEnum = typeof TimetrialsPlayersScoresListCategoryEnum[keyof typeof TimetrialsPlayersScoresListCategoryEnum];
/**
 * @export
 */
export const TimetrialsPlayersScoresListLapModeEnum = {
    Course: 'course',
    Lap: 'lap'
} as const;
export type TimetrialsPlayersScoresListLapModeEnum = typeof TimetrialsPlayersScoresListLapModeEnum[keyof typeof TimetrialsPlayersScoresListLapModeEnum];
/**
 * @export
 */
export const TimetrialsPlayersStatsRetrieveCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsPlayersStatsRetrieveCategoryEnum = typeof TimetrialsPlayersStatsRetrieveCategoryEnum[keyof typeof TimetrialsPlayersStatsRetrieveCategoryEnum];
/**
 * @export
 */
export const TimetrialsPlayersStatsRetrieveLapModeEnum = {
    Course: 'course',
    Lap: 'lap',
    Overall: 'overall'
} as const;
export type TimetrialsPlayersStatsRetrieveLapModeEnum = typeof TimetrialsPlayersStatsRetrieveLapModeEnum[keyof typeof TimetrialsPlayersStatsRetrieveLapModeEnum];
/**
 * @export
 */
export const TimetrialsRankingsListCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsRankingsListCategoryEnum = typeof TimetrialsRankingsListCategoryEnum[keyof typeof TimetrialsRankingsListCategoryEnum];
/**
 * @export
 */
export const TimetrialsRankingsListLapModeEnum = {
    Course: 'course',
    Lap: 'lap',
    Overall: 'overall'
} as const;
export type TimetrialsRankingsListLapModeEnum = typeof TimetrialsRankingsListLapModeEnum[keyof typeof TimetrialsRankingsListLapModeEnum];
/**
 * @export
 */
export const TimetrialsRankingsListMetricEnum = {
    LeaderboardPoints: 'leaderboard_points',
    TotalRank: 'total_rank',
    TotalRecordRatio: 'total_record_ratio',
    TotalRecords: 'total_records',
    TotalScore: 'total_score',
    TotalStandard: 'total_standard'
} as const;
export type TimetrialsRankingsListMetricEnum = typeof TimetrialsRankingsListMetricEnum[keyof typeof TimetrialsRankingsListMetricEnum];
/**
 * @export
 */
export const TimetrialsRecordsListCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsRecordsListCategoryEnum = typeof TimetrialsRecordsListCategoryEnum[keyof typeof TimetrialsRecordsListCategoryEnum];
/**
 * @export
 */
export const TimetrialsRecordsListLapModeEnum = {
    Course: 'course',
    Lap: 'lap'
} as const;
export type TimetrialsRecordsListLapModeEnum = typeof TimetrialsRecordsListLapModeEnum[keyof typeof TimetrialsRecordsListLapModeEnum];
/**
 * @export
 */
export const TimetrialsRegionsRankingsListCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsRegionsRankingsListCategoryEnum = typeof TimetrialsRegionsRankingsListCategoryEnum[keyof typeof TimetrialsRegionsRankingsListCategoryEnum];
/**
 * @export
 */
export const TimetrialsRegionsRankingsListLapModeEnum = {
    Course: 'course',
    Lap: 'lap',
    Overall: 'overall'
} as const;
export type TimetrialsRegionsRankingsListLapModeEnum = typeof TimetrialsRegionsRankingsListLapModeEnum[keyof typeof TimetrialsRegionsRankingsListLapModeEnum];
/**
 * @export
 */
export const TimetrialsRegionsRankingsListTopEnum = {
    All: 'all',
    Records: 'records',
    Top10: 'top10',
    Top3: 'top3',
    Top5: 'top5'
} as const;
export type TimetrialsRegionsRankingsListTopEnum = typeof TimetrialsRegionsRankingsListTopEnum[keyof typeof TimetrialsRegionsRankingsListTopEnum];
/**
 * @export
 */
export const TimetrialsRegionsRankingsListTypeEnum = {
    Continent: 'continent',
    Country: 'country',
    Subnational: 'subnational'
} as const;
export type TimetrialsRegionsRankingsListTypeEnum = typeof TimetrialsRegionsRankingsListTypeEnum[keyof typeof TimetrialsRegionsRankingsListTypeEnum];
/**
 * @export
 */
export const TimetrialsTracksScoresListCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsTracksScoresListCategoryEnum = typeof TimetrialsTracksScoresListCategoryEnum[keyof typeof TimetrialsTracksScoresListCategoryEnum];
/**
 * @export
 */
export const TimetrialsTracksScoresListLapModeEnum = {
    Course: 'course',
    Lap: 'lap'
} as const;
export type TimetrialsTracksScoresListLapModeEnum = typeof TimetrialsTracksScoresListLapModeEnum[keyof typeof TimetrialsTracksScoresListLapModeEnum];
/**
 * @export
 */
export const TimetrialsTracksTopsListCategoryEnum = {
    NonShortcut: 'nonsc',
    Shortcut: 'sc',
    Unrestricted: 'unres'
} as const;
export type TimetrialsTracksTopsListCategoryEnum = typeof TimetrialsTracksTopsListCategoryEnum[keyof typeof TimetrialsTracksTopsListCategoryEnum];
/**
 * @export
 */
export const TimetrialsTracksTopsListLapModeEnum = {
    Course: 'course',
    Lap: 'lap'
} as const;
export type TimetrialsTracksTopsListLapModeEnum = typeof TimetrialsTracksTopsListLapModeEnum[keyof typeof TimetrialsTracksTopsListLapModeEnum];
