'use strict'
/* global describe it beforeEach */
const stream = require('stream')
const should = require('should')
const BufferStream = require('../lib/index')

describe('Readable-buffer-stream', function () {
  let bufferStream = null

  beforeEach(function () {
    bufferStream = new BufferStream({
      initialSize: 8
    })
  })

  it('Should get data through event', function (done) {
    bufferStream.on('data', (data) => {
      data.toString().should.eql('haha')
      done()
    })

    process.nextTick(() => {
      bufferStream.put(new Buffer('haha'))
    })
  })

  it('Should get data through pipe', function (done) {
    let transform = new stream.Transform({
      transform: function (chunk, encoding, next) {
        chunk.toString().should.eql('haha')
        done()
        next(null)
      }
    })

    bufferStream.pipe(transform)
    bufferStream.put('haha')
  })

  it('Should auto increase size', function () {
    bufferStream.put('hahahahahahhahahah')
    should(bufferStream._buffer.length > 8).be.true()
  })

  it('Should throw when put data after stopped', function () {
    bufferStream.stop();

    (function () { bufferStream.put('datatata') }).should.throw(/stopped/)
  })
})
