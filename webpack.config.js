const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

const webpackConfig = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: "inline-source-map",
    entry: {
        app: path.join(__dirname, './src/app/containers/App/App.tsx'),

    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ["*", ".js", ".ts", ".tsx"]
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
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
        ]
    },
};

module.exports = webpackConfig;