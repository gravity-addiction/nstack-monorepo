// eslint-disable-next-line max-len
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { HelperBrowserService } from '@modules/app-common/services/helper-browser.service';
import { Sha256Service } from '@modules/app-common/services/sha256.service';
import { S3UploadService } from '@modules/aws/services/s3-upload.service';
import { PdfWysiwygService } from '@modules/pdf-wysiwyg/services/pdf-wysiwyg.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

declare const pdfjsLib: any;
declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob });
}

@Component({
  selector: 'app-pdf-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-editor.component.html',
  styleUrls: ['pdf-editor.component.scss'],
})
export class PdfEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('LocalFile', { static: true }) localFile: any;
  @ViewChild('PdfUrl', { static: false }) pdfUrlElem!: ElementRef;

  @ViewChild('TheCanvas', { static: false })
  set theCanvas(v: ElementRef) {
    if (!v || !v.nativeElement) {
      return;
    }
    this.canvasRef = v;
    this.canvasEle = v.nativeElement;
    this.canvasCtx = this.canvasEle.getContext('2d', { alpha: true });
  }

  @ViewChild('wysiwygWrapper', { static: false }) wysiwygWrapper!: ElementRef;
  @ViewChild('WysiwygElem', { static: true }) wysiwygElem!: ElementRef;

  public subscriptionsUpload: Subscription = new Subscription();

  public canvasEle!: HTMLCanvasElement;
  public canvasCtx!: CanvasRenderingContext2D | null;
  public canvasRef!: ElementRef;

  public leftPane = 'assets';

  public baseImage = new Image();
  public storedRects: any[] = [];
  public capturedImages: any[] = [];
  public pdfDoc!: any;
  public pdfReady = false;
  public pdfLoaded = false;
  public pageNum = 1;
  public pageCur!: any;
  public pageRendering = false;
  public pageNumPending: any = null;
  public pdfScale = 1.3333;
  public svg = 'assets/blankforms/letter-landscape.svg';
  public viewScale = 0.978986;
  public viewWidth = 792;
  public viewHeight = 612;
  public scale = 5.0;
  public scaleMultipler = 1.0;
  public refresh = true;
  public rect: any;
  public pdfUrl = 'assets/SCM_ch09.pdf';

  public pdfService!: PdfWysiwygService;
  public pdfAddedStyle = { border: '0px' };


  public captureImageIdentifer = '';

  public preDefinedSets: any = {
    uspaFS4: {
      title: 'FS-4',
      assets: 'assets/divepool/fs-4/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
      min: 5,
      max: 6,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 10,
      _dgDraw: [],
    },
    uspaFS8: {
      title: 'FS-8',
      assets: 'assets/divepool/fs-8/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
      min: 5,
      max: 6,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
    uspaFS10: {
      title: 'FS-10',
      assets: 'assets/divepool/fs-10/',
      randoms: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      blocks: [],
      min: 5,
      max: 6,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
    uspaFS16: {
      title: 'FS-16',
      assets: 'assets/divepool/fs-16/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
      blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      min: 5,
      max: 6,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
    uspaCF2: {
      title: 'CF-2',
      assets: 'assets/divepool/cf-2/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'A', 'B', 'C', 'D', 'E', 'F'],
      blocks: [],
      min: 5,
      max: 5,
      resetPoolRound: true,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
    uspaCF4: {
      title: 'CF-4',
      assets: 'assets/divepool/cf-4/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'],
      blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
      min: 4,
      max: 5,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
    uspaCF8: {
      title: 'CF-8',
      assets: 'assets/divepool/cf-8/',
      randoms: ['A', 'B', 'C', 'D'],
      blocks: [],
      min: 1,
      max: 1,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
    uspaVFS4: {
      title: 'VFS-4',
      assets: 'assets/divepool/vfs-4/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
      min: 5,
      max: 6,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 10,
      _dgDraw: [],
    },
    uspaMfs2: {
      title: 'MFS-2',
      assets: 'assets/divepool/mfs-2/',
      randoms: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      blocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'],
      min: 5,
      max: 6,
      resetPoolRound: false,
      _showGenerator: false,
      _dgRounds: 8,
      _dgDraw: [],
    },
  };
  public preDefinedSetsKeys = Object.keys(this.preDefinedSets);

  public mouse: any = {
    button: false,
    x: 0,
    y: 0,
    down: false,
    up: false,
    element: null,
    event: (e: any, t: any) => {
      if (e.target instanceof HTMLCanvasElement) {
        const m: any = t.mouse;
        m.bounds = m.element.getBoundingClientRect();
        m.x = (e.pageX - m.bounds.left - scrollX) * t.scaleMultipler;
        m.y = (e.pageY - m.bounds.top - scrollY) * t.scaleMultipler;
        const prevButton = m.button;
        m.button = e.type === 'mousedown' ? true : e.type === 'mouseup' ? false : t.mouse.button;
        if (!prevButton && m.button) {
          m.down = true;
        }
        if (prevButton && !m.button) {
          m.up = true;
        }
      }
    },
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private helperService: HelperService,
    private helperBrowserService: HelperBrowserService,
    private s3UploadService: S3UploadService,
    private sha256: Sha256Service
  ) {
    this.rect = this.rectInit();
    this.pdfService = new PdfWysiwygService();
    this.pdfService.editable = true;

    // Links into the Hook array
    this.pdfService.addHook('preSave', (_cb: any) => {
      // console.log('Pre Save Hook');
      _cb(null);
      /*
      const save = this.requiredInput();
      if (save) {
        _cb(null); // Good
      } else {
        _cb('Did not save'); // Bad
      }
      */
    });

    this.pdfService.addHook('save', (_cb: any) => {
      // console.log('Save Hook');
      _cb(null);
    });

    this.pdfService.addHook('postSave', (_cb: any) => {
      // console.log('Post Save Hook');
      _cb(null);
      /*
      const url = this.paperwork_service.changeURL(this.service);
      this.location.replaceState(url);
      if (this.service.cust_id && this.service.data_id) {
        this.paperwork_service.saveCustomer(this.service.cust_id, this.service.data_id,
              this.service.ident, this.service.new_data_id).subscribe(() => {
          _cb(null);
        }, err => {
          console.log(err);
          _cb(err);
        });
      }
      */
    });

    this.pdfService.addHook('autopopulate', (_cb: any) => {
      // console.log('Auto Populate Hook');
      _cb(null);
      /*
      this.paperwork_service.autoFillForm(this.service).subscribe(data => {
        this.paperwork_service.loadCustomerData(data.cust_data, this.service, (res) => {
          if (res) {
            this.populateForm(res);
          }
          _cb(null);
        })
      }, err => {
        console.log(err);
        _cb(err);
      });
      */
    });
  }

  /*
  @HostListener('window:drop', ['$event'])
  handleWindowDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.getPdfFileReader({ target: event.dataTransfer });

  }
  */

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  handleMouseKeyboardEvent(event: KeyboardEvent) {
    this.mouse.element = this.canvasEle;
    this.mouse.event(event, this);
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  handleResizeEvent(event: any) {
    this.resizeCanvas();
  }

  @HostListener('window:scroll', ['$event'])
  onScrolled(event: any) {
    if (window.pageYOffset > 100) {
      this.wysiwygElem.nativeElement.style.marginTop = (window.pageYOffset - 75) + 'px';
    } else {
      this.wysiwygElem.nativeElement.style.marginTop = '';
    }
  }

  ngOnInit() {
    this.helperService.loadScript('pdfjs').then(() => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/library/pdfjs/pdf.worker.js';
      this.pdfReady = true;
    });

    this.resizeCanvas();
  }

  ngOnDestroy() {
    try {
      this.localFile.nativeElement.removeEventListener('change', this.getPdfFileReader.bind(this));
    } catch (e) { }
  }

  ngAfterViewInit() {
    this.localFile.nativeElement.addEventListener('change', this.getPdfFileReader.bind(this));
    requestAnimationFrame(this.mainLoop.bind(this));


    // setTimeout(() => { this.resizeCanvas(); }, 1000);
    // console.log(this.wysiwygWrapper.nativeElement.offsetWidth);
    // this.viewWidth = parseInt(this.wysiwygWrapper.nativeElement.offsetWidth, 10) || 600;
  }


  rectInit() {
    let x1: number; let y1: number; let x2: number; let y2: number;
    const show = false;
    const rect = { x: 0, y: 0, w: 0, h: 0, draw: null };
    rect.draw = (ctx: any) => {
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    };

    const fix = () => {
      rect.x = Math.min(x1, x2);
      rect.y = Math.min(y1, y2);
      rect.w = Math.max(x1, x2) - Math.min(x1, x2);
      rect.h = Math.max(y1, y2) - Math.min(y1, y2);
    };

    const API = {
      restart: (point: any) => {
        x2 = x1 = point.x;
        y2 = y1 = point.y;
        fix();
        API.show = true;
      },
      update: (point: any) => {
        x2 = point.x;
        y2 = point.y;
        fix();
        API.show = true;
      },
      toRect: () => {
        API.show = false;
        return Object.assign({}, rect);
      },
      draw: (ctx: any) => {
        if (show) {
          rect.draw(ctx);
        }
      },
      show,
    };
    return API;
  };


  setupWysiwygLandscape() {
    this.pdfScale = 1.3333;
    this.svg = 'assets/blankforms/letter-landscape.svg';
    this.pdfService.viewScale = 0.978986;
    this.viewWidth = 792;
    this.viewHeight = 612;
  }

  setupWysiwygPortrait() {
    this.pdfScale = 1.3333;
    this.svg = 'assets/blankforms/letter.svg';
    this.viewScale = 0.7583643;
    this.viewWidth = 612;
    this.viewHeight = 792;
  }

  resizeCanvas() {
    if (this.pdfService.pdfLayout === 'landscape') {
      this.setupWysiwygLandscape();
    } else {
      this.setupWysiwygPortrait();
    }
    this.viewScale = this.viewWidth / (this.wysiwygElem.nativeElement.clientWidth - 32);
  }

  saveDataset(data: any) {
    console.log('Save Dataset', data);
  }

  imgDragStart(event: any) {
    this.pdfService.dragOffsets = {
      x: event.offsetX,
      y: event.offsetY,
      w: event.target.width,
      h: event.target.height,
    };
  }
  getPdfFileReader(fileObj: any) {
    const file = fileObj.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const typedArr = new Uint8Array(fileReader.result as ArrayBuffer);
      const loadingTask = pdfjsLib.getDocument(typedArr);
      loadingTask.promise.then((pdfDoc: any) => {
        this.pdfDoc = pdfDoc;
        // Initial/first page rendering
        this.queueRenderPage(this.pageNum);
      });
    };
    fileReader.readAsArrayBuffer(file);
  }

  getPDFDocument(url: string) {
    const loadingTask = pdfjsLib.getDocument(encodeURI(url));
    loadingTask.promise.then((pdfDoc: any) => {
      this.pdfDoc = pdfDoc;
      // Initial/first page rendering
      this.queueRenderPage(this.pageNum);
    });
  }

  fetchPage(num: number) {
    this.pdfLoaded = false;
    this.pdfDoc.getPage(num).then((page: any) => {
      this.pageCur = page;
      this.renderPage(this.pageCur);
    });
  }

  renderPage(page: any) {
    this.pageRendering = true;
    const viewport = page.getViewport({ scale: this.scale });
    this.canvasEle.height = viewport.height;
    this.canvasEle.width = viewport.width;
    this.canvasEle.style.height = '100%';
    this.canvasEle.style.width = '100%';

    this.scaleMultipler = viewport.width / (this.canvasEle.offsetWidth || this.canvasEle.clientWidth);

    const renderContext = {
      canvasContext: this.canvasCtx,
      viewport,
    };
    const renderTask = page.render(renderContext);

    renderTask.promise.then(() => {
      this.pageRendering = false;
      this.baseImage = new Image();
      this.baseImage.src = this.canvasEle.toDataURL();
      if (this.pageNumPending !== null) {
        this.pageNumPending = null;
        this.queueRenderPage(this.pageNumPending);
      }
      this.pdfLoaded = true;
    });
  }

  queueRenderPage(num: number) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.fetchPage(num);
    }
  }

  draw() {
    if (!this.canvasCtx) {
      return;
    }
    this.canvasCtx.drawImage(this.baseImage, 0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);
    this.canvasCtx.lineWidth = this.scale;
    this.canvasCtx.strokeStyle = '#fd5800';
    this.storedRects.forEach((rect: any) => rect.draw(this.canvasCtx));
    this.canvasCtx.strokeStyle = 'red';
    this.rect.draw(this.canvasCtx);
  }

  prevPage() {
    if (this.pageNum <= 1) {
      this.pageNum = this.pdfDoc.numPages;
    } else {
      this.pageNum--;
    }
    this.queueRenderPage(this.pageNum);
  }
  nextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  mainLoop() {
    if (this.refresh || this.mouse.down || this.mouse.up || this.mouse.button) {
      this.refresh = false;
      if (this.mouse.down) {
        this.mouse.down = false;
        this.rect.restart(this.mouse);

      } else if (this.mouse.button) {
        this.rect.update(this.mouse);

      } else if (this.mouse.up) {
        this.mouse.up = false;
        this.rect.update(this.mouse);
        this.storedRects[0] = this.rect.toRect();
        // this.storedRects.push(this.rect.toRect());

      }
      this.draw();
    }
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  captureImage() {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const cCtx: CanvasRenderingContext2D | null = canvas.getContext('2d', { alpha: true });
    if (!cCtx) {
      return;
    }

    cCtx.canvas.height = this.storedRects[0].h;
    cCtx.canvas.width = this.storedRects[0].w;
    cCtx.drawImage(
      this.baseImage,
      this.storedRects[0].x - (this.storedRects[0].x * 2),
      this.storedRects[0].y - (this.storedRects[0].y * 2)
    );

    /*
    const cBlog = canvas.toBlob((imgBlob: any) => {
      const clippy = new ClipboardItem({
        'image/png': imgBlob,
      });
      console.log(clippy);
      window.navigator['clipboard'].write([clippy]);
    }, 'image/png');
    */
    this.captureImageIdentifer = this.getNextIdent(this.captureImageIdentifer);
    const fName = prompt('Image Identifier', this.captureImageIdentifer) || 'A';

    const du = canvas.toDataURL('image/png');
    const df = this.helperBrowserService.canvasToFile(canvas, fName + '.png');

    this.capturedImages.push({
      uri: du,
      file: df,
      name: fName,
      type: 'image/png',
      rect: this.storedRects[0],
    });
  }

  getNextIdent(curIdent = ''): string {
    if (curIdent === '') {
      return 'A';
    }
    const cCode = curIdent.charCodeAt(0);
    if (cCode >= 65 && cCode < 90) { // Capital Letters
      return String.fromCharCode(cCode + 1);
    } else if (cCode >= 97 && cCode < 122) { // Number
      return String.fromCharCode(cCode + 1);
    } else if (cCode >= 48 && cCode <= 57) { // Number
      return ((parseInt(curIdent, 10) || 0) + 1).toString();
    }

    return '';
  }

  async uploadImage(cI: any) {
    if (!cI) {
      return;
    }
    const fName = cI.name;
    const fType = cI.type;

    /*
    this.subscriptionsUpload.add(
      this.s3UploadService.uploadStatus.pipe(
        tap((data: any) => {
          // In Progress
          if (data.hasOwnProperty('progress')) {
            this.progressSent = (parseInt(data.progress, 10) || 0) * 100 || 0;
            this.progressLoaded = data.loaded || 0;
            this.progressTotal = data.total || 0;
          }

          // Finishing Up
          if (data.status === AwsS3UploadStatus.idle && data.progress >= 1) {
            this.isUploading = false;

          // Finished
          } else if (data.status === AwsS3UploadStatus.finished && this.isUploading) {
            this.isUploading = false;
            this.acceptFile = true;
            setTimeout(() => { this.ngAfterViewInit(); }, 250);
          } else if (data.status === AwsS3UploadStatus.error) {
            console.log('Upload Error!', data.err);
          }
        }),
        tap(() => { this.changeDetectorRef.detectChanges(); })
      ).subscribe()
    );
    */
    this.subscriptionsUpload.add(
      this.s3UploadService.getPostUrl(fName, fType, {}).pipe(
        // Send file to aws server
        map((url: string) => this.s3UploadService.addFileToQueue(url, fType, cI.f)),

        // Attach upload latest queueEntry to currentUpload
        tap((queueEntry: any) => {
          // this.currentUpload = queueEntry;
        })
      ).subscribe()
    );
  }


  // Using Fisher-Yates Shuffling
  generateDraw(preDKey: string) {
    const roundCnt = this.preDefinedSets[preDKey]._dgRounds;
    const reloadSet = [...this.preDefinedSets[preDKey].randoms, ...this.preDefinedSets[preDKey].blocks];
    let fullSet = [...reloadSet];

    for (let i = 0; i < roundCnt; i++) {
      let curPoints = 0;
      const drawSet: string[] = [];
      if (this.preDefinedSets[preDKey].resetPoolRound) {
        fullSet = [...reloadSet];
      }

      while (curPoints < this.preDefinedSets[preDKey].min) {
        if (!fullSet.length) {
          fullSet = [...reloadSet].filter(r => drawSet.indexOf(r) < 0);
        }
        this.helperService.fisherYatesShuffle(fullSet.sort());
        const nextPoint = fullSet[fullSet.length - 1];
        drawSet.push(nextPoint);
        fullSet.pop();

        if (nextPoint.charCodeAt(0) >= 49 && nextPoint.charCodeAt(0) <= 57) {
          curPoints += 2;
        } else {
          curPoints += 1;
        }
      }
      if (curPoints > this.preDefinedSets[preDKey].max) {
        this.preDefinedSets[preDKey]._dgDraw[i] = 'INVALID';
      } else {
        this.preDefinedSets[preDKey]._dgDraw[i] = drawSet.join(' ');
      }
    }

  }

  pastePDF(preDKey: string) {
    const roundCnt = this.preDefinedSets[preDKey]._dgRounds;
    const drawRounds = this.preDefinedSets[preDKey]._dgDraw;
    for (let i = 0; i < roundCnt; i++) {
      this.pdfService.addPage(i + 1);
      this.pdfService.changePage(i + 1);

      if (!drawRounds[i]) {
        continue;
      }
      let drawLine = [];

      const drawLineComma = drawRounds[i].replace(/\s,\s+/g, ',').split(',');
      const drawLinePipe = drawRounds[i].replace(/\s\|\s+/g, '|').split('|');
      const drawLineSpace = drawRounds[i].replace(/\s\s+/g, ' ').split(' ');

      if (drawLineComma.length > 1 && drawLineComma.length > drawLinePipe.length) {
        drawLine = drawLineComma;
      } else if (drawLinePipe.length > 1) {
        drawLine = drawLinePipe;
      } else {
        drawLine = drawLineSpace;
      }

      this.pdfService.createItem(
        70, 70, 'textbox',
        250, 35,
        {
          txt: 'Round: #' + (i + 1),
          fontSize: 30,
        }
      );

      drawLine.forEach((dL: string, dI: number) => {
        this.pdfService.createItem(
          40 + (dI * 145), 120, 'image',
          125, null,
          { dataUrl: this.preDefinedSets[preDKey].assets + dL.toLocaleUpperCase() + '.png' }
        );
      });
    }

    this.pdfService.changePage(1);
  }
  // eslint-disable-next-line max-lines
}
