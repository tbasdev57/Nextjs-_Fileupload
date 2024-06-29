import React from 'react'
import { saveAs } from 'file-saver'
import Button from '@components/Button'

type downloadButtonProps = {
  data: string
}

export default function SaveAs({ data }: downloadButtonProps) {
  const handleDownload = () => {
    // Create a Blob from the data and trigger download
    const blob = new Blob([data], { type: 'text/x-vcard;charset=utf-8' })
    const today = new Date()
    const date =
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    const dateTime = date + '-' + time
    saveAs(blob, `${dateTime}_card.vcf`)
  }

  return <Button onClick={handleDownload}>Download</Button>
}
