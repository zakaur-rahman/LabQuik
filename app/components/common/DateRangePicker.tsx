import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DateRangePicker = ({ onDateSelect }: { onDateSelect: (date: any) => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [today] = useState(new Date());
  const [displayMonths, setDisplayMonths] = useState([
    new Date(today), 
    new Date(new Date(today).setMonth(today.getMonth() + 1))
  ]);
  const [showYearSelect, setShowYearSelect] = useState([false, false]);
  const [showMonthSelect, setShowMonthSelect] = useState([false, false]);
  const calendarRef = useRef(null);

  const quickSelectOptions = [
    { label: 'Today', getValue: () => [new Date(), new Date()] },
    { label: 'Yesterday', getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return [yesterday, yesterday];
    }},
    { label: 'This Week', getValue: () => {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      const end = new Date();
      return [start, end];
    }},
    { label: 'This Month', getValue: () => {
      const start = new Date(new Date().setDate(1));
      const end = new Date();
      return [start, end];
    }},
    { label: 'Last Month', getValue: () => {
      const start = new Date(new Date().setMonth(new Date().getMonth() - 1, 1));
      const end = new Date(new Date().setDate(0));
      return [start, end];
    }}
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const generateYearRange = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const years = generateYearRange();

  const formatDate = (date: any) => {
    if (!date) return '';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const handleDateClick = (date: Date) => {
    if (isFutureDate(date)) {
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
        onDateSelect({ startDate: startDate, endDate: date });
      }
    }
  };

  const handleQuickSelect = (option: any) => {
    const [start, end] = option.getValue();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const finalEnd = end > today ? today : end;
    
    setStartDate(start);
    setEndDate(finalEnd);
    onDateSelect({ startDate: start, endDate: finalEnd });
  };

  const handleMonthChange = (index: number, monthIndex: number) => {
    const newDisplayMonths = [...displayMonths];
    const currentDate = new Date(displayMonths[index]);
    currentDate.setMonth(monthIndex);
    newDisplayMonths[index] = currentDate;
    setDisplayMonths(newDisplayMonths);
    setShowMonthSelect([false, false]);
  };

  const handleYearChange = (index: number, year: number) => {
    const newDisplayMonths = [...displayMonths];
    const currentDate = new Date(displayMonths[index]);
    currentDate.setFullYear(year);
    newDisplayMonths[index] = currentDate;
    setDisplayMonths(newDisplayMonths);
    setShowYearSelect([false, false]);
  };

  const navigateMonth = (index: number, direction: number) => {
    const newDisplayMonths = [...displayMonths];
    const currentDate = new Date(displayMonths[index]);
    currentDate.setMonth(currentDate.getMonth() + direction);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (currentDate.getFullYear() > currentYear || 
        (currentDate.getFullYear() === currentYear && currentDate.getMonth() > currentMonth)) {
      return;
    }

    newDisplayMonths[index] = currentDate;
    setDisplayMonths(newDisplayMonths);
  };

  const isInRange = (date: any) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const renderMonth = (monthDate: Date, index: number) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = (startDate && formatDate(date) === formatDate(startDate)) || 
                        (endDate && formatDate(date) === formatDate(endDate));
      const isToday = formatDate(date) === formatDate(today);
      const inRange = isInRange(date);
      const isFuture = isFutureDate(date);

      days.push(
        <div
          key={day}
          onClick={() => !isFuture && handleDateClick(date)}
          className={`
            h-6 w-6 flex text-sm items-center justify-center cursor-pointer rounded-xl
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${isToday && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
            ${inRange && !isSelected ? 'bg-blue-50' : ''}
            ${isFuture ? 'text-gray-300 cursor-not-allowed' : ''}
            ${!isSelected && !isToday && !inRange && !isFuture ? 'hover:bg-gray-100' : ''}
          `}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setDisplayMonths([new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))]);
    onDateSelect({ startDate: null, endDate: null });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !(calendarRef.current as any).contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={calendarRef}>
      <div 
        className="w-60 border border-gray-200 rounded-md p-2 cursor-pointer flex items-center"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <Calendar className="text-gray-400 mr-2" size={20} />
        <input 
          type="text" 
          value={startDate ? (endDate ? `${formatDate(startDate)}  ⇄  ${formatDate(endDate)}` : formatDate(startDate)) : 'Select date range'}
          className="w-full outline-none cursor-pointer"
          readOnly
        />
      </div>

      {showCalendar && (
        <div className="absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[700px] z-50">
          <div className="grid grid-cols-[100px_1fr] gap-4">
            {/* Quick select options */}
            <div className="border-r">
              {quickSelectOptions.map((option) => (
                <div
                  key={option.label}
                  onClick={() => handleQuickSelect(option)}
                  className="py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
                >
                  {option.label}
                </div>
              ))}
              
              <div className="border-t my-2"></div>
              <div
                onClick={handleReset}
                className="py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md text-red-500"
              >
                Reset
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-2 gap-8">
              {displayMonths.map((monthDate, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <button title="Previous Month" onClick={() => navigateMonth(index, -1)}>
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {/* Month selector */}
                      <div className="relative">
                        <button 
                          onClick={() => {
                            const newShowMonthSelect = [...showMonthSelect];
                            newShowMonthSelect[index] = !newShowMonthSelect[index];
                            setShowMonthSelect(newShowMonthSelect);
                            setShowYearSelect([false, false]);
                          }}
                          className="text-md font-medium hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          {months[monthDate.getMonth()]}
                        </button>
                        
                        {showMonthSelect[index] && (
                          <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-40 max-h-48 overflow-y-auto">
                            {months.map((month, monthIndex) => (
                              <div
                                key={month}
                                onClick={() => handleMonthChange(index, monthIndex)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {month}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Year selector */}
                      <div className="relative">
                        <button 
                          onClick={() => {
                            const newShowYearSelect = [...showYearSelect];
                            newShowYearSelect[index] = !newShowYearSelect[index];
                            setShowYearSelect(newShowYearSelect);
                            setShowMonthSelect([false, false]);
                          }}
                          className="text-md font-medium hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          {monthDate.getFullYear()}
                        </button>
                        
                        {showYearSelect[index] && (
                          <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-24 max-h-48 overflow-y-auto">
                            {years.map((year) => (
                              <div
                                key={year}
                                onClick={() => handleYearChange(index, year)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
                              >
                                {year}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button title="Next Month" onClick={() => navigateMonth(index, 1)}>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-sm text-gray-500 h-8 flex items-center justify-center">
                        {day}
                      </div>
                    ))}
                    {renderMonth(monthDate, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;