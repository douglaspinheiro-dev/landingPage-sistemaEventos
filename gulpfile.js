var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var clean = require("gulp-clean");
var uglify = require("gulp-uglify");
var cssmin = require("gulp-cssmin");
var cleanCss = require('gulp-clean-css');
var concat = require("gulp-concat");
var usemin = require("gulp-usemin");
var htmlmin = require('gulp-htmlmin');
var rename = require("gulp-rename");
var rev = require('gulp-rev');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var UglifyJS = require("uglify-es");
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');
const babili = require("gulp-babili");
var stripDebug = require('gulp-strip-debug');


gulp.task("default",['copy'],function(){
	return gulp.start("build");
});

//Inicia o browserSync
gulp.task("server",function(){
	
	browserSync.init({
	    proxy: "127.0.0.1/sistemaeventos/src/",
	    ghostMode: false
	});
	gulp.watch("src/index.html").on("change",browserSync.reload);
	gulp.watch("src/index/css/*.css").on("change",browserSync.reload);
	gulp.watch("src/index/js/*.js").on("change",browserSync.reload);
});

//Limpa a pasta dist
gulp.task("clean",function(){
	return gulp.src("dist/").pipe(clean());
});

//copia os arquivos selecionados
gulp.task("copy",['clean'],function(){

	gulp.src("src/index/imagens/**/*").pipe(gulp.dest("dist/index/imagens/"));
	gulp.src("src/index/ajax/**/*").pipe(gulp.dest("dist/index/ajax/"));
	return;
});

//Builda o index, com o css e js.
gulp.task("build",function(){

	gulp.src('src/index.html')
	.pipe(usemin({
	css: [rev],
	html: [ function () {return htmlmin({ collapseWhitespace: true, removeComments: true});} ],
	//js: [ uglify, rev ],
	//js: [ stripDebug(function (){ return babili({mangle: { keepClassNames: true}})}), rev ],
	js: [ function (){ return babili({mangle: { keepClassNames: true}})},stripDebug, rev ],
	inlinejs: [ function (){ return babili({mangle: { keepClassNames: true}})} ],
	inlinecss: [ cleanCss, 'concat' ]
	}))
	.pipe(gulp.dest('dist/'));
});

