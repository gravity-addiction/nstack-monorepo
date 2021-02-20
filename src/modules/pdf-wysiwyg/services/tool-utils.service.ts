import { Injectable } from '@angular/core';

import { IPdfWysiwygItem } from '../models/i-pdf-wysiwyg-item';

@Injectable()
export class ToolUtils {

  public static checkCloseEnough(p1: number, p2: number, cl: number) {
    const clearance = (cl > 25) ? 10 : (cl / 3);
    return Math.abs(p1 - p2) < clearance;
  }

  public static cleanCoords(item: any) {
    item.x = parseFloat(item.x) || 0;
    item.y = parseFloat(item.y) || 0;
    item.w = parseFloat(item.w) || 0;
    item.h = parseFloat(item.h) || 0;
  return item;
  }

  // Checks if the x, y is inside any items []. first match returned
  public static collides(items: IPdfWysiwygItem[], x: number, y: number): IPdfWysiwygItem | null {
    // const isCollision = false,
    const len = items.length;

    for (let i = 0; i < len; i++) {
      if (
        typeof items[i].obj.hasCollision === 'function' &&
        items[i].obj.hasCollision(x, y)
      ) {
        return items[i];
      }
    }
    return null;
  }

  public static fetchImage(url: string): XMLHttpRequest {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.overrideMimeType('image/svg+xml');
    xhr.send('');
  return xhr;
  }

  public static generateFilename(ext = '.pdf') {
    const d = new Date();
          const dd = d.getDate();
          const mm = d.getMonth() + 1;
          const yyyy = d.getFullYear();

    if (!new RegExp(/^\s*?\..*$/).test(ext)) {
      ext = `.${ext}`;
    }
    return `${yyyy}-${mm}-${dd}${ext}`;
  }

  public static trimString(doc: any, docType: string, str: string, len: number,
                           reverse = false) {
    let stringToLong = false;

    if (str && str.length > 3 && (
      (docType === 'canvas' && doc.measureText(str).width > len) ||
      (docType === 'pdf' && doc.widthOfString(str) > len)
    )) {
      stringToLong = true;
    }

    while (str && stringToLong) {
      if (reverse) {
        str = str.substr(1);
      } else {
 str = str.slice(0, -1);
}

      if (
        (docType === 'canvas' && doc.measureText(str).width < len) ||
        (docType === 'pdf' && doc.widthOfString(str) <= len)
      ) {
 stringToLong = false;
}
    }

    return str;
  }

  public static getNativeWindow() {
    return window;
  }

  public static roundFloat(value: number, toNearest: number, fixed: number): number {
    const fixedVal = (Math.ceil(value / toNearest) * toNearest).toFixed(fixed);
    return parseFloat(fixedVal);
  }

  // https://github.com/substack/point-in-polygon
  // point: [ 1.5, 1.5 ]
  // vs: [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
  public static pointInPolygon(point: number[], vs: Array<number[]>) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    const x = point[0];
          const y = point[1];

    let inside = false;
    const vsL = vs.length;
    for (let i = 0, j = vsL - 1; i < vsL; j = i++) {
      const xi = vs[i][0]; const yi = vs[i][1];
      const xj = vs[j][0]; const yj = vs[j][1];

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
 inside = !inside;
}
    }
    return inside;
  }

}
