var dest = "./build";
var src = './src';
var assets = dest + '/assets';

module.exports = {
  sass: {
    src: src + "/stylesheets/**/*.scss",
    dest: assets,
    includes: {
      includePaths: [
        require('node-bourbon').includePaths,
        require('css-patterns').includePaths
      ]
    },
    opts: {
      dev: {
        sourceComments: 'map', 
        sourceMap: 'sass'
      },
      build: {
        outputStyle: 'compressed'
      }
    }
  },
  images: {
    src: src + "/images/**",
    dest: assets + "/images"
  },
  markup: {
    src: src + "/htdocs/**",
    dest: dest,
    opts: {
      ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
      batch : [src + "/htdocs/partials"]
    }
  },
  audio: {
    src: src + "/audio/**",
    dest: dest + "/audio/"
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/javascripts/application.js',
      dest: assets,
      outputName: 'application.js'
    }]
  }
};
