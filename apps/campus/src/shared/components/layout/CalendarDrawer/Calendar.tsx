import { useState, useEffect } from 'react';

import {
  getDay,
  getDate,
  isThisMonth,
  isSameDay,
  getMonth,
  getYear,
  format,
  addMonths,
  isSameMonth,
  getDaysInMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Flex, Center, Box, Icon } from '@chakra-ui/react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

import './Calendar.scss';

export type CalendarProps = {
  date: Date;
  onDateChange: (newDate: Date) => void;
  events?: any[];

  daysDisabled?: number[];
};

export const Calendar = ({
  date: _date,
  events,
  daysDisabled,
  onDateChange,
  ...props
}: CalendarProps) => {
  const [date, setDate] = useState(_date);
  const [dateSelected, setDateSelected] = useState(_date);

  const firstDayOfWeek = 0;

  const onNextMonth = () => setDate(addMonths(date, 1));
  const onPrevMonth = () => setDate(addMonths(date, -1));

  const onDayClick = (day: Date) => {
    setDate(day);
    setDateSelected(day);
  };

  /**
   * Calculamos si el numero del día que guardamos en el estado es el mismo día del
   * mes que le pasamos como parámetro por day.
   *
   * Usamos la variable date para reejecutar esta función con cada cambio de estado.
   */
  const isNumberDaySelected = (day: number) =>
    isSameMonth(dateSelected, date) && getDate(dateSelected) === day;

  /**
   * Calculamos si el numero del día del mes pasado como parametro es el día de hoy.
   * Por ejemplo, si le pasamos un 2 por day, hoy es día 2 y el mes del estado 'date'
   * corresponde con el mes actual, devolveremos true.
   *
   * Usamos la variable date para reejecutar esta función con cada cambio de estado.
   */
  const isNumberDayToday = (day: number) =>
    isThisMonth(date) && getDate(new Date()) === day;

  /**
   * Calculamos si el número del día de la semana coincide con el día en el que estamos.
   * Por ejemplo, si hoy es martes (día 2) y @param day es 1, devolveremos false.
   *
   * Usamos la variable date para reejecutar esta función con cada cambio de estado.
   */
  const isNumberWeekToday = (day: number) =>
    isThisMonth(date) && getDay(new Date()) === day;

  /**
   * Calculamos si el día pasado como parámetro contiene eventos.
   */
  const hasDayEvents = (day: Date) =>
    events?.find((ev) => isSameDay(new Date(ev.date), day)) !== undefined;

  useEffect(() => {
    onDateChange(dateSelected);
  }, [dateSelected]);

  const getDayCellsForCalendar = (): {
    dayOfTheWeek: number;
    dayOfTheMonth: number;
    date: Date;
    isOtherMonth?: boolean;
  }[][] => {
    let dayOfTheWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1));
    let dayOfTheMonth = 1;
    let isOtherMonth = false;
    const totalDaysInMonth = getDaysInMonth(date);

    const weeksInCalendar = [];

    for (let i = 0; i < 5; i++) {
      // Añadimos el primer día de la semana
      const week = [];

      // Si ya hemos pasado de mes, lo guardamos para futuras referencias.
      let monthDate = isOtherMonth ? addMonths(date, +1) : date;

      // Si estamos en la primera fila del calendario y el dia 1 del mes no
      // empieza en lunes, rellenamos la semana con días del mes anterior.
      if (i === 0 && dayOfTheWeek !== firstDayOfWeek) {
        let auxDayOfWeek = firstDayOfWeek;
        const prevMonthDate = addMonths(date, -1);
        let auxDayOfMonth = getDaysInMonth(prevMonthDate) - dayOfTheWeek + 1;

        // Vamos añadiendo días hasta que el lleguemos al día 1 del mes actual.
        while (auxDayOfWeek < dayOfTheWeek) {
          const cellDate = new Date(
            getYear(prevMonthDate),
            getMonth(prevMonthDate),
            auxDayOfMonth
          );

          week.push({
            dayOfTheWeek: auxDayOfWeek++,
            dayOfTheMonth: auxDayOfMonth++,
            date: cellDate,
            isOtherMonth: true,
          });
        }
      }

      const cellDate = new Date(
        getYear(monthDate),
        getMonth(monthDate),
        dayOfTheMonth
      );

      week.push({
        dayOfTheWeek: dayOfTheWeek++,
        dayOfTheMonth: dayOfTheMonth++,
        date: cellDate,
        isOtherMonth: isOtherMonth,
      });

      // Recorreremos todos los días de la semana hasta el lunes (id 0)
      while (dayOfTheWeek < 7) {
        // Si ya hemos rellenado todos los días del mes,
        // reseteamos las variables para empezar otro mes
        if (dayOfTheMonth > totalDaysInMonth) {
          dayOfTheMonth = 1;
          isOtherMonth = true;

          // Reseteamos la variable monthDate
          monthDate = isOtherMonth ? addMonths(date, +1) : date;
        }

        const cellDate = new Date(
          getYear(monthDate),
          getMonth(monthDate),
          dayOfTheMonth
        );

        week.push({
          dayOfTheWeek: dayOfTheWeek++,
          dayOfTheMonth: dayOfTheMonth++,
          date: cellDate,
          isOtherMonth: isOtherMonth,
        });
      }

      // Reseteamos el contador de dias de la semana al domingo.
      dayOfTheWeek = firstDayOfWeek;

      // Añadimos la semana a la lista y pasamos a la siguiente fila.
      weeksInCalendar.push(week);
    }

    return weeksInCalendar;
  };

  return (
    <Flex className="calendar">
      <Flex
        className="calendar--head"
        p="10px"
        w="100%"
        bg="gray_2"
        align="center"
        roundedTop="14px"
        justify="space-between"
      >
        <Center
          p="3px"
          bg="white"
          rounded="8px"
          cursor="pointer"
          border="1px solid"
          borderColor="gray_3"
          onClick={onPrevMonth}
        >
          <Icon
            color="gray_4"
            boxSize="24px"
            _hover={{ color: 'var(--chakra-colors-primary)' }}
            as={BiLeftArrowAlt}
          />
        </Center>

        <Box fontSize="18px" fontWeight="semibold" textTransform="capitalize">
          {format(date, 'LLLL yyyy', { locale: es })}
        </Box>

        <Center
          p="3px"
          bg="white"
          rounded="8px"
          cursor="pointer"
          border="1px solid"
          borderColor="gray_3"
          onClick={onNextMonth}
        >
          <Icon
            color="gray_4"
            boxSize="24px"
            as={BiRightArrowAlt}
            _hover={{ color: 'var(--chakra-colors-primary)' }}
          />
        </Center>
      </Flex>

      <Flex className="calendar--body" roundedBottom="14px" direction="column">
        <Flex>
          <Flex w="100%" h="47px">
            {[0, 1, 2, 3, 4, 5, 6]
              .filter((n) => !daysDisabled?.includes(n))
              .map((dNum) => (
                <Flex
                  w="100%"
                  align="center"
                  justify="center"
                  p="15px 10px 14px"
                  key={`calendar-body-head-${dNum}`}
                >
                  <Box
                    w="fit-content"
                    fontSize="12px"
                    fontWeight="bold"
                    textTransform="uppercase"
                    color={isNumberWeekToday(dNum) ? 'primary' : 'gray_4'}
                  >
                    {locale.dayNamesShort[dNum]}

                    <Box
                      h="2px"
                      w="100%"
                      mt="2px"
                      bg={isNumberWeekToday(dNum) ? 'primary' : 'white'}
                    />
                  </Box>
                </Flex>
              ))}
          </Flex>
        </Flex>

        <Flex direction="column">
          {getDayCellsForCalendar().map((row, index) => (
            <Flex key={`calendar-body-row-${index}`} h="47px">
              {row
                ?.filter((n) => !daysDisabled?.includes(n.dayOfTheWeek))
                ?.map((cell, index) => (
                  <Flex
                    key={`calendar-body-cell-${index}`}
                    onClick={() => onDayClick(cell.date)}
                    className={`calendar--body--cell ${
                      cell.isOtherMonth
                        ? 'calendar--body--cell__other-month'
                        : ''
                    }`}
                  >
                    <Flex
                      className={`calendar--body--day ${
                        cell.isOtherMonth
                          ? 'calendar--body--day__other-month'
                          : isNumberDaySelected(cell.dayOfTheMonth)
                          ? 'calendar--body--day__selected'
                          : isNumberDayToday(cell.dayOfTheMonth)
                          ? 'calendar--body--day__today'
                          : ''
                      } ${
                        hasDayEvents(cell.date)
                          ? 'calendar--body--day__with-events'
                          : ''
                      }`}
                    >
                      <Box>{cell.dayOfTheMonth}</Box>

                      {hasDayEvents(cell.date) ? (
                        <Box className="calendar--body--day--event-dot" />
                      ) : (
                        <Box minH="4px" minW="4px" />
                      )}
                    </Flex>
                  </Flex>
                ))}
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

const locale = {
  firstDayOfWeek: 1,
  dayNames: [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  monthNamesShort: [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ],
  today: 'Hoy',
  clear: 'Claro',
};
