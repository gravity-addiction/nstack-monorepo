import { NativeScriptConfig } from '@nativescript/core';

export default {
	id: 'com.skydiveorbust.website.app',
  appPath: 'projects/com-skydiveorbust/src',
	appResourcesPath: 'App_Resources',
	android: {
		v8Flags: '--expose_gc',
		markingMode: 'none'
	},
  webpackConfigPath: '../../webpack-tns.config.js',
} as NativeScriptConfig;
