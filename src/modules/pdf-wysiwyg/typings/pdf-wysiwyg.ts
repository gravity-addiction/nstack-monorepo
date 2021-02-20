import { IPdfWysiwygCross } from '../models/i-pdf-wysiwyg-cross';
import { IPdfWysiwygEllipse } from '../models/i-pdf-wysiwyg-ellipse';
import { IPdfWysiwygImage } from '../models/i-pdf-wysiwyg-image';
import { IPdfWysiwygItem } from '../models/i-pdf-wysiwyg-item';
import { IPdfWysiwygLine } from '../models/i-pdf-wysiwyg-line';
import { IPdfWysiwygNumCircle } from '../models/i-pdf-wysiwyg-num-circle';
import { IPdfWysiwygTextbox } from '../models/i-pdf-wysiwyg-textbox';

export type TPdfWysiwygToolTypes = 'num-circle' | 'cross' | 'textbox' | 'image' | 'line' | 'ellipse' | 'selection';

export interface IPdfWysiwygToolTypes {
  'num-circle': IPdfWysiwygNumCircle;
  'cross': IPdfWysiwygCross;
  'textbox': IPdfWysiwygTextbox;
  'image': IPdfWysiwygImage;
  'line': IPdfWysiwygLine;
  'ellipse': IPdfWysiwygEllipse;
  'selection': any;
}

export interface IPdfWysiwygPage {
  allItems: IPdfWysiwygItem[];
  layout: string;
  svg: string;
}
