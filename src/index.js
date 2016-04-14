'use strict'
const {Readable} = require('stream')
const SlowBuffer = require('buffer').SlowBuffer

module.exports = class ReadableBufferStream extends Readable {
  constructor ({
    initialSize = 8 * 1024,
    incrementSize = 8 * 1024,
    chunkSize = 2 * 1024
  } = {}) {
    super()
    this.chunkSize = chunkSize
    this.incrementSize = incrementSize
    this._buffer = new Buffer(initialSize)
    this._actualSize = 0
    this._stop = false
  }

  put (buffer) {
    if (this._stop) throw new Error('Can not write buffer to a stopped stream')
    if (!Buffer.isBuffer(buffer)) buffer = createBuffer(buffer)

    let size = buffer.length
    this.ensureSize(size)

    buffer.copy(this._buffer, this._actualSize)

    this._actualSize += size
    this.read(0)
  }

  _read () {
    let size = Math.min(this.chunkSize, this._actualSize)
    let buffer = new Buffer(size)

    this._buffer.copy(buffer, 0, 0, size)
    this._buffer = this._buffer.slice(size, this._actualSize)

    this._actualSize -= size
    this.push(buffer)

    if (this._actualSize === 0 && this._stop) this.push(null)
  }

  stop () {
    this._stop = true

    if (this._actualSize === 0) this.push(null)
  }

  ensureSize (size) {
    let remainSize = this._buffer.length - this._actualSize
    if (remainSize >= size) return

    let factor = Math.ceil((size - remainSize) / this.incrementSize)
    let newBuffer = new Buffer(this._buffer.length + this.incrementSize * factor)

    this._buffer.copy(newBuffer, 0, 0, this._actualSize)
    this._buffer = newBuffer
  }
}

function createBuffer (entry) {
  if (Buffer.from) return Buffer.from(entry)
  if (typeof entry === 'number') entry = String(entry)

  return new Buffer(entry)
}
