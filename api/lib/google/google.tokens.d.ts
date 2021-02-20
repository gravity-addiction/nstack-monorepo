export declare class GoogleTokens {
    private _API_TOKEN;
    private _API_TOKEN_EXPIRES;
    private _tokenPromise;
    private _timer;
    private _API_TOKEN_V3;
    private _API_TOKEN_EXPIRES_V3;
    private _tokenPromiseV3;
    private _timerV3;
    constructor();
    get token(): Promise<string>;
    get tokenV3(): Promise<string>;
    private setTimer;
    private getTokenV4;
    private getTokenV3;
}
