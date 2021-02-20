// eslint-disable-next-line max-len
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { Observable, Subject, Subscription } from 'rxjs';

import { IPdfWysiwygItem } from '../../models/i-pdf-wysiwyg-item';
import { PdfWysiwygService, ToolUtils } from '../../services';

@Component({
  selector: 'app-pdf-wysiwyg',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-wysiwyg.html',
  styleUrls: ['./pdf-wysiwyg.css'],
})
export class PdfWysiwygComponent implements OnInit {
  @Input() set pdfService(s: any) {
    this.service = s;
  }
  @Input() set svg(s: string) {
    this.service.pdfSvg = s;
  }
  @Input() set width(w: number) {
    this.service.pixelWidth = w;
  }
  @Input() set height(h: number) {
    this.service.pixelHeight = h;
  }
  @Input() viewScale = 1;
  @Input() pdfScale = 1;
  @Input() ident!: string;

  @Output() save = new EventEmitter();

  @ViewChild('imgRef', { static: false }) imgRef!: ElementRef;
  @ViewChild('editCanvas', { static: true }) canvas!: ElementRef;
  @ViewChild('editBackground', { static: false }) editBackground!: ElementRef;
  @ViewChild('toolbox', { static: false }) toolbox!: ElementRef;
  @ViewChild('downloadTag', { static: true }) downloadTag!: ElementRef;

  public service!: PdfWysiwygService;
  private _stopArrows = false;

  constructor(
    private _helperService: HelperService
  ) { }


  @HostListener('document:keydown', ['$event']) cKdown(e: KeyboardEvent) {
    if (this.service.hasFocus && e.key === 'Enter') {
      e.preventDefault();
    } // Prevent text area return
    if (this.service.hasFocus) {
      return;
    }

    this.canvasKey(e);
    if (['Up', 'ArrowUp', 'Down', 'ArrowDown', 'Left', 'ArrowLeft', 'Right', 'ArrowRight'].indexOf(e.key) > -1 &&
      this.service.activeItem &&
      !this._stopArrows
    ) {
      e.preventDefault();
    }
  }

  @HostListener('window:drop', ['$event'])
  handleWindowDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('fullscreenchange', ['$event'])
  @HostListener('webkitfullscreenchange', ['$event'])
  @HostListener('mozfullscreenchange', ['$event'])
  @HostListener('MSFullscreenChange', ['$event'])
  handleResizeEvent(event: any) {
    this.resizeCanvas();
  }

  ngOnInit() {
    if (this.ident) {
      this.service.ident = this.ident;
    }

    if (this.viewScale) {
      this.service.viewScale = this.viewScale;
    }
    if (this.pdfScale) {
      this.service.pdfScale = this.pdfScale;
    }

    // this.service.itemsUpdated.subscribe(evt => {
    //   console.log('Updated', evt);
    // this.service.allItems = evt;
    // });

    Promise.all([
      this._helperService.loadScript('pdfkit'),
      this._helperService.loadScript('blobstream'),
      this._helperService.loadScript('svgtopdf'),
    ]).then(() => {

    }, (err: Error) => {
      console.log('Script Load Error');
    });

  }

  resizeCanvas() {
    if (this.service.editable) {
      this.service.canvas = this.canvas;
      this.service.ctx = this.canvas.nativeElement.getContext('2d');

      this.service.ctx.canvas.height = this.imgRef.nativeElement.height;
      this.service.ctx.canvas.width = this.imgRef.nativeElement.width;
      this.service.ctx.canvas.style.height = this.imgRef.nativeElement.height;
      this.service.ctx.canvas.style.width = '100%';

      this.editBackground.nativeElement.style.height = this.canvas.nativeElement.clientHeight + 'px';
      this.draw();

    }
  }

  saveStorage() {
    this.save.emit(this.service.allItems);
  }


  itemChanged(event: any, obj: any) {
    if (!this.service.editable) {
      return;
    }
    obj = event;
    this.draw();
  }
  itemFocused(_event: any, item: IPdfWysiwygItem) {
    if (!this.service.editable) {
      return;
    }
    this.service.changeItem(item);
    this.service.hasFocus = true;
  }
  itemLost(_event: any) {
    if (!this.service.editable) {
      return;
    }
    this.service.hasFocus = false;
  }

