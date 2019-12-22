"use strict";

require("@babel/polyfill");

const path = require("path");

const merge = require("webpack-merge");

const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devMode = process.env.NODE_ENV !== "production";

const baseConfig = require("./webpack.base");

module.exports = merge.smart(baseConfig, {
  entry: {
    app: [
      "@babel/polyfill",
      path.resolve(__dirname, "./app.ts")
    ]
  },
  module: {
    rules: [
      {
        test: /\.(t|j)(s|sx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-syntax-dynamic-import"
          ],
          presets: [
            "@babel/preset-react",
            "@babel/preset-env",
            "@babel/preset-typescript"
          ]
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode
              // if hmr does not work, this is a forceful method.
              // reloadAll: true
            }
          },
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: devMode ? "./img/[name].[ext]" : "./img/[name].[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: "url-loader",
          options: {
            // Limit at 50k. Above that it emits separate files
            limit: 50000,

            // url-loader sets mimetype if it's passed.
            // Without this it derives it from the file extension
            mimetype: "application/font-woff",

            // Output below fonts directory
            name: devMode ? "./font/[name].[ext]" : "./font/[name].[hash].[ext]"
          }
        }
      },
      {
        enforce: "pre",
        test: /\.(t|j)(s|sx)$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Canary by Feinwaru",
      template: path.resolve(__dirname, "./template.html")
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
      ignoreOrder: false
    })
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
