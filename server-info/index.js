/*
 * Runtime: Node.js 8.10
 * name: server-info
 * environment:
 *  -
 */

const SERVER_TIME = new Date().toISOString();

exports.handler = async (/* event */) => ({
  serverTime: SERVER_TIME,
  pid: process.pid,
  arch: process.arch,
});
