// src/components/AvailabilityTable.jsx
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight, Sunrise, Sun, Moon, CalendarX2 } from 'lucide-react';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// ---- Démo : générateur de disponibilités (à retirer si `availability` est fourni par l'API) ----
function generateDemoAvailability() {
  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const hours = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  for (let i = -2; i < 35; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const seed = d.getDate() + d.getMonth() * 31;
    const isSunday = d.getDay() === 0;
    const slots = hours.map((time, hIdx) => ({
      time,
      available: !isSunday && (seed * (hIdx + 3)) % 5 !== 0 && (seed + hIdx) % 7 !== 0,
    }));
    out.push({ date: dateStr, day: DAY_NAMES[d.getDay()], slots });
  }
  return out;
}

function groupByPeriod(slots) {
  const groups = { matin: [], apresmidi: [], soir: [] };
  slots.forEach((s) => {
    const h = parseInt(s.time.split(':')[0], 10);
    if (h < 12) groups.matin.push(s);
    else if (h < 18) groups.apresmidi.push(s);
    else groups.soir.push(s);
  });
  return groups;
}

const PERIODS = [
  { key: 'matin', label: 'Matin', icon: Sunrise },
  { key: 'apresmidi', label: 'Après-midi', icon: Sun },
  { key: 'soir', label: 'Soir', icon: Moon },
];

