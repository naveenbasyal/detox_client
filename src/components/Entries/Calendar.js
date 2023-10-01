import React from "react";

import { addMonths, format, startOfMonth } from "date-fns";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const Calendar = ({ userProfile, entries }) => {
  const heatmapValues = entries
    .map((entry) => new Date(entry.createdAt).toISOString().slice(0, 10)) // Extract dates
    .filter((date, index, self) => self.indexOf(date) === index) // Get unique dates
    .map((uniqueDate) => ({
      date: new Date(uniqueDate),
      count: entries.filter((entry) => entry.createdAt.startsWith(uniqueDate))
        .length,
    }));
  return (
    <CalendarHeatmap
      startDate={startOfMonth(new Date(userProfile?.createdAt))}
      endDate={startOfMonth(addMonths(new Date(), 12))}
      values={heatmapValues}
      classForValue={(value) => {
        if (!value) {
          return "color-empty";
        }
        return `color-github-${value.count}`;
      }}
      showWeekdayLabels={true}
      showMonthLabels={true}
      showOutOfRangeDays={true}
      titleForValue={(value, index) => {
        if (!value) {
          return `No entries`;
        }
        return `${format(value.date, "dd-MM-yyyy")} has ${value.count} entries`;
      }}
      onClick={(value) => console.log(value)}
    />
  );
};

export default Calendar;
