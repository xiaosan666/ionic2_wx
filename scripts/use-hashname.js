#!/usr/bin/env node


/**
 * 根据文件内容生成hash值，然后重命名文件名
 */


var fs = require('fs'),
  path = require('path'),
  cheerio = require('cheerio'),
  revHash = require('rev-hash');

/**
 *
 * @param string fileName
 * @returns string
 */
function hashFile(file) {

  // Get file name
  var fileName = file.replace(/\.[^/.]+$/, "");
  // Get file extension
  var re = /(?:\.([^.]+))?$/;
  var fileExtension = re.exec(file)[1];

  var filePath = path.join(buildDir, file);
  var fileHash = revHash(fs.readFileSync(filePath));
  var fileNewName = `${fileName}.${fileHash}.${fileExtension}`;
  var fileNewPath = path.join(buildDir, fileNewName);
  var fileNewRelativePath = path.join('build', fileNewName);
  //Rename file
  console.log("cache-busting.js:hashFile:Renaming " + filePath + " to " + fileNewPath);
  fs.renameSync(filePath, fileNewPath);

  return fileNewRelativePath;
}


var rootDir = path.resolve(__dirname, '../');
console.log('rootDir',rootDir);

var wwwRootDir = path.resolve(rootDir, 'www');
var buildDir = path.join(wwwRootDir, 'build');
var indexPath = path.join(wwwRootDir, 'index.html');
console.log(indexPath);
$ = cheerio.load(fs.readFileSync(indexPath, 'utf-8'));

$('head link[href="build/main.css"]').attr('href', hashFile('main.css'));
$('body script[src="build/main.js"]').attr('src', hashFile('main.js'));
$('body script[src="build/vendor.js"]').attr('src', hashFile('vendor.js'));

fs.writeFileSync(indexPath, $.html());
