import { useState, useEffect } from 'react'

interface Props {
  file: {
    name: string
  }
}

const srcPrefix = '/static/images/fileIcons/' // files命名 与 .gitignore 配置冲突
export const getFileIconSrc = (filename: string): string => {
  let fname = (filename || '').toLowerCase()
  let fileIcon = `unsupport_file.png`

  if (/\.docx?/.test(fname)) {
    fileIcon = 'doc.png'
  }

  if (/\.dwg/.test(fname)) {
    fileIcon = 'dwg.png'
  }

  if (/\.ifc/.test(fname)) {
    fileIcon = 'ifc.png'
  }

  if (/\.jp(e?)g|gif|png/.test(fname)) {
    fileIcon = 'jpg.png'
  }

  if (/\.nwd/.test(fname)) {
    fileIcon = 'nwd.png'
  }

  if (/\.pdf/.test(fname)) {
    fileIcon = 'pdf.png'
  }

  if (/\.pptx?/.test(fname)) {
    fileIcon = 'ppt.png'
  }

  if (/\.rvt/.test(fname)) {
    fileIcon = 'rvt.png'
  }

  if (/\.skp/.test(fname)) {
    fileIcon = 'skp.png'
  }

  if (/\.xlsx?/.test(fname)) {
    fileIcon = 'xls.png'
  }

  return `${srcPrefix}${fileIcon}`
}

const FileIcon = (props: Props) => {
  const { file } = props
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (file) {
      const fileIconSrc = getFileIconSrc(file.name)
      setSrc(fileIconSrc)
    }
  }, [file])

  if (!file) {
    return null
  }

  return <img src={src} style={{ width: 20, height: 20 }} />
}

export default FileIcon
