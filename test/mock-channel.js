function MockChannel(host, path) {
  this.URI = {
    host: host,
    path: path
  };
}

exports.createMockChannel = function createMockChannel(host, path) {
  return new MockChannel(host, path);
};

