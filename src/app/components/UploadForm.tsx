'use client'
import { useState } from 'react'
import SaveAs from '@/app/components/SaveAs'
import formAction from '@/app/action'
import Button from '@components/Button'
import Input from '@components/Input'

export default function UploadForm() {
  const [isConverted, setIsConverted] = useState<boolean>(false)
  const [convertedData, setConvertedData] = useState<string>('')
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  return (
    <div className="container mx-auto flex justify-center p-4">
      {isError && (
        <h1 className="text-center text-2xl font-bold text-red-700">
          {errorMsg}
        </h1>
      )}
      {!isConverted && (
        <form
          action={async (formData) => {
            try {
              await formAction(formData).then((result: string | unknown) => {
                setIsConverted(true)
                if (typeof result === 'string') setConvertedData(result)
              })
            } catch (error: any) {
              setIsError(true)
              setErrorMsg(error.message)
            }
          }}
          className="mb-4 flex flex-col"
        >
          <Input />
          <Button>Convert</Button>
        </form>
      )}
      {isConverted && <SaveAs data={convertedData} />}
    </div>
  )
}
