module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1592308719448, function(require, module, exports) {
var jsonFile = require('jsonfile')
var json = require('./json')

var fse = {}
var fs = require("graceful-fs")

//attach fs methods to fse
Object.keys(fs).forEach(function(key) {
  var func = fs[key]
  if (typeof func == 'function')
    fse[key] = func
})
fs = fse

var copy = require('./copy')
fs.copy = copy.copy
fs.copySync = copy.copySync

var remove = require('./remove')
fs.remove = remove.remove
fs.removeSync = remove.removeSync
fs['delete'] = fs.remove
fs.deleteSync = fs.removeSync

var mkdir = require('./mkdir')
fs.mkdirs = mkdir.mkdirs
fs.mkdirsSync = mkdir.mkdirsSync
fs.mkdirp = fs.mkdirs
fs.mkdirpSync = fs.mkdirsSync

var create = require('./create')
fs.createFile = create.createFile
fs.createFileSync = create.createFileSync

fs.ensureFile = create.createFile
fs.ensureFileSync = create.createFileSync
fs.ensureDir = mkdir.mkdirs
fs.ensureDirSync = mkdir.mkdirsSync


var move = require('./move')
fs.move = function(src, dest, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts
    opts = {}
  }

  if (opts.mkdirp == null) opts.mkdirp = true
  if (opts.clobber == null) opts.clobber = false

  move(src, dest, opts, callback)
}


var output = require('./output')
fs.outputFile = output.outputFile
fs.outputFileSync = output.outputFileSync


fs.readJsonFile = jsonFile.readFile
fs.readJSONFile = jsonFile.readFile
fs.readJsonFileSync = jsonFile.readFileSync
fs.readJSONFileSync = jsonFile.readFileSync

fs.readJson = jsonFile.readFile
fs.readJSON = jsonFile.readFile
fs.readJsonSync = jsonFile.readFileSync
fs.readJSONSync = jsonFile.readFileSync

fs.outputJsonSync = json.outputJsonSync
fs.outputJSONSync = json.outputJsonSync
fs.outputJson = json.outputJson
fs.outputJSON = json.outputJson

fs.writeJsonFile = jsonFile.writeFile
fs.writeJSONFile = jsonFile.writeFile
fs.writeJsonFileSync = jsonFile.writeFileSync
fs.writeJSONFileSync = jsonFile.writeFileSync

fs.writeJson = jsonFile.writeFile
fs.writeJSON = jsonFile.writeFile
fs.writeJsonSync = jsonFile.writeFileSync
fs.writeJSONSync = jsonFile.writeFileSync


module.exports = fs

