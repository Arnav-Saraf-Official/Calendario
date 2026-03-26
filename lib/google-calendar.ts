import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
);

export async function getGoogleCalendarClient(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function getOrCreateStudyCalendar(accessToken: string) {
  const calendar = await getGoogleCalendarClient(accessToken);
  
  const calendarList = await calendar.calendarList.list();
  const existingCalendar = calendarList.data.items?.find(
    (cal) => cal.summary === 'StudyFlow'
  );

  if (existingCalendar) {
    return existingCalendar.id;
  }

  const newCalendar = await calendar.calendars.insert({
    requestBody: {
      summary: 'StudyFlow',
      description: 'Calendar for high school assignments and study sessions',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  return newCalendar.data.id;
}

export async function fetchCalendarEvents(accessToken: string, calendarId: string) {
  const calendar = await getGoogleCalendarClient(accessToken);
  const response = await calendar.events.list({
    calendarId: calendarId,
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  return response.data.items || [];
}

export async function createCalendarEvent(accessToken: string, calendarId: string, event: any) {
  const calendar = await getGoogleCalendarClient(accessToken);
  return await calendar.events.insert({
    calendarId: calendarId,
    requestBody: event,
  });
}
