#!/usr/bin/env node
const pkg = require('../package')
const { readFile, writeFile, stat } = require('fs')
const { resolve, dirname, basename, join } = require('path')
const mkdirp = require('mkdirp')
const program = require('commander')

const deob = require('..')
 
program
  .version(pkg.version)
  .usage('[options] <files ...>')
  .option('-i, --indent [n]', 'Output file indentation', 2)
  .option('-e, --encoding [utf8]', 'Open files with encoding', 'utf8')
  .option('-d, --dest [folder]', 'Output destination folder or file')
  .arguments('<path> [paths...]')
  .action((path, paths) => {
    paths.unshift(path)
    paths.forEach(file => {
      let sourceFile = file
      let sourceFileExt = file.replace(/.*\./, '.')
      let sourceFileName = basename(file, sourceFileExt)
      let sourceFileFilename = basename(file)
      let sourceFilePath = resolve(file)
      let destinationFilePath = program.dest
        ? join(resolve(program.dest), sourceFileFilename)
        : resolve(sourceFile.replace(sourceFileName, `${sourceFileName}.deob`))
      let destinationFolderPath = dirname(destinationFilePath)  
      readFile(sourceFilePath, program.encoding, (err, fileContents) => {
        if (err) {
          return console.log(err)
        }
        let deobfuscated = deob(fileContents, { indent_size: program.indent, unescape_strings: true })
        mkdirp(destinationFolderPath, err => {
          if (err) {
            return console.log(err)
          }
          writeFile(destinationFilePath, deobfuscated, err => {
            if (err) {
              return console.log(err)
            }
          })
        })
      })
    })
  })
program.parse(process.argv)