jsonFile.spaces = 2 //set to 2
module.exports.jsonfile = jsonFile //so users of fs-extra can modify jsonFile.spaces


}, function(modId) {var map = {"./json":1592308719449,"./copy":1592308719451,"./remove":1592308719454,"./mkdir":1592308719450,"./create":1592308719453,"./move":1592308719455,"./output":1592308719456}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719449, function(require, module, exports) {
var fs = require('graceful-fs')
var path = require('path')
var jsonFile = require('jsonfile')
var mkdir = require('./mkdir')

function outputJsonSync(file, data) {
  var dir = path.dirname(file)

  if (!fs.existsSync(dir))
    mkdir.mkdirsSync(dir)

  jsonFile.writeFileSync(file, data)
}

function outputJson(file, data, callback) {
  var dir = path.dirname(file)

  fs.exists(dir, function(itDoes) {
    if (itDoes) return jsonFile.writeFile(file, data, callback)

    mkdir.mkdirs(dir, function(err) {
      if (err) return callback(err)
      jsonFile.writeFile(file, data, callback)
    })
  })
}

module.exports = {
  outputJsonSync: outputJsonSync,
  outputJson: outputJson
}

}, function(modId) { var map = {"./mkdir":1592308719450}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719450, function(require, module, exports) {
var fs = require('graceful-fs')
var path = require('path')

var octal_0777 = parseInt('0777', 8)

function mkdirs(p, opts, f, made) {
  if (typeof opts === 'function') {
    f = opts
    opts = {}
  }
  else if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  var mode = opts.mode
  var xfs = opts.fs || fs

  if (mode === undefined) {
    mode = octal_0777 & (~process.umask())
  }
  if (!made) made = null

  var cb = f || function () {}
  p = path.resolve(p)

  xfs.mkdir(p, mode, function (er) {
    if (!er) {
      made = made || p
      return cb(null, made)
    }
    switch (er.code) {
      case 'ENOENT':
        if (path.dirname(p) == p) return cb(er)
        mkdirs(path.dirname(p), opts, function (er, made) {
          if (er) cb(er, made)
          else mkdirs(p, opts, cb, made)
        })
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        xfs.stat(p, function (er2, stat) {
          // if the stat fails, then that's super weird.
          // let the original error be the failure reason.
          if (er2 || !stat.isDirectory()) cb(er, made)
          else cb(null, made)
        })
        break
    }
  })
}

function mkdirsSync (p, opts, made) {
  if (!opts || typeof opts !== 'object') {
    opts = { mode: opts }
  }

  var mode = opts.mode
  var xfs = opts.fs || fs

  if (mode === undefined) {
    mode = octal_0777 & (~process.umask())
  }
  if (!made) made = null

  p = path.resolve(p)

  try {
    xfs.mkdirSync(p, mode)
    made = made || p
  }
  catch (err0) {
    switch (err0.code) {
      case 'ENOENT' :
        made = mkdirsSync(path.dirname(p), opts, made)
        mkdirsSync(p, opts, made)
        break

      // In the case of any other error, just see if there's a dir
      // there already.  If so, then hooray!  If not, then something
      // is borked.
      default:
        var stat
        try {
          stat = xfs.statSync(p)
        }
        catch (err1) {
          throw err0
        }
        if (!stat.isDirectory()) throw err0
        break
    }
  }

  return made
}

module.exports = {
  mkdirs: mkdirs,
  mkdirsSync: mkdirsSync
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719451, function(require, module, exports) {
var fs = require('graceful-fs')
var path = require('path')
var ncp = require('./_copy').ncp
var mkdir = require('./mkdir')
var create = require('./create')

var BUF_LENGTH = 64 * 1024
var _buff = new Buffer(BUF_LENGTH)

var copyFileSync = function(srcFile, destFile) {
  var fdr = fs.openSync(srcFile, 'r')
  var stat = fs.fstatSync(fdr)
  var fdw = fs.openSync(destFile, 'w', stat.mode)
  var bytesRead = 1
  var pos = 0

  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw, _buff, 0, bytesRead)
    pos += bytesRead
  }

  fs.closeSync(fdr)
  fs.closeSync(fdw)
}

function copy(src, dest, options, callback) {
  if( typeof options == "function" && !callback) {
    callback = options
    options = {}
  } else if (typeof options == "function" || options instanceof RegExp) {
    options = {filter: options}
  }
  callback = callback || function(){}

  fs.lstat(src, function(err, stats) {
    if (err) return callback(err)

    var dir = null
    if (stats.isDirectory()) {
      var parts = dest.split(path.sep)
      parts.pop()
      dir = parts.join(path.sep)
    } else {
      dir = path.dirname(dest)
    }

    fs.exists(dir, function(dirExists) {
      if (dirExists) return ncp(src, dest, options, callback)
      mkdir.mkdirs(dir, function(err) {
        if (err) return callback(err)
        ncp(src, dest, options, callback)
      })
    })
  })
}

function copySync(src, dest, options) {
  if (typeof options == "function" || options instanceof RegExp) {
    options = {filter: options}
  }

  options = options || {}
  options.recursive = !!options.recursive

  options.filter = options.filter || function() { return true }

  var stats = options.recursive ? fs.lstatSync(src) : fs.statSync(src)
  var destFolder = path.dirname(dest)
  var destFolderExists = fs.existsSync(destFolder)
  var performCopy = false

  if (stats.isFile()) {
    if (options.filter instanceof RegExp) performCopy = options.filter.test(src)
    else if (typeof options.filter == "function") performCopy = options.filter(src)

    if (performCopy) {
      if (!destFolderExists) mkdir.mkdirsSync(destFolder)
      copyFileSync(src, dest)
    }
  }
  else if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) mkdir.mkdirsSync(dest)
    var contents = fs.readdirSync(src)
    contents.forEach(function(content) {
      copySync(path.join(src, content), path.join(dest, content), {filter: options.filter, recursive: true})
    })
  }
  else if (options.recursive && stats.isSymbolicLink()) {
    var srcPath = fs.readlinkSync(src)
    fs.symlinkSync(srcPath, dest)
  }
}

module.exports = {
  copy: copy,
  copySync: copySync
}


}, function(modId) { var map = {"./_copy":1592308719452,"./mkdir":1592308719450,"./create":1592308719453}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719452, function(require, module, exports) {
// imported from ncp (this is temporary, will rewrite)

var fs = require('graceful-fs')
var path = require('path')

function ncp (source, dest, options, callback) {
  var cback = callback

  if (!callback) {
    cback = options
    options = {}
  }

  var basePath = process.cwd()
  var currentPath = path.resolve(basePath, source)
  var targetPath = path.resolve(basePath, dest)

  var filter = options.filter
  var transform = options.transform
  var clobber = options.clobber !== false
  var dereference = options.dereference

  var errs = null
  
  var started = 0
  var finished = 0
  var running = 0
  // this is pretty useless now that we're using graceful-fs
  // consider removing
  var limit = options.limit || 512

  startCopy(currentPath)
  
  function startCopy(source) {
    started++
    if (filter) {
      if (filter instanceof RegExp) {
        if (!filter.test(source)) {
          return cb(true)
        }
      }
      else if (typeof filter === 'function') {
        if (!filter(source)) {
          return cb(true)
        }
      }
    }
    return getStats(source)
  }

  function getStats(source) {
    var defer = global.setImmediate || process.nextTick
    var stat = dereference ? fs.stat : fs.lstat
    if (running >= limit) {
      return defer(function () {
        getStats(source)
      })
    }
    running++
    stat(source, function (err, stats) {
      var item = {}
      if (err) {
        return onError(err)
      }

      // We need to get the mode from the stats object and preserve it.
      item.name = source
      item.mode = stats.mode
      item.mtime = stats.mtime //modified time
      item.atime = stats.atime //access time

      if (stats.isDirectory()) {
        return onDir(item)
      }
      else if (stats.isFile()) {
        return onFile(item)
      }
      else if (stats.isSymbolicLink()) {
        // Symlinks don't really need to know about the mode.
        return onLink(source)
      }
    })
  }

  function onFile(file) {
    var target = file.name.replace(currentPath, targetPath)
    isWritable(target, function (writable) {
      if (writable) {
        copyFile(file, target)
      } else {
        if(clobber) {
          rmFile(target, function () {
            copyFile(file, target)
          })
        } else {
          cb()
        }
      }
    })
  }

  function copyFile(file, target) {
    var readStream = fs.createReadStream(file.name),
        writeStream = fs.createWriteStream(target, { mode: file.mode })
    
    readStream.on('error', onError)
    writeStream.on('error', onError)
    
    if(transform) {
      transform(readStream, writeStream, file)
    } else {
      writeStream.on('open', function() {
        readStream.pipe(writeStream)
      })
    }

    //presumably old node then
    var eventName = global.setImmediate ? 'finish' : 'close'
    writeStream.once(eventName, function() {
      cb()
    })
  }

  function rmFile(file, done) {
    fs.unlink(file, function (err) {
      if (err) {
        return onError(err)
      }
      return done()
    })
  }

  function onDir(dir) {
    var target = dir.name.replace(currentPath, targetPath)
    isWritable(target, function (writable) {
      if (writable) {
        return mkDir(dir, target)
      }
      copyDir(dir.name)
    })
  }

  function mkDir(dir, target) {
    fs.mkdir(target, dir.mode, function (err) {
      if (err) {
        return onError(err)
      }
      copyDir(dir.name)
    })
  }

  function copyDir(dir) {
    fs.readdir(dir, function (err, items) {
      if (err) {
        return onError(err)
      }
      items.forEach(function (item) {
        startCopy(path.join(dir, item))
      })
      return cb()
    })
  }

  function onLink(link) {
    var target = link.replace(currentPath, targetPath)
    fs.readlink(link, function (err, resolvedPath) {
      if (err) {
        return onError(err)
      }
      checkLink(resolvedPath, target)
    })
  }

  function checkLink(resolvedPath, target) {
    if (dereference) {
      resolvedPath = path.resolve(basePath, resolvedPath)
    }
    isWritable(target, function (writable) {
      if (writable) {
        return makeLink(resolvedPath, target)
      }
      fs.readlink(target, function (err, targetDest) {
        if (err) {
          return onError(err)
        }
        if (dereference) {
          targetDest = path.resolve(basePath, targetDest)
        }
        if (targetDest === resolvedPath) {
          return cb()
        }
        return rmFile(target, function () {
          makeLink(resolvedPath, target)
        })
      })
    })
  }

  function makeLink(linkPath, target) {
    fs.symlink(linkPath, target, function (err) {
      if (err) {
        return onError(err)
      }
      return cb()
    })
  }

  function isWritable(path, done) {
    fs.lstat(path, function (err) {
      if (err) {
        if (err.code === 'ENOENT') return done(true)
        return done(false)
      }
      return done(false)
    })
  }

  function onError(err) {
    if (options.stopOnError) {
      return cback(err)
    }
    else if (!errs && options.errs) {
      errs = fs.createWriteStream(options.errs)
    }
    else if (!errs) {
      errs = []
    }
    if (typeof errs.write === 'undefined') {
      errs.push(err)
    }
    else { 
      errs.write(err.stack + '\n\n')
    }
    return cb()
  }

  function cb(skipped) {
    if (!skipped) running--
    finished++
    if ((started === finished) && (running === 0)) {
      if (cback !== undefined ) {
        return errs ? cback(errs) : cback(null)
      }
    }
  }
}

// todo, make this just export ncp
module.exports.ncp = ncp


}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719453, function(require, module, exports) {
var path = require('path')
var fs = require('graceful-fs')
var mkdir = require('./mkdir')

function createFile (file, callback) {
  function makeFile() {
    fs.writeFile(file, '', function(err) {
      if (err) return callback(err)
      callback()
    })
  }

  fs.exists(file, function(fileExists) {
    if (fileExists) return callback()
    var dir = path.dirname(file)
    fs.exists(dir, function(dirExists) {
      if (dirExists) return makeFile()
      mkdir.mkdirs(dir, function(err) {
        if (err) return callback(err)
        makeFile()
      })
    })
  })
}

function createFileSync (file) {
  if (fs.existsSync(file)) return

  var dir = path.dirname(file)
  if (!fs.existsSync(dir))
    mkdir.mkdirsSync(dir)

  fs.writeFileSync(file, '')
}

module.exports = {
  createFile: createFile,
  createFileSync: createFileSync
}

}, function(modId) { var map = {"./mkdir":1592308719450}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719454, function(require, module, exports) {
var rimraf = require('rimraf')

function removeSync(dir) {
  return rimraf.sync(dir)
}

function remove(dir, callback) {
  return callback ? rimraf(dir, callback) : rimraf(dir, function(){})
}

module.exports = {
  remove: remove,
  removeSync: removeSync
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719455, function(require, module, exports) {
// most of this code was written by Andrew Kelley
// licensed under the BSD license: see
// https://github.com/andrewrk/node-mv/blob/master/package.json

// this needs a cleanup

var fs = require('graceful-fs')
var ncp = require('./_copy').ncp
var path = require('path')
var rimraf = require('rimraf')
var mkdirp = require('./mkdir').mkdirs

function mv(source, dest, options, callback){
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  var shouldMkdirp = !!options.mkdirp
  var clobber = options.clobber !== false
  var limit = options.limit || 16

  if (shouldMkdirp) {
    mkdirs()
  } else {
    doRename()
  }

  function mkdirs() {
    mkdirp(path.dirname(dest), function(err) {
      if (err) return callback(err)
      doRename()
    })
  }

  function doRename() {
    if (clobber) {
      fs.rename(source, dest, function(err) {
        if (!err) return callback()

        if (err.code === 'ENOTEMPTY') {
          rimraf(dest, function(err) {
            if (err) return callback(err)
            options.clobber = false // just clobbered it, no need to do it again
            mv(source, dest, options, callback)
          })
          return
        }

        if (err.code !== 'EXDEV') return callback(err)
        moveFileAcrossDevice(source, dest, clobber, limit, callback)
      })
    } else {
      fs.link(source, dest, function(err) {
        if (err) {
          if (err.code === 'EXDEV') {
            moveFileAcrossDevice(source, dest, clobber, limit, callback)
            return
          }
          if (err.code === 'EISDIR' || err.code === 'EPERM') {
            moveDirAcrossDevice(source, dest, clobber, limit, callback)
            return
          }
          callback(err)
          return
        }
        fs.unlink(source, callback)
      })
    }
  }
}

function moveFileAcrossDevice(source, dest, clobber, limit, callback) {
  var outFlags = clobber ? 'w' : 'wx'
  var ins = fs.createReadStream(source)
  var outs = fs.createWriteStream(dest, {flags: outFlags})

  ins.on('error', function(err) {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)

    // may want to create a directory but `out` line above
    // creates an empty file for us: See #108
    // don't care about error here
    fs.unlink(dest, function() {
      // note: `err` here is from the input stream errror
      if (err.code === 'EISDIR' || err.code === 'EPERM') {
        moveDirAcrossDevice(source, dest, clobber, limit, callback)
      } else {
        callback(err)
      }
    })
  })

  outs.on('error', function(err) {
    ins.destroy()
    outs.destroy()
    outs.removeListener('close', onClose)
    callback(err)
  })

  outs.once('close', onClose)
  ins.pipe(outs)

  function onClose() {
    fs.unlink(source, callback)
  }
}

function moveDirAcrossDevice(source, dest, clobber, limit, callback) {
  var options = {
    stopOnErr: true,
    clobber: false,
    limit: limit,
  }

  function startNcp() {
    ncp(source, dest, options, function(errList) {
      if (errList) return callback(errList[0])
      rimraf(source, callback)
    })
  }

  if (clobber) {
    rimraf(dest, function(err) {
      if (err) return callback(err)
      startNcp()
    })
  } else {
    startNcp()
  }
}

module.exports = mv


}, function(modId) { var map = {"./_copy":1592308719452,"./mkdir":1592308719450}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1592308719456, function(require, module, exports) {
var path = require('path')
var fs = require('graceful-fs')
var mkdir = require('./mkdir')

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding
    encoding = 'utf8'
  }

  var dir = path.dirname(file)
  fs.exists(dir, function(itDoes) {
    if (itDoes) return fs.writeFile(file, data, encoding, callback)
    
    mkdir.mkdirs(dir, function(err) {
      if (err) return callback(err)
      
      fs.writeFile(file, data, encoding, callback)
    })
  })
}

function outputFileSync (file, data, encoding) {
  var dir = path.dirname(file)
  if (fs.existsSync(dir)) 
    return fs.writeFileSync.apply(fs, arguments)
  mkdir.mkdirsSync(dir)
  fs.writeFileSync.apply(fs, arguments)
}

module.exports = {
  outputFile: outputFile,
  outputFileSync: outputFileSync
}

}, function(modId) { var map = {"./mkdir":1592308719450}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1592308719448);
})()
//# sourceMappingURL=index.js.map