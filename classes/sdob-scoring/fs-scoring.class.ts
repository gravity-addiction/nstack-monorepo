export class FsScoringClass {
  public pointsInTime = 0;
  public totalScore = 0;

//  private static _instance: FsScoringClass = new FsScoringClass();
  constructor() {
//    if (FsScoringClass._instance) {
//      throw new Error('Error: Init failed, user FsScoringClass.getInstance() instead of new.');
//    }
//    FsScoringClass._instance = this;
  }

//  public static getInstance(): FsScoringClass {
//    return FsScoringClass._instance;
//  }

  static calculatePit(marks: any[]): number {
    let curScore = 0;
    const mLen = marks.length;
    for (let i = 0; i < mLen; i++) {
      if (marks[i].class !== 'blank') {
        curScore += 1;
      }
    }
    return curScore;
  }

  static calculateScore(marks: any[]): number {
    let curScore = 0;
    const mLen = marks.length;
    for (let i = 0; i < mLen; i++) {
      if (marks[i].class === 'point') {
        curScore += 1;
      } else if (marks[i].class === 'omit') {
        curScore -= 2;
      }
    }
    if (curScore < 0) { curScore = 0; }
    return curScore;
  }


  static calculateCollation = async (scArr: any[]): Promise<any[]> => {
    if (!scArr || !scArr.length) { return []; }
  
    const scLen = scArr.length;
    const scInfo: any[] = [];
    let longestScorecard = 0; // most number of points on a scorecard
    let highColl = -1; // highest mark with collation
  
    // loop for info
    for (let sC = 0; sC < scLen; sC++) {
      if (scArr[sC].length > longestScorecard) { longestScorecard = scArr[sC].length; }
    }
  
    for (let sP = 0; sP < longestScorecard; sP++) {
      const markNames = ['point', 'bust', 'omission', 'noview', 'blank'],
            arrMarks = [0, 0, 0, 0, 0];
  
      if (highColl === highColl - 1) { highColl = sP; } // Increase highest collation when sequence still solid
      for (let sC = 0; sC < scLen; sC++) {
        if (scArr[sC].length <= sP) {
          if (highColl === sP) { highColl -= 1; } // break collation sequence
          arrMarks[1] += 1; // count a non-mark as a bust
          continue;
        }
  
        // add this mark to final scorecard
        if (scArr[sC][sP].class === 'point') { arrMarks[0] += 1;
        } else if (scArr[sC][sP].class === 'bust') { arrMarks[1] += 1;
        } else if (scArr[sC][sP].class === 'omission') { arrMarks[2] += 1;
        } else if (scArr[sC][sP].class === 'nv') { arrMarks[1] += 1; // mark NV as a bust so tiebreak doesn't happen here
        } else if (scArr[sC][sP].class === 'blank') { arrMarks[4] += 1; }
      }
  
      // Find largest scored mark type for this point
      const highMark = Math.max.apply(Math.max, arrMarks),
            topMarks = arrMarks.filter((m: number) => m === highMark) || [];
  
      // confirm we don't tie between two different types of marks
      if (topMarks.length === 1) {
        scInfo.push({class: markNames[arrMarks.indexOf(highMark)]});
      } else {
        if (!scInfo.length && markNames[arrMarks.indexOf(highMark)] === 'blank') {
          scInfo.push({class: 'blank'});
        } else {
          scInfo.push({class: 'tiebreak'});
        }
      }
    }
  
    return scInfo;
  };
}
