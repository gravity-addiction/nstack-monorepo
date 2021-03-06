import { Injectable } from '@angular/core';
import { Observable, Observer, } from 'rxjs';
import { NgxCSVParserError } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class NgxCsvParser {

  private defaultCSVParserConfig = {
    header: true,
    delimiter: ','
  };

  parse(csvFile: File, config: CSVParserConfig): Observable<Array<any> | NgxCSVParserError> {

    config = {
      ...this.defaultCSVParserConfig,
      ...config
    };

    const ngxCSVParserObserver = new Observable((observer: Observer<Array<any> | NgxCSVParserError>) => {
      try {
        let csvRecords = null;

        const reader = new FileReader();
        reader.readAsText(csvFile);

        reader.onload = () => {
          const csvData = reader.result;
          const csvRecordsArray = this.csvStringToArray((csvData as string).trim(), config.delimiter);

          const headersRow = this.getHeaderArray(csvRecordsArray);
//          console.log(headersRow);
          csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length, config);

          observer.next(csvRecords);
          observer.complete();
        };

        reader.onerror = () => {
          this.badCSVDataFormatErrorHandler(observer);
        };


      } catch (error) {
        this.unknownCSVParserErrorHandler(observer);
      }
    });

    return ngxCSVParserObserver;
  }

  csvStringToArray(csvDataString: string, delimiter: string) {
    const regexPattern = new RegExp(
      (`(\\${delimiter}|\\r?\\n|\\r|^)(?:\"((?:\\\\.|\"\"|[^\\\\\"])*)\"|([^\\${delimiter}\"\\r\\n]*))`),
      'gi'
    );
    let matchedPatternArray = regexPattern.exec(csvDataString);
    const resultCSV = [[]];
    while (matchedPatternArray) {
      if (matchedPatternArray[1].length && matchedPatternArray[1] !== delimiter) {
        resultCSV.push([]);
      }
      const cleanValue = matchedPatternArray[2] ?
        matchedPatternArray[2].replace(new RegExp('[\\\\\"](.)', 'g'), '$1') : matchedPatternArray[3];
      resultCSV[resultCSV.length - 1].push(cleanValue);
      matchedPatternArray = regexPattern.exec(csvDataString);
    }
    return resultCSV;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any, config: any) {
    const dataArr = [];
    const headersArray = csvRecordsArray[0];

    const startingRowToParseData = config.header ? 1 : 0;

    for (let i = startingRowToParseData; i < csvRecordsArray.length; i++) {
      const data = csvRecordsArray[i];

      if (data.length === headerLength && config.header) {

        const csvRecord = {};

        for (let j = 0; j < data.length; j++) {
          if ((data[j] === undefined) || (data[j] === null)) {
            csvRecord[headersArray[j]] = '';
          } else {
            csvRecord[headersArray[j]] = data[j].trim();
          }
        }
        dataArr.push(csvRecord);
      } else {
        dataArr.push(data);
      }
    }
    return dataArr;
  }



  getHeaderArray(csvRecordsArr: any) {
    const headers = csvRecordsArr[0];
    const headerArray = [];
    for (const header of headers) {
      headerArray.push(header);
    }
    return headerArray;
  }

  notCSVFileErrorHandler(observer: Observer<any>) {
    const ngcCSVParserError: NgxCSVParserError =
      this.errorBuilder('NOT_A_CSV_FILE', 'Selected file is not a csv File Type.', 2);
    observer.error(ngcCSVParserError);
  }

  unknownCSVParserErrorHandler(observer: Observer<any>) {
    const ngcCSVParserError: NgxCSVParserError =
      this.errorBuilder('UNKNOWN_ERROR', 'Unknown error. Please refer to official documentation for library usage.', 404);
    observer.error(ngcCSVParserError);
  }

  badCSVDataFormatErrorHandler(observer: Observer<any>) {
    const ngcCSVParserError: NgxCSVParserError =
      this.errorBuilder('BAD_CSV_DATA_FORMAT', 'Unable to parse CSV File.', 1);
    observer.error(ngcCSVParserError);
  }

  errorBuilder(type: string, message: any, code: any): any {
    return { type, message, code };
  }
}

class CSVParserConfig {
  header?: boolean;
  delimiter?: string;

  constructor() { }
}
