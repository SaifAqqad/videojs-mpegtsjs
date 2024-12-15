/**
 * @file plugin.js
 */

import videojs from 'video.js';
import window from 'global/window';

const Html5 = videojs.getTech('Html5');
const mergeOptions = videojs.obj ? videojs.obj.merge : videojs.mergeOptions || videojs.util.mergeOptions;
const defaults = {
  mediaDataSource: {},
  config: {}
};

/**
 * Mpegts tech that simply wires up mpegts.js to a Video.js tech
 *
 * @see {@link https://github.com/xqq/mpegts.js|mpegts.js}
 */
class Mpegts extends Html5 {

  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} ready
   *        Callback function to call when the `Mpegts` Tech is ready.
   */
  constructor(options, ready) {
    options = mergeOptions(defaults, options);
    super(options, ready);
  }

  /**
    * Setter for the `Mpegts` Tech's source object.
    *
    * @param {Tech~SourceObject} [src]
    *        The source object to set on the `Mpegts` techs.
    */
  setSrc(src) {
    if (this.mpegtsPlayer) {
      // Is this necessary to change source?
      this.mpegtsPlayer.detachMediaElement();
      this.mpegtsPlayer.destroy();
    }

    const mediaDataSource = this.options_.mediaDataSource;
    const config = this.options_.config;

    mediaDataSource.type = mediaDataSource.type === undefined ? 'mpegts' : mediaDataSource.type;
    mediaDataSource.url = src;
    this.mpegtsPlayer = window.mpegts.createPlayer(mediaDataSource, config);
    this.mpegtsPlayer.attachMediaElement(this.el_);
    this.mpegtsPlayer.load();
  }

  /**
   * Dispose of mpegts.
   */
  dispose() {
    if (this.mpegtsPlayer) {
      this.mpegtsPlayer.detachMediaElement();
      this.mpegtsPlayer.destroy();
    }
    super.dispose();
  }

}

/**
 * Check if the Mpegts tech is currently supported.
 *
 * @return {boolean}
 *          - True if the Mpegts tech is supported.
 *          - False otherwise.
 */
Mpegts.isSupported = function() {

  return window.mpegts && window.mpegts.isSupported();
};

/**
 * Mpegts supported mime types.
 *
 * @constant {Object}
 */
Mpegts.formats = {
  'video/flv': 'FLV',
  'video/x-flv': 'FLV',
  'video/mp2t': 'MPEGTS'
};

/**
 * Check if the tech can support the given type
 *
 * @param {string} type
 *        The mimetype to check
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Mpegts.canPlayType = function(type) {
  if (Mpegts.isSupported() && type in Mpegts.formats) {
    return 'maybe';
  }

  return '';
};

/**
 * Check if the tech can support the given source
 *
 * @param {Object} srcObj
 *        The source object
 * @param {Object} options
 *        The options passed to the tech
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Mpegts.canPlaySource = function(srcObj, options) {
  return Mpegts.canPlayType(srcObj.type);
};

// Include the version number.
Mpegts.VERSION = '__VERSION__';

videojs.registerTech('Mpegts', Mpegts);

export default Mpegts;
