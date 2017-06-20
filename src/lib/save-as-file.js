// ref: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side

const downloadFile = (url, filename) => {
  let link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const saveAsFile = (blob, filename) => {
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    downloadFile(URL.createObjectURL(blob), filename)
  }
}

export { downloadFile, saveAsFile }
export default saveAsFile
