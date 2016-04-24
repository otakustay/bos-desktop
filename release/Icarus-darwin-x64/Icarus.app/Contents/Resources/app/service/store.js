"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var data = {};

var dump = exports.dump = function dump() {
  return Object.assign({}, data);
};

var set = exports.set = function set(key, value) {
  return data[key] = value;
};