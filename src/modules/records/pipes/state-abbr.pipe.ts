import { Pipe, PipeTransform } from '@angular/core';
import { stateAbbrList } from '@classes/state-abbr';

@Pipe({ name: 'sbStateAbbr' })
export class StateAbbrPipe implements PipeTransform {
  transform(value: string): string {
    console.log('State', stateAbbrList);
    if (value) {
      const sLen = stateAbbrList.length;
      for (let i = 0; i < sLen; i++) {
        if (
          stateAbbrList[i].abbr.toLocaleLowerCase() ===
          value.toLocaleLowerCase()
        ) {
          return stateAbbrList[i].name + ' State';
        }
      }
    }
    return 'National';
  }
}