  itemClicked(_event: any, item: IPdfWysiwygItem) {
    // if (!this.service.editable) { return; }
    if (item.t === 'cross') {
      item.obj.selected = !item.obj.selected || false;
    }
  }
  stopArrows(event: any) {
    this._stopArrows = event;
  }

  draw() {
    if (this.service.displayMode === 'edit') {
      this.service.drawObs.next(true);
      //      this.service.drawAll();
    }
    // console.log(this.service.allItems);
    // this.saveStorage();
  }

  dropEvent(event: any, dropOffsets?: any) {
    // console.log('EV', event);
    //  console.log('Offsets', dropOffsets);
    const mouseXScaled = event.event.offsetX; // / this.service.viewScale,
    const mouseYScaled = event.event.offsetY; // / this.service.viewScale,
    const mouseX = ToolUtils.roundFloat(mouseXScaled, .25, 2);
    const mouseY = ToolUtils.roundFloat(mouseYScaled, .25, 2);

    const itemX = (mouseX - dropOffsets.x) * this.viewScale;
    const itemY = (mouseY - dropOffsets.y) * this.viewScale;
    let itemW = dropOffsets.w * this.viewScale;
    let itemH = dropOffsets.h * this.viewScale;

    let url = event.data.url;
    if (event.data.uri) {
      itemW = (event.data.rect.w / 5) * this.viewScale;
      itemH = (event.data.rect.h / 5) * this.viewScale;
      url = event.data.uri;
    }
    this.service.createItem(itemX, itemY, 'image', itemW, itemH, { dataUrl: url });
    this.service.isDown = true;
    this.draw();
  }
  /*drawCircle(r) {
    if (this.service.displayMode !== 'edit') { return; }

    const item = this.service.allItems[r].obj;

    if (this.service.allItems[r].id === this.service.activeItem.id) {
      this.service.ctx.fillStyle = 'rgba(255, 30, 30, 0.25)';
    } else {
      this.service.ctx.fillStyle = 'rgba(30, 255, 30, 0.25)';
    }
    this.service.ctx.beginPath();
    this.service.ctx.arc(item.x, item.y, item.w / 2, 0, 2 * Math.PI);
    this.service.ctx.fill();
  }*/


