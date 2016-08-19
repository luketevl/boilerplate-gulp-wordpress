# boilerplate-gulp-wordpress
Gulp boilerplate for wordpress project


# What the project do
- Clean **css, js, img** folder
- Minify-JS
- Minify-CSS
- Minify-IMAGES
- Minify-IMAGES in **uploads** folder

## Clone the project with **submobules** in your _theme_
```
git submodule add https://github.com/luketevl/boilerplate-gulp-wordpress.git
```

## Configuration
- Change the folder theme in **.gitignore** and move for the parent wp-content
- Change the folder theme in **gulpfile**
- Create the folder **dev** in your _theme_
  - Copy yours css, js, img to **dev** _folder_

## Install the dependencies
```
npm install
```


# Tasks
- Minify css and js
```
gulp minify-css
```
- Minify the folder img in theme and uploads folder in wordpress.
```
gulp images
```
- Minify the folder **uploads**
```
gulp daily
```
- Default
  - Minify css, js, img
```
gulp
```
