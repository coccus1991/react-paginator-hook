const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
    const devMode = argv.mode !== 'production'

    return {
        target: "node",
        entry: './src/react-paginator-hook.tsx',
        output: {
            path: __dirname + '/dist',
            libraryTarget: "commonjs2",
            filename: 'react-paginator-hook.js',
        },
        devtool: devMode ? 'source-map' : false,
        externals: {
            react: 'react',
            reactDOM: 'react-dom'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /module\.(sa|sc|c)ss$/,
                    use: [
                        "style-loader",
                        'css-modules-typescript-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: 'css_module_[hash:base64:8]',
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },

                {
                    test: /\.(sa|sc|c)ss$/,
                    exclude: [/module\.(sa|sc|c)ss$/],
                    use: ["style-loader", 'css-loader', 'sass-loader'],
                },

                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: [/node_modules/, '/**/*.test.tsx', '/**/*.test.ts'],
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.mjs', '.js', '.jsx'],
        },
        plugins: [
           new CleanWebpackPlugin()
        ]
    }
}
