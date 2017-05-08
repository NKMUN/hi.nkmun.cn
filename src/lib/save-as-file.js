// ref: http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side

function saveAsFile(blob, filename) {
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    let link = document.createElement('a')
    let url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export default saveAsFile
