import { AwsCtrlService } from './aws-ctrl.service';
import { FolderService } from './folder.service';
import { S3UploadService } from './s3-upload.service';

export const services = [AwsCtrlService, FolderService, S3UploadService];

export * from './aws-ctrl.service';
export * from './folder.service';
export * from './s3-upload.service';
