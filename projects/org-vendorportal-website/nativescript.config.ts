import { NativeScriptConfig } from '@nativescript/core';

export default {
	id: 'org.vendorportal.app.sanity',
  appPath: 'projects/org-vendorportal-website/src',
	appResourcesPath: 'App_Resources',
	android: {
		v8Flags: '--expose_gc',
		markingMode: 'none'
	},
  webpackConfigPath: '../../webpack-tns.config.js',
} as NativeScriptConfig;
