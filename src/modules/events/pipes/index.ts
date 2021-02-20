import { ClassToScoremarkPipe, ClassToScoremarkPipeModule } from './class-to-scoremark.pipe';
import { CreateDubLinkPipe, CreateDubLinkPipeModule } from './create-dub-link.pipe';
import { FilterScoremarkPipe, FilterScoremarkPipeModule } from './filter-scoremark.pipe';

export const modules = [ClassToScoremarkPipeModule, FilterScoremarkPipeModule, CreateDubLinkPipeModule];
export const pipes = [ClassToScoremarkPipe, CreateDubLinkPipe, FilterScoremarkPipe];

export * from './class-to-scoremark.pipe';
export * from './create-dub-link.pipe';
export * from './filter-scoremark.pipe';
