// Time slots as key-value pairs: key = 24h format (for backend), value = 12h format (for display)
export const TIME_SLOTS = {
    '08:00': '8:00 AM',
    '08:30': '8:30 AM',
    '09:00': '9:00 AM',
    '09:30': '9:30 AM',
    '10:00': '10:00 AM',
    '10:30': '10:30 AM',
    '11:00': '11:00 AM',
    '11:30': '11:30 AM',
    '12:00': '12:00 PM',
    '12:30': '12:30 PM',
    '13:00': '1:00 PM',
    '13:30': '1:30 PM',
    '14:00': '2:00 PM',
    '14:30': '2:30 PM',
    '15:00': '3:00 PM',
    '15:30': '3:30 PM',
    '16:00': '4:00 PM',
    '16:30': '4:30 PM',
    '17:00': '5:00 PM',
    '17:30': '5:30 PM',
    '18:00': '6:00 PM',
};

export const formatTime = (time) => {
    return TIME_SLOTS[time] || time;
};

// Get time range for display (show start and next time for each slot)
export const getTimeRangeDisplay = (currentSlot) => {
    const allSlots = Object.keys(TIME_SLOTS);
    const currentIndex = allSlots.indexOf(currentSlot);
    const nextSlot = allSlots[currentIndex + 1];

    const startTime = formatTime(currentSlot);
    const endTime = nextSlot ? formatTime(nextSlot) : '';
    if(nextSlot){
        return endTime ? `${startTime} - ${endTime}` : startTime;
    }
};
