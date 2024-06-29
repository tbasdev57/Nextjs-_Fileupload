'use server'
import xlsToContact from '@lib/xlsxToContact'

class NoFileError extends Error {
  constructor() {
    super('No file uploaded')
  }
}

class WrongFileTypeError extends Error {
  constructor() {
    super('Wrong file type')
  }
}
export default async function formAction(
  data: FormData
): Promise<string | NoFileError | WrongFileTypeError> {
  try {
    const file: File = data.get('file') as File

    // logically i would check !file but it's not empty so it doesn't work to do validation, so instead i just check the size.
    if (file.size === 0) {
      throw new NoFileError()
    }
    // Define allowed file types
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ]
    if (!allowedTypes.includes(file?.type)) {
      throw new WrongFileTypeError()
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const processedData = xlsToContact(buffer)
    return processedData
  } catch (error: any) {
    if (error instanceof NoFileError || error instanceof WrongFileTypeError) {
      throw error
    } else {
      // Otherwise, handle it as a string error message
      return error.message || 'An unknown error occurred'
    }
  }
}