  // Mouse Event on Canvas
  canvasEvent(event: MouseEvent) {
    if (this.service.displayMode !== 'edit') {
      return;
    }

    if (
      (event.type === 'mousemove' || event.type === 'touchmove' || event.type === 'mouseout') &&
      !this.service.isDown) {
      // Ignore mouse move Events if we're not dragging
      return;
    }

    const mouseXScaled = event.offsetX; // / this.service.viewScale,
    const mouseYScaled = event.offsetY; // / this.service.viewScale,
    const mouseX = ToolUtils.roundFloat(mouseXScaled * this.viewScale, .25, 2);
    const mouseY = ToolUtils.roundFloat(mouseYScaled * this.viewScale, .25, 2);
    // shifted = event.shiftKey;

    event.preventDefault();
    switch (event.type) {
      case 'mousedown':
      case 'touchstart':
        this.service.startX = mouseX;
        this.service.startY = mouseY;

        // if there isn't any items yet
        if (!this.service.allItems.length && this.service.toolType !== 'selection') {
          this.service.createItem(mouseX - 1, mouseY - 1, this.service.toolType);
          this.service.dragBR = true;
          this.service.isDown = true;

          // check for handles
        } else if (
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkHandleTR === 'function' &&
          this.service.activeItem.obj.checkHandleTR(mouseX, mouseY)
        ) { // TR Handle
          // console.log('Got TR');
          this.service.dragTR = true;
          this.service.isDown = true;

        } else if (
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkHandleTL === 'function' &&
          this.service.activeItem.obj.checkHandleTL(mouseX, mouseY)
        ) { // TL Handle
          // console.log('Got TL');
          this.service.dragTL = true;
          this.service.isDown = true;

        } else if (
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkHandleBR === 'function' &&
          this.service.activeItem.obj.checkHandleBR(mouseX, mouseY)
        ) { // BR Handle
          // console.log('Got BR');
          this.service.dragBR = true;
          this.service.isDown = true;

        } else if (
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkHandleBL === 'function' &&
          this.service.activeItem.obj.checkHandleBL(mouseX, mouseY)
        ) { // BL Handle
          // console.log('Got BL');
          this.service.dragBL = true;
          this.service.isDown = true;

        } else if (
          this.service.activeItem && this.service.activeItem.obj &&
          // typeof this.service.activeItem.obj.hasCollision === 'function' &&
          this.service.activeItem.obj.hasCollision(mouseX, mouseY)
        ) { // Collision
          // console.log('Got Collision');
          this.service.dragWhole = true;
          this.service.isDown = true;

        } else {
          // Try to find anything that collides
          this.service.activeItem = ToolUtils.collides(this.service.allItems, mouseX, mouseY);

          if (this.service.activeItem) {
            this.service.dragWhole = true;
            this.service.isDown = true;
          } else if (this.service.toolType !== 'selection' && !this.service.activeItem) {
            // create input on canvas click anywhere, annoying unless you want it on
            this.service.createItem(mouseX - 1, mouseY - 1, this.service.toolType);
            // if (this.service.toolType === 'textbox') {
            this.service.dragBR = true;
            this.service.isDown = true;
            // }
          }

        }

        break;
      case 'mousemove':
      case 'touchmove':
        if (!this.service.isDown) {
          return;
        }
        if (
          Math.abs(mouseX - this.service.startX) > this.service.closeEnough ||
          Math.abs(mouseY - this.service.startY) > this.service.closeEnough
        ) {
          this.service.isDrag = true;
        }

        // Swap Drag Corners
        if (this.service.dragBR &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapBRTR === 'function' &&
          this.service.activeItem.obj.checkSwapBRTR(mouseX, mouseY)) {
          this.service.dragBR = false;
          this.service.dragTR = true;
          this.service.activeItem.obj.y -= this.service.activeItem.obj.h;
        } else if (this.service.dragBR &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapBRBL === 'function' &&
          this.service.activeItem.obj.checkSwapBRBL(mouseX, mouseY)) {
          this.service.dragBR = false;
          this.service.dragBL = true;
          this.service.activeItem.obj.x -= this.service.activeItem.obj.w;
        } else if (this.service.dragTR &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapTRBR === 'function' &&
          this.service.activeItem.obj.checkSwapTRBR(mouseX, mouseY)) {
          this.service.dragTR = false;
          this.service.dragBR = true;
          this.service.activeItem.obj.y += this.service.activeItem.obj.h;
        } else if (this.service.dragTR &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapTRTL === 'function' &&
          this.service.activeItem.obj.checkSwapTRTL(mouseX, mouseY)) {
          this.service.dragTR = false;
          this.service.dragTL = true;
          this.service.activeItem.obj.x -= this.service.activeItem.obj.w;
        } else if (this.service.dragBL &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapBLTL === 'function' &&
          this.service.activeItem.obj.checkSwapBLTL(mouseX, mouseY)) {
          this.service.dragBL = false;
          this.service.dragTL = true;
          this.service.activeItem.obj.y -= this.service.activeItem.obj.h;
        } else if (this.service.dragBL &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapBLBR === 'function' &&
          this.service.activeItem.obj.checkSwapBLBR(mouseX, mouseY)) {
          this.service.dragBL = false;
          this.service.dragBR = true;
          this.service.activeItem.obj.x += this.service.activeItem.obj.w;
        } else if (this.service.dragTL &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapTLBL === 'function' &&
          this.service.activeItem.obj.checkSwapTLBL(mouseX, mouseY)) {
          this.service.dragTL = false;
          this.service.dragBL = true;
          this.service.activeItem.obj.y += this.service.activeItem.obj.h;
        } else if (this.service.dragTL &&
          this.service.activeItem && this.service.activeItem.obj &&
          typeof this.service.activeItem.obj.checkSwapTLTR === 'function' &&
          this.service.activeItem.obj.checkSwapTLTR(mouseX, mouseY)) {
          this.service.dragTL = false;
          this.service.dragTR = true;
          this.service.activeItem.obj.x += this.service.activeItem.obj.w;
        }


        // Update Drag Coords
        if (this.service.dragWhole && this.service.activeItem) {
          const diffX = mouseX - this.service.startX;
          const diffY = mouseY - this.service.startY;
          if (typeof this.service.activeItem.obj.updateDragWhole === 'function') {
            this.service.activeItem.obj.updateDragWhole(diffX, diffY);
          } else {
            this.service.activeItem.obj.x += diffX;
            this.service.activeItem.obj.y += diffY;
          }
          this.service.startX = mouseX;
          this.service.startY = mouseY;
        } else if (this.service.dragTL && this.service.activeItem) {
          if (typeof this.service.activeItem.obj.updateDragTL === 'function') {
            this.service.activeItem.obj.updateDragTL(mouseX, mouseY);
          } else {
            this.service.activeItem.obj.w += this.service.activeItem.obj.x - mouseX;
            this.service.activeItem.obj.h += this.service.activeItem.obj.y - mouseY;
            this.service.activeItem.obj.x = mouseX;
            this.service.activeItem.obj.y = mouseY;
          }
        } else if (this.service.dragTR && this.service.activeItem) {
          if (typeof this.service.activeItem.obj.updateDragTR === 'function') {
            this.service.activeItem.obj.updateDragTR(mouseX, mouseY);
          } else {
            this.service.activeItem.obj.w = Math.abs(this.service.activeItem.obj.x - mouseX);
            this.service.activeItem.obj.h += this.service.activeItem.obj.y - mouseY;
            this.service.activeItem.obj.y = mouseY;
          }
        } else if (this.service.dragBL && this.service.activeItem) {
          if (typeof this.service.activeItem.obj.updateDragBL === 'function') {
            this.service.activeItem.obj.updateDragBL(mouseX, mouseY);
          } else {
            this.service.activeItem.obj.w += this.service.activeItem.obj.x - mouseX;
            this.service.activeItem.obj.h = Math.abs(this.service.activeItem.obj.y - mouseY);
            this.service.activeItem.obj.x = mouseX;
          }
        } else if (this.service.dragBR && this.service.activeItem) {
          if (typeof this.service.activeItem.obj.updateDragBR === 'function') {
            this.service.activeItem.obj.updateDragBR(mouseX, mouseY);
          } else {
            this.service.activeItem.obj.w = Math.abs(this.service.activeItem.obj.x - mouseX);
            this.service.activeItem.obj.h = Math.abs(this.service.activeItem.obj.y - mouseY);
          }
        }

        this.draw();
        break;
      case 'touchcancel':
      case 'mouseup':
      case 'touchend':
      case 'mouseout':
        this.service.isDown = false;
        /*
        // Check collides
        if (!this.service.isDrag) {
          const colItem = ToolUtils.collides(this.service.allItems, mouseX, mouseY);
          if (colItem && this.service.activeItem !== colItem) {
            this.service.activeItem = colItem;
          }
        }
        */
        if (this.service.activeItem && typeof (this.service.activeItem.obj || {}).updateDone === 'function') {
          this.service.activeItem.obj.updateDone(mouseX, mouseY);
        }

        this.draw();
        this.service.clearDrag();
        break;
    }
  }

