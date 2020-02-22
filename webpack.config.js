const webpack =require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotenvWebpack = require('dotenv-webpack');

const isDevelopment = process.env.NODE_ENV === 'development';

const webpackConfig = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: "eval-source-map",
    entry: {
        app: path.join(__dirname, './src/app/containers/App/App.tsx'),

    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ["*", ".js", ".ts", ".tsx", ".scss"]
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: '/node_modules/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        compress: true,
        port: 9000
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Jobsity Calendar",
            meta: {
                charset: 'utf-8',
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            },
            filename: 'index.html',
            template: './src/static/index.html',
            hash: true
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),

        new DotenvWebpack({
            path:  path.join(__dirname, `./.env`)
        }),
    ],

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            {
                test: /\.module\.s?css$/i,
                include: path.join(__dirname, 'src'),
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: '@teamsupercell/typings-for-css-modules-loader',
                        options: {
                            formatter: 'prettier'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.s?css$/i,
                include: path.join(__dirname, 'src'),
                exclude: /\.module\.s?css$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
        ]
    },
};

module.exports = webpackConfig;