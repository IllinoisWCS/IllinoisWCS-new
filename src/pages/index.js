import Head from "next/head";
import Link from "next/link";
import React from "react";
import {Button} from "react-bootstrap";
import ComputerWindow from "@/components/ComputerWindow";
import EventsWindow from "@/components/EventsWindow";
import UpcomingEvent from "@/components/UpcomingEvent";
import styles from "@/styles/Home.module.css";
import {Inter} from "next/font/google";
import Committees from "@/pages/committees.js";

const inter = Inter({subsets: ["latin"]});

export async function getServerSideProps() {
  return {
    props: {
      events: await getEvents(),
    },
  };
}

async function getEvents() {
  const eventsUrl =
    "https://script.google.com/macros/s/AKfycbwjW5AGzBRydqUY0Bs1J6SpYbC3q4U7KY9RcJyxzLkyzUp9EyBG/exec";
  const res = await fetch(eventsUrl);
  const {events} = await res.json();
  return events.slice(0, 5).map(({startTime, endTime, title, location}) => {
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
    };
  });
}

export default function Home({events}) {
  return (
    <>
      <Head>
        <title>WCS @ UIUC</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Welcome to My Next.js App</h1>
        <h2>Welcome to My Next.js App</h2>
        <h3>Welcome to My Next.js App</h3>
        <p>Welcome to My Next.js App</p>
        <Button variant="primary">Click Me</Button>
        <br />
        <Committees>

        </Committees>
        <div className={styles.upcomingEventSection}>
          <h2 className={styles.upcomingEventHeader}>Upcoming Events▮</h2>
          <div className={styles.eventContainer}>
            <EventsWindow
              location={"Siebel CS 0211"}
              topbarColor={"#FB79C3"}
              buttonColor={"#FFCEE7"}
            >
              <p className={styles.eventText}>
                Come to our office to chat, ask questions, or just study:
              </p>
            </EventsWindow>
            {events.length === 0 ? (
              <ComputerWindow>
                <p className={`${styles.noEvents} ${styles.eventText}`}>
                  No upcoming events this week. Check again next week!
                </p>
              </ComputerWindow>
            ) : (
              events.map(({title, date, time, location}, index) => (
                <UpcomingEvent
                  key={index}
                  title={title}
                  date={date}
                  time={time}
                  location={location}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
