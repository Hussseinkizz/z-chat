export const getTimeStamp = () => {
    let date = new Date();

    // Get day, month, and year
    const day = date.getDate();
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Get hours, minutes, and AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // The hour '0' should be '12'

    // Format the timestamp
    const formattedDate = `${month} ${day}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return `${formattedDate} ${formattedTime}`;
};
