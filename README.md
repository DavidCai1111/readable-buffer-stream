# readable-buffer-stream
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/DavidCai1993/readable-buffer-stream.svg?branch=master)](https://travis-ci.org/DavidCai1993/readable-buffer-stream)
[![Coverage Status](https://coveralls.io/repos/github/DavidCai1993/readable-buffer-stream/badge.svg?branch=master)](https://coveralls.io/github/DavidCai1993/readable-buffer-stream?branch=master)

Create readable stream which stores data in Buffer.

## Installation

```sh
npm install readable-buffer-stream
```

## Usage

```js
'use strict'
const BufferStream = require('readable-buffer-stream')

let bufferStream = new BufferStream()

bufferStream.on('data', (data) => {
  console.log(Buffer.isBuffer(data)) // true
})

bufferStream.put(new Buffer('buffer'))
bufferStream.put(new Buffer('another buffer'))
```

## API

### BufferStream({initialSize, chunkSize, incrementSize})

  - initialSize: `Number` initial size of inner buffer.
  - chunkSize: `Number` size of data in each `data` event.
  - incrementSize: `Number` size to increase when inner buffer do not have enough size.

Create a instance of `BufferStream`, which extends `stream.Readable`.

### bufferStream.put(chunk)

  - buffer: `Buffer` data to be put in the `bufferStream`.

Put `chunk` in the inner buffer.

### bufferStream.stop()

Stop the `bufferStream`.
