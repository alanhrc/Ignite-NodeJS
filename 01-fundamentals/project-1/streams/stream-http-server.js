import http from 'node:http'
import { Transform } from 'node:stream'

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1
    console.log(transformed)
    callback(null, Buffer.from(String(transformed)))
  }
}

// req -> Readable stream
// res -> Writable stream

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await(const chunk of req) {
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers).toString()

  console.log(fullStreamContent)

  return res.end(fullStreamContent)

  // return req
  //   .pipe(new InverseNumberStream())
  //   .pipe(res)
})

server.listen(3334, () => console.log('Server running on port 3334'))
