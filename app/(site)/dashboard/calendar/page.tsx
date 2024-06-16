/* eslint-disable @next/next/no-img-element */
'use client';
import { Schedule } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import de from 'date-fns/locale/de';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { find } from 'lodash';
import { useEffect, useState } from 'react';
import { Calendar as BigCalendar, SlotInfo, View, Views, dateFnsLocalizer } from 'react-big-calendar';
import { apiUrl } from '@/util/js-helper';
import { ScheduleType } from '@/types';
import NewSchedule from '@/components/schedule/NewSchedule';

const locales = {
    'de': de,
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locale: 'de',
    locales
});

const Calendar = () => {
    const [showMore, setShowMore] = useState(false);
    const [currentView, setCurrentView] = useState<View>(Views.WEEK);
    const [display, setDisplay] = useState(false);
    const [events, setEvents] = useState<Array<ScheduleType>>([]);
    const [currentSlotInfo, setCurrentSlotInfo] = useState<SlotInfo>();

    useEffect(() => {
        axios
            .get(apiUrl("schedule"))
            .then((e: AxiosResponse) => {
                const ev: Schedule[] = e.data;
                ev.map((e) => {
                    e.start = new Date(e.start);
                    e.end = new Date(e.end);
                });
                setEvents(ev);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const handleSelectSlot = (slotInfo: SlotInfo): void => {
        console.log(slotInfo);
        setCurrentSlotInfo(slotInfo);
        setDisplay(true);
    };

    const handleOnView = (view: View): void => {
        setCurrentView(view);
    };

    const onEventCreate = (newSchedule: ScheduleType) => {
        newSchedule.start = new Date(newSchedule.start);
        newSchedule.end = new Date(newSchedule.end);
        setEvents((current) => {
            if (find(current, { id: newSchedule.id })) {
                return current;
            }

            return [newSchedule, ...current];
        });
    };

    return (
        <div className="w-full">
            <div className="grid">
                <div className="tile-card col-12 xl:col-12">
                    <NewSchedule display={display} setDisplay={setDisplay} slotInfo={currentSlotInfo} callback={onEventCreate} />
                    <BigCalendar
                        localizer={localizer}
                        culture={'de'}
                        events={events}
                        style={{ height: 500 }}
                        onShowMore={(events, date) => console.log(events, date)}
                        view={currentView}
                        defaultView={Views.MONTH}
                        onView={handleOnView}
                        onSelectSlot={handleSelectSlot}
                        selectable
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendar;