export default function AvailabilityTable({ availability: availabilityProp }) {
  const availability = useMemo(() => availabilityProp && availabilityProp.length > 0 ? availabilityProp : generateDemoAvailability(), [availabilityProp]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const availabilityMap = useMemo(() => {
    const map = {};
    availability.forEach((d) => { map[d.date] = d; });
    return map;
  }, [availability]);

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const list = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i);
      list.push({ date: d.toISOString().split('T')[0], day: daysInPrevMonth - i, inMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      const dateStr = d.toISOString().split('T')[0];
      const rec = availabilityMap[dateStr];
      const total = rec ? rec.slots.length : 0;
      const open = rec ? rec.slots.filter((s) => s.available).length : 0;
      list.push({
        date: dateStr,
        day: i,
        inMonth: true,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        hasData: !!rec,
        total,
        open,
        ratio: total > 0 ? open / total : 0,
      });
    }
    const remaining = 42 - list.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      list.push({ date: d.toISOString().split('T')[0], day: i, inMonth: false });
    }
    return list;
  }, [currentMonth, currentYear, availabilityMap, todayStr]);

  const changeMonth = (delta) => {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCurrentMonth(m);
    setCurrentYear(y);
    setSelectedSlot(null);
  };

  const goToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(todayStr);
    setSelectedSlot(null);
  };

  const selectDay = (day) => {
    if (!day.hasData || day.isPast) return;
    setSelectedDate(day.date);
    setSelectedSlot(null);
  };

  const selectedRecord = selectedDate ? availabilityMap[selectedDate] : null;
  const groups = selectedRecord ? groupByPeriod(selectedRecord.slots) : null;
  const totalOpen = selectedRecord ? selectedRecord.slots.filter((s) => s.available).length : 0;

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
  const selectedLabel = selectedDateObj
    ? `${DAY_NAMES[selectedDateObj.getDay()]} ${selectedDateObj.getDate()} ${MONTHS[selectedDateObj.getMonth()].toLowerCase()}`
    : '';

  return (
    <div className="mx-auto w-full max-w-md" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .disp { font-family: 'Barlow Condensed', system-ui, sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="rounded-[28px] border border-[#E3E7DE] bg-[#FBFCF9] shadow-[0_1px_2px_rgba(27,43,34,0.04)] overflow-hidden">

        {/* Header calendrier */}
        <div className="px-5 pt-5 pb-4 bg-[#1B2B22]">
          <div className="flex items-center justify-between">
            <button onClick={() => changeMonth(-1)} aria-label="Mois précédent"
              className="p-1.5 rounded-full text-[#F7F8F4]/60 hover:text-[#F7F8F4] hover:bg-white/10 transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <div className="disp text-2xl font-bold tracking-wide text-[#F7F8F4] leading-none">
                {MONTHS[currentMonth]} <span className="text-[#F7F8F4]/50">{currentYear}</span>
              </div>
              <button onClick={goToday} className="mt-1 text-[11px] font-medium text-[#C99A3D] hover:text-[#E0B65A] transition tracking-wide uppercase">
                Aujourd'hui
              </button>
            </div>
            <button onClick={() => changeMonth(1)} aria-label="Mois suivant"
              className="p-1.5 rounded-full text-[#F7F8F4]/60 hover:text-[#F7F8F4] hover:bg-white/10 transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 mt-4">
            {DAY_LETTERS.map((l, i) => (
              <div key={i} className="text-center text-[10px] font-semibold tracking-widest text-[#F7F8F4]/35 pb-1.5">{l}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-x-0.5 gap-y-1.5">
            {days.map((d, i) => {
              const isSelected = d.date === selectedDate;
              const disabled = !d.inMonth || !d.hasData || d.isPast;
              return (
                <button
                  key={i}
                  onClick={() => selectDay(d)}
                  disabled={disabled}
                  className={`
                    relative flex flex-col items-center justify-center rounded-xl py-1.5 transition
                    ${!d.inMonth ? 'opacity-0 pointer-events-none' : ''}
                    ${isSelected ? 'bg-[#C99A3D]' : d.hasData && !d.isPast ? 'hover:bg-white/10' : ''}
                    ${disabled && d.inMonth ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <span className={`
                    disp text-[15px] leading-none font-semibold
                    ${isSelected ? 'text-[#1B2B22]' : d.isPast || !d.hasData ? 'text-[#F7F8F4]/25' : 'text-[#F7F8F4]'}
                    ${d.isToday && !isSelected ? 'underline decoration-2 underline-offset-4 decoration-[#C99A3D]' : ''}
                  `}>
                    {d.day}
                  </span>
                  {/* Jauge de capacité — le signature element */}
                  {d.hasData && !d.isPast && (
                    <div className="mt-1 h-[3px] w-4 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.round(d.ratio * 100)}%`,
                          backgroundColor: isSelected ? '#1B2B22' : d.ratio === 0 ? '#B8544A' : d.ratio < 0.4 ? '#C99A3D' : '#5FA97E',
                        }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panneau créneaux */}
        <div className="px-5 py-4">
          {!selectedRecord ? (
            <div className="py-10 text-center">
              <CalendarX2 className="h-8 w-8 mx-auto text-[#1B2B22]/15 mb-2.5" strokeWidth={1.5} />
              <p className="text-sm font-medium text-[#1B2B22]/50">Pas de créneaux ce jour</p>
              <p className="text-xs text-[#1B2B22]/35 mt-0.5">Choisissez une date marquée dans le calendrier</p>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="disp text-xl font-semibold text-[#1B2B22] capitalize leading-none">{selectedLabel}</h3>
                <span className="mono text-xs font-medium text-[#1B2B22]/45">
                  {totalOpen} dispo{totalOpen !== 1 ? 's' : ''}
                </span>
              </div>

              {totalOpen === 0 ? (
                <div className="rounded-2xl bg-[#B8544A]/[0.06] border border-[#B8544A]/15 py-6 text-center">
                  <p className="text-sm font-medium text-[#B8544A]">Complet ce jour-là</p>
                  <p className="text-xs text-[#1B2B22]/40 mt-0.5">Essayez un autre jour dans le calendrier</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {PERIODS.map(({ key, label, icon: Icon }) => {
                    const list = groups[key];
                    if (!list.length) return null;
                    const anyOpen = list.some((s) => s.available);
                    if (!anyOpen) return null;
                    return (
                      <div key={key}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className="h-3.5 w-3.5 text-[#1B2B22]/35" strokeWidth={2} />
                          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#1B2B22]/40">{label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {list.map((slot) => {
                            const isSel = selectedSlot === slot.time;
                            if (!slot.available) {
                              return (
                                <span key={slot.time}
                                  className="mono text-xs text-[#1B2B22]/25 line-through px-3 py-1.5 rounded-lg bg-[#1B2B22]/[0.03]">
                                  {slot.time}
                                </span>
                              );
                            }
                            return (
                              <button
                                key={slot.time}
                                onClick={() => setSelectedSlot(isSel ? null : slot.time)}
                                className={`
                                  mono text-xs font-medium px-3 py-1.5 rounded-lg border transition
                                  ${isSel
                                    ? 'bg-[#1B2B22] border-[#1B2B22] text-white'
                                    : 'bg-white border-[#E3E7DE] text-[#1B2B22]/80 hover:border-[#5FA97E] hover:text-[#2F6B4F]'}
                                `}
                              >
                                {slot.time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Barre de confirmation flottante */}
        <div className={`
          overflow-hidden transition-[max-height,opacity] duration-300 ease-out
          ${selectedSlot ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="flex items-center justify-between gap-3 mx-4 mb-4 px-4 py-3 rounded-2xl bg-[#1B2B22]">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="h-4 w-4 text-[#C99A3D] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/50 leading-none capitalize truncate">{selectedLabel}</p>
                <p className="mono text-sm font-semibold text-white leading-tight mt-0.5">{selectedSlot}</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 shrink-0 rounded-xl bg-[#C99A3D] pl-3.5 pr-3 py-2 text-xs font-semibold text-[#1B2B22] hover:bg-[#E0B65A] transition">
              Réserver
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}