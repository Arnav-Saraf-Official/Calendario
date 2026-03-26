import { auth } from '@/auth';
import { getGoogleCalendarClient, getOrCreateStudyCalendar } from '@/lib/google-calendar';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 });
  }

  try {
    const calendarId = await getOrCreateStudyCalendar(session.accessToken as string);
    const calendar = await getGoogleCalendarClient(session.accessToken as string);
    
    const response = await calendar.events.list({
      calendarId: calendarId!,
      timeMin: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Map events to include our custom metadata from extendedProperties
    const events = response.data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description,
      type: event.extendedProperties?.private?.type || 'event',
      metadata: event.extendedProperties?.private || {},
    })) || [];

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const { type, ...data } = await request.json();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const calendarId = await getOrCreateStudyCalendar(session.accessToken as string);
    const calendar = await getGoogleCalendarClient(session.accessToken as string);
    
    const eventBody: any = {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: data.start,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: data.end,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      extendedProperties: {
        private: {
          type: type, // 'event', 'assignment', or 'hobby'
          ...data.metadata,
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: calendarId!,
      requestBody: eventBody,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
