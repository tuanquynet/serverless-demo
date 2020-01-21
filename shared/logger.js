module.exports = {
  log(message, messageMeta) {
    console.log(JSON.stringify({message, message_meta: messageMeta}));
  },
  info(message, messageMeta) {
    console.log(JSON.stringify({message, message_meta: messageMeta}));
  },
  warn(message, messageMeta) {
    console.warn(JSON.stringify({message, message_meta: messageMeta}));
  },
  error(message, messageMeta) {
    console.error(JSON.stringify({message, message_meta: messageMeta}));
  },
};
