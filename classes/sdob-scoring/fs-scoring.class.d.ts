export declare class FsScoringClass {
    pointsInTime: number;
    totalScore: number;
    constructor();
    static calculatePit(marks: any[]): number;
    static calculateScore(marks: any[]): number;
    static calculateCollation: (scArr: any[]) => Promise<any[]>;
}
