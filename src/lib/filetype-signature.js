export const jpg = u8 => {
  return (
    (u8[0] === 0xff && u8[1] === 0xd8 && u8[2] === 0xff)
    && (u8[3] === 0xdb || u8[3] === 0xe0 || u8[3] === 0xee || u8[3] === 0xe1)
  )
}

export const png = u8 => {
  return (
       u8[0] === 0x89
    && u8[1] === 0x50
    && u8[2] === 0x4e
    && u8[3] === 0x47
    && u8[4] === 0x0d
    && u8[5] === 0x0a
    && u8[6] === 0x1a
    && u8[7] === 0x0a
  )
}

export const checkFileSignatureIsAcceptable = (domFile, ...checks) => new Promise(resolve => {
  try {
    const reader = new FileReader()
    reader.onload = () => {
      const uint8 = new Uint8Array(reader.result)
      resolve(checks.find(check => check(uint8)))
    }
    reader.readAsArrayBuffer(domFile)
  } catch(e) {
    resolve(true)
  }
})