  // Keyboard Events on Canvas
  canvasKey(event: KeyboardEvent) {
    const key = event.keyCode;
    const shifted = event.shiftKey;
    const ctrled = event.ctrlKey;
    const alted = event.altKey;
    const moveAmt = (shifted) ? 5 : 1;

    if (!this.service.activeItem || !this.service.activeItem.obj || this._stopArrows) {
      return;
    }

    if (key === 27 && this.service.editable) {
      this.service.changeItem(null);
      this.draw();
    }

    // Move Item around with Arrow Keys, Shift increases movement to 5px
    if (key === 38 && alted) {
      this.service.activeItem.obj.h -= moveAmt;
    } else if (key === 38) {
      this.service.activeItem.obj.y -= moveAmt;
    } else if (key === 40 && alted) {
      this.service.activeItem.obj.h += moveAmt;
    } else if (key === 40) {
      this.service.activeItem.obj.y += moveAmt;
    } else if (key === 37 && alted) {
      this.service.activeItem.obj.w -= moveAmt;
    } else if (key === 37) {
      this.service.activeItem.obj.x -= moveAmt;
    } else if (key === 39 && alted) {
      this.service.activeItem.obj.w += moveAmt;
    } else if (key === 39) {
      this.service.activeItem.obj.x += moveAmt;
    }

    // Redraw if arrow keys or delete key pressed
    if ([37, 38, 39, 40].indexOf(key) > -1) {
      this.draw();
    }

    // poor attempt at an undo
    if (ctrled && key === 90) {
      // Ctrl-Z
      alert('Haha, Undo is for whimps!');
    } else if (ctrled && key === 67) {
      this.service.copyItem(this.service.activeItem);
    }
  }

  // eslint-disable-next-line max-lines
}
