import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function PlannerMini() {
  return (
    <div style={{ overflow: "hidden", height: "400px", width: "291px" }}>
  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    headerToolbar={{
      left: "prev,next",
      center: "title",
      right: ""
    }}
    height="300px"
    contentHeight={200}
    aspectRatio={1.6}
    handleWindowResize={false}
  />
</div>

  );
}
