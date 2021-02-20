const { basename, resolve } = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

console.log("Config File", resolve(__dirname, "../../tsconfig.json"));
module.exports = {
    target: 'node',
    mode: 'production',
    entry: {
      governor: resolve(__dirname, './governor.ts'),
      website: resolve(__dirname, './website.ts'),
      webhooks: resolve(__dirname, './webhooks.ts')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: resolve(__dirname, "../../tsconfig.json"),
          },
          exclude: /node_modules/,
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: resolve(__dirname, 'package.json'), to: '.' },
          { from: resolve(__dirname, 'pm2-service.config.js'), to: '.' },
        ],
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@app': resolve(__dirname, '../../app'),
        '@classes': resolve(__dirname, '../../../classes'),
        '@lib': resolve(__dirname, '../../lib'),
      }
    },
    output: {
      path: resolve(__dirname, '../../../projects/', basename(__dirname), 'dist/api/'),
      filename: '[name].js'
    },
    externals: [nodeExternals()],
    };
