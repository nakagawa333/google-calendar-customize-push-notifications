type GetCalendarsMethodOptions = {
    calendarId: string,
    eventTypes?:string,
    timeMin?: string,
    timeMax?: string,
    maxResults?: number,
    singleEvents?: boolean,
    orderBy?: string
}