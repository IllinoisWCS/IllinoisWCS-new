import React, { useEffect, useState } from "react";
import EventsWindow from "@/components/EventsWindow";
import ComputerWindow from "@/components/ComputerWindow";
import UpcomingEvent from "@/components/UpcomingEvent";
import styles from "@/styles/Home.module.css";
import styles2 from "@/styles/EventDescriptionModal.module.css";
import Link from "next/link";

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsUrl =
          "https://script.google.com/macros/s/AKfycbzXcTVpPJoRs2nCW_i9NEzG_sd_qpBcPofW_-8FVUZzTUzz8HPH4ab-RmkNNxNVDZOk/exec";
        const res = await fetch(eventsUrl);
        const { events: fetchedEvents } = await res.json();
        setEvents(
          fetchedEvents
            .slice(0, 5)
            .map(({ startTime, endTime, title, location, description }) => {
              const startDate = new Date(startTime);
              const endDate = new Date(endTime);

              const dateOptions = {
                weekday: "long",
                month: "long",
                day: "2-digit",
              };
              const date = startDate.toLocaleDateString("en-US", dateOptions);

              const timeOptions = {
                hour: "numeric",
                minute: "2-digit",
              };
              const start = startDate.toLocaleTimeString("en-US", timeOptions);
              const end = endDate.toLocaleTimeString("en-US", timeOptions);

              return {
                title,
                date,
                time: `${start} - ${end}`,
                location,
                description,
              };
            }),
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.sectionContainer}>
      <h2 className={styles.header}>Upcoming Events</h2>
      <div className={styles.upcomingEventSection}>
        <div className={styles.eventContainer}>
          <div onClick={openModal}>
            <EventsWindow
              location={"Siebel CS 0211"}
              topbarColor={"#FB79C3"}
              buttonColor={"#FFCEE7"}
              hasDescription={true}
            >
              <p className={styles.eventText}>
                Come to our office to chat, ask questions, or just study!
              </p>
              <p
                className={styles.eventText}
                style={{ textDecoration: "underline" }}
              >
                Click to learn more!
              </p>
            </EventsWindow>
          </div>
          {showModal && (
            <div className={styles2.container}>
              <ComputerWindow className={styles2.window} topbarColor="#FB79C3">
                <div className={styles2.eventInfo}>
                  <h3 className={styles2.title}>Open Office</h3>
                  <Link href="/openoffice">
                    <h3 style={{ textDecoration: "underline" }}>
                      View the open office calendar
                    </h3>
                  </Link>
                </div>
                <button onClick={closeModal} className={styles2.closeButton}>
                  Close
                </button>
              </ComputerWindow>
            </div>
          )}

          {events.length === 0 ? (
            <ComputerWindow>
              <p className={`${styles.noEvents} ${styles.eventText}`}>
                No upcoming events this week. Check again next week!
              </p>
            </ComputerWindow>
          ) : (
            events.map(
              ({ title, date, time, location, description }, index) => (
                <UpcomingEvent
                  key={index}
                  title={title}
                  date={date}
                  time={time}
                  location={location}
                  description={description}
                />
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsSection;
