import { AbsPipe, AbsPipeModule } from './abs.pipe';
import { BypassTrustUrlPipe, BypassTrustUrlPipeModule } from './bypass-trust-url.pipe';
import { ByteconvertPipe, ByteconvertPipeModule } from './byteconvert.pipe';
import { EncodeURIComponentPipe } from './encodeURIComponent.pipe';
import { InchesToFeetPipe, InchesToFeetPipeModule } from './inches-to-feet.pipe';
import { KeyvaluePipe, KeyvaluePipeModule } from './keyvalue.pipe';
import { MonthNamePipe, MonthNumberPipe, MonthNamePipeModule } from './month-name.pipe';
import { OrdinalPipe, OrdinalPipeModule } from './ordinal.pipe';

// eslint-disable-next-line max-len
export const modules = [AbsPipeModule, BypassTrustUrlPipeModule, ByteconvertPipeModule, InchesToFeetPipeModule, MonthNamePipeModule, KeyvaluePipeModule, OrdinalPipeModule];
// eslint-disable-next-line max-len
export const pipes = [AbsPipe, BypassTrustUrlPipe, ByteconvertPipe, EncodeURIComponentPipe, InchesToFeetPipe, MonthNamePipe, MonthNumberPipe, KeyvaluePipe, OrdinalPipe];

export * from './abs.pipe';
export * from './bypass-trust-url.pipe';
export * from './byteconvert.pipe';
export * from './encodeURIComponent.pipe';
export * from './inches-to-feet.pipe';
export * from './keyvalue.pipe';
export * from './month-name.pipe';
export * from './ordinal.pipe';
