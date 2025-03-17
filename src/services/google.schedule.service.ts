import axios from "axios";

import { getGoogleCalendarID, refreshGoogleToken } from "./user.service";
import { NewSchedule } from "../models";

const getEndTime = (startTime: string, endTime: string) => {
  if (endTime) return endTime;
  const newEndTime = new Date(startTime);
  newEndTime.setMinutes(newEndTime.getMinutes() + 10);
  return newEndTime;
};

export const postGoogleEvent = async (userID: string, scheduleData: NewSchedule) => {
  try {
    const calendarID = await getGoogleCalendarID(userID);
    const token = await refreshGoogleToken(userID);

    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`;
    const body = {
      end: { dateTime: getEndTime(scheduleData.startTime, scheduleData.endTime) },
      start: { dateTime: scheduleData.startTime },
      summary: "Agendamento",
      description: scheduleData.description,
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 10 }],
      },
      source: {
        title: "Acesse DentalEase",
        url: "https://www.dentalease.com.br/app/schedule",
      },
      transparency: "transparent",
    };
    const header = { headers: { Authorization: `Bearer ${token.accessToken}` } };

    const { data } = await axios.post(endpoint, body, header);
    return data.id;
  } catch (e) {}
};

export const updateGoogleEvent = async (userID: string, googleEventID: string, scheduleData: NewSchedule) => {
  try {
    const calendarID = await getGoogleCalendarID(userID);
    const token = await refreshGoogleToken(userID);

    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events/${googleEventID}`;
    const body = {
      end: { dateTime: getEndTime(scheduleData.startTime, scheduleData.endTime) },
      start: { dateTime: scheduleData.startTime },
      summary: "Agendamento",
      description: scheduleData.description,
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 10 }],
      },
      source: {
        title: "Acesse DentalEase",
        url: "https://www.dentalease.com.br/app/schedule",
      },
      transparency: "transparent",
    };
    const header = { headers: { Authorization: `Bearer ${token.accessToken}` } };

    const response = await axios.put(endpoint, body, header);
    if (response.status === 200) return true;

    return false;
  } catch (e) {
    return false;
  }
};

export const deleteGoogleEvent = async (userID: string, googleEventID: string) => {
  try {
    const calendarID = await getGoogleCalendarID(userID);
    const token = await refreshGoogleToken(userID);

    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events/${googleEventID}`;
    const header = { headers: { Authorization: `Bearer ${token.accessToken}` } };

    const response = await axios.delete(endpoint, header);
    if (response.status === 204) return true;

    return false;
  } catch (e) {
    return false;
  }
};
