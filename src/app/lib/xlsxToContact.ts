// import fs from "fs";
import * as xlsx from 'xlsx'
class WrongExcelFormat extends Error {
  constructor(message: string) {
    super(`Wrong Excel Format: ${message}`)
  }
}
type Result = string | WrongExcelFormat
export default function xlsToContact(buffer: Buffer): Result {
  function createVcf(contactData: Record<string, any>) {
    // Create a string to represent the vCard
    let vcardContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactData.clientName}`

    // Determine if there is a home address
    let hasHomeAddress = false

    // Create the address by concatenating clientAddress and clientCity
    const homeAddress = `${contactData.clientAddress} ${contactData.clientCity}`

    // Iterate through the contact data and add relevant fields to vCard
    for (const [field, value] of Object.entries(contactData)) {
      // Skip empty fields, the clientName (already added as FN), and fields with value '0'
      if (value && field !== 'id' && field !== 'clientName' && value !== '0') {
        // Convert telephone number to a valid vCard format
        if (field === 'clientTelephone') {
          const formattedNumber = (value as string).replace(/\D/g, '') // Remove non-numeric characters
          const phoneNumber = formattedNumber.startsWith('0')
            ? '+33' + formattedNumber.slice(1)
            : formattedNumber
          vcardContent += `\nTEL;TYPE=CELL:${phoneNumber}`
        } else if (
          field === 'clientAddress' ||
          (field === 'clientCity' && value)
        ) {
          hasHomeAddress = true
        }
      }
    }

    // Add the home address if it exists
    if (hasHomeAddress) {
      vcardContent += `\nADR;TYPE=HOME:;;${homeAddress};;;`
    }

    // Add the vCard end marker
    vcardContent += '\nEND:VCARD'

    return vcardContent
  }

  try {
    // Load the Excel file from buffer
    const workbook = xlsx.read(buffer)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    // Get column names from the first row
    const columnNames = Object.keys(sheet)
      .filter((key) => key.endsWith('1'))
      .map((key) => sheet[key].v)

    // Print columnNames for debugging
    // console.log(columnNames);

    // Accumulate vCard content for all contacts
    let mergedVcardContent = ''

    // Iterate through each row in the Excel file
    // Iterate through each row in the Excel file
    for (let rowNum = 2; sheet[`A${rowNum}`]; rowNum++) {
      const contactData: Record<string, any> = {}
      for (let i = 0; i < columnNames.length; i++) {
        const colNum = i
        const colName = columnNames[i]
        const cell = sheet[`${String.fromCharCode(65 + colNum)}${rowNum}`]
        contactData[colName] = cell ? cell.v : ''
      }

      // Print contactData for debugging
      // console.log(contactData);

      // Call the function to create the vCard content for the current contact
      const contactVcardContent = createVcf(contactData)

      // Accumulate vCard content
      mergedVcardContent += `${contactVcardContent}\n\n`
    }
    // OTPION: Save the merged vCard content to a file
    // fs.writeFileSync('merged_contacts.vcf', mergedVcardContent);

    return mergedVcardContent
  } catch (error: any) {
    throw new WrongExcelFormat(error.message)
  }
}
