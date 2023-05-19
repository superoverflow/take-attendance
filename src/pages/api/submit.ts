import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from "googleapis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        },
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets'
        ]
    })

    const sheets = google.sheets({
        auth,
        version: 'v4'
    });

    const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'A1:A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [
                [body.name]
            ]
        }
    });

    return res.status(201).json({
        data: response.data
    })
}