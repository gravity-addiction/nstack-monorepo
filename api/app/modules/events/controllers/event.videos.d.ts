import { IEventVideoComp, IEventVideoJudge, IEventVideoQueue, IEventVideoQueueEntry, IEventVideoTeam, ResultsEventVideo, ResultsEventVideoQueue } from '@typings/event';
import { IVideoPlayerInfoAws } from '@typings/video-player';
import { PoolConnection, RowDataPacket } from 'mysql2';
export declare const ngEventVideoInfoAws: (r: RowDataPacket | ResultsEventVideoQueue) => IVideoPlayerInfoAws;
export declare const ngEventVideoJudge: (r: RowDataPacket | ResultsEventVideoQueue) => IEventVideoJudge;
export declare const ngEventVideoComp: (r: RowDataPacket | ResultsEventVideoQueue) => IEventVideoComp;
export declare const ngEventVideoTeam: (r: RowDataPacket | ResultsEventVideoQueue) => IEventVideoTeam;
export declare const ngEventVideoQueueEntry: (r: RowDataPacket | ResultsEventVideoQueue) => IEventVideoQueueEntry;
export declare const ngEventVideoQueue: (r: RowDataPacket[] | ResultsEventVideoQueue, userid: number) => IEventVideoQueue;
export declare const getEventVideoQueueForUser: (userId: number, watched?: number, eventId?: number, qStart?: number, qLimit?: number, db?: PoolConnection) => Promise<ResultsEventVideoQueue[]>;
export declare const getEventVideo: (id: number, db?: PoolConnection) => Promise<ResultsEventVideo>;
export declare const eventVideoQueueParseRet: (ret: IEventVideoQueue[], data: ResultsEventVideoQueue[], watched?: number, eventSlug?: string) => IEventVideoQueue[];