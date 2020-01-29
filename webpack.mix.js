const path = require('path');
const glob = require('glob-all');
const mix = require('laravel-mix');

require('laravel-mix-purgecss');
require('laravel-mix-eslint');
require('laravel-mix-critical');

// const PATHS = {
//     templates: path.join(__dirname, 'templates'),
//     modules: path.join(__dirname, 'modules'),
//     takeoff: path.join(__dirname, 'takeoff', '/js'),
// };

const sourcePath = process.env.npm_package_config_path_src;
const publicPath = process.env.npm_package_config_path_public;

const projectName = __dirname.split('/').pop();

const sourcePaths = {
    js: path.join(sourcePath, 'js'),
    css: path.join(sourcePath, 'sass'),
    fonts: path.join(sourcePath, 'fonts'),
    docs: path.join(sourcePath, 'docs'),
    images: path.join(sourcePath, 'img'),
    webfont: path.join(sourcePath, 'icons'),
};

const publicPaths = {
    js: path.join(publicPath, 'js'),
    css: path.join(publicPath, 'css'),
    fonts: path.join(publicPath, 'fonts'),
    docs: path.join(publicPath, 'docs'),
    images: path.join(publicPath, 'img'),
    webfont: path.join(publicPath, 'fonts'),
};

mix
    .autoload({
        jquery: ['$', 'window.jQuery',"jQuery","window.$","jquery","window.jquery"]
    })
    .options({
        processCssUrls: false,
        autoprefixer: {
            options: {
                browsers: [
                    'last 2 versions'
                ]
            }
        }
    })
    .webpackConfig(
        webpack => {
            return {
                module: {
                    rules: [
                        {
                            test: /\.font\.js/,
                            use: [
                                'css-loader',
                                'webfonts-loader'
                            ]
                        }
                    ]
                },
            };
        }
    )
    .setPublicPath(publicPath)
    .babelConfig({ 'presets': ['@babel/env'] })

    //  Javascript
    //
    .js(path.join(sourcePaths.js, 'main.js'), publicPaths.js)
    .js(path.join(sourcePaths.js, 'music.js'), publicPaths.js)
    .js(path.join(sourcePaths.js, 'docs.js'), publicPaths.js)
    .js(path.join(sourcePaths.js, 'webfont.js'), publicPaths.js)
    .eslint({ cache: true })

    //  CSS
    //
    .sass(path.join(sourcePaths.css, 'main.scss'), publicPaths.css, { outputStyle: 'expanded' })
    .sourceMaps()

    .critical({
        enabled: mix.inProduction(),
        urls: [
            {
                src: `http://${projectName}.local.statik.be/docs/critical.html`,
                dest: path.join(publicPaths.css, 'critical.css')
            }
        ],
        options: {
            minify: true,
            width: 1200,
            height: 1200,
        },
    })
    // .purgeCss({
    //     enabled: true,
    //     paths: glob.sync([
    //         `${PATHS.templates}/**/*`,
    //     ], { nodir: true }),
    //     extensions: ['html', 'js', 'php', 'vue', 'twig', 'scss', 'css', 'svg', 'md'],
    //     extractorPattern: /[a-zA-Z0-9-:@_/]+/g,
    //     whitelistPatterns: [],
    // })

    //  Fonts
    //
    // .copyDirectory(sourcePaths.fonts, publicPaths.fonts)

    //  Docs
    .copyDirectory(sourcePaths.docs, publicPaths.docs)

    //  Images
    .copyDirectory(sourcePaths.images, publicPaths.images)

    .version();
