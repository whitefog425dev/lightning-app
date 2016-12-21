/* eslint-disable no-console, consistent-return */
/* eslint generator-star-spacing: 0 */

import 'babel-polyfill'
import os from 'os'
import webpack from 'webpack'
import packager from 'electron-packager'
import del from 'del'
import minimist from 'minimist'
import { exec } from 'child_process'
import cfg from '../lightning-webpack/webpack.config.production'
import pkg from './package.json'

import electronCfg from '../lightning-webpack/webpack.config.electron'


/**
 * First two values are node path and current script path
 * https://nodejs.org/docs/latest/api/process.html#process_process_argv
 */
const argv = minimist(process.argv.slice(2))

/**
 * Do not package node modules from 'devDependencies'
 * and 'dependencies' that are set as external
 */
const toNodePath = name => `/node_modules/${ name }($|/)`
const devDeps = Object
  .keys(pkg.devDependencies)
  .map(toNodePath)

const depsExternal = Object
  .keys(pkg.dependencies)
  .filter(name => !electronCfg.externals.includes(name))
  .map(toNodePath)


const appName = argv.name || argv.n || pkg.productName
const shouldUseAsar = argv.asar || argv.a || false
const shouldBuildAll = argv.all || false


const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '^/test($|/)',
    '^/release($|/)',
    '^/main.development.js',
  ]
  .concat(devDeps)
  .concat(depsExternal),
}

const icon = argv.icon || argv.i || 'app/app'
if (icon) DEFAULT_OPTS.icon = icon


/**
 * @desc Execute the webpack build process on given config object
 * @param {Object} cfg
 * @return {Promise}
 */
function build(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png'
      if (plat === 'darwin') extension = '.icns'
      if (plat === 'win32') extension = '.ico'

      return extension
    })(),
  }

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    'platform': plat,
    arch,
    'prune': true,
    'app-version': pkg.version || DEFAULT_OPTS.version,
    'out': `release/${ plat }-${ arch }`,
    'protocols': [{
      name: 'Lightning',
      schemes: ['lightning'],
    }],
  })

  packager(opts, cb)
}


function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err, filepath)
    console.log(`${ plat }-${ arch } finished!`)
  }
}


/** @desc Build, clear previous releases and pack new versions */
async function startPack() {
  console.log('start pack...')

  try {
    /**
     * - Build the 'Main process' and 'Renderer Process' files.
     * - Clear the ./release directory
     */
    await build(electronCfg)
    await build(cfg)
    await del('release')

    // Start the packing process
    if (shouldBuildAll) {
      // build for all platforms
      const archs = ['ia32', 'x64']
      const platforms = ['linux', 'win32', 'darwin']

      platforms.forEach((plat) => {
        archs.forEach((arch) => {
          pack(plat, arch, log(plat, arch))
        })
      })
    } else {
      // build for current platform only
      pack(os.platform(), os.arch(), log(os.platform(), os.arch()))
    }
  } catch (error) {
    console.error(error)
  }
}


const version = argv.version || argv.v
if (version) {
  DEFAULT_OPTS.version = version
  startPack()
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '1.2.0'
    } else {
      DEFAULT_OPTS.version = stdout.split('electron@')[1].replace(/\s/g, '')
    }

    startPack()
  })
}
