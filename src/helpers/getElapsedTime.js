// Convert date to string showing amount of time passed since then
const getElapsedTime = date => {
    let startTime = date.getTime() / 1000; // Convert date to the number of seconds since January 1, 1970 00:00:00
    let elapsedTime;
    const secondsPerYear = 365 * 24 * 60 * 60; // 31536000 sec
    const secondsPerMonth = 30 * 24 * 60 * 60; // 2592000 sec
    const secondsPerDay = 24 * 60 * 60; // 86400 sec
    const secondsPerHour = 60 * 60; // 3600 sec
    const secondsPerMinute = 60; // 60 sec

    // Get time difference between specified and current time (milliseconds)
    const delta = Date.now() - (startTime * 1000);

    // Convert seconds to years / months / days / hours / minutes
    const seconds = delta / 1000;
    const years = Math.floor(seconds / secondsPerYear);
    const months = Math.floor((seconds - (years * secondsPerYear)) / secondsPerMonth);
    const days = Math.floor((seconds - (years * secondsPerYear) - (months * secondsPerMonth)) / secondsPerDay);
    const hours = Math.floor((seconds - (years * secondsPerYear) - (months * secondsPerMonth) - (days * secondsPerDay)) / secondsPerHour);
    const minutes = Math.floor((seconds - (years * secondsPerYear) - (months * secondsPerMonth)
        - (days * secondsPerDay) - (hours * secondsPerHour)) / secondsPerMinute);

    // Set elapsed time output
    if (years === 1) { elapsedTime = years + ' year'; }
    else if (years > 1) { elapsedTime = years + ' years'; }
    else if (months === 1) { elapsedTime = months + ' month'; }
    else if (months > 1) { elapsedTime = months + ' months'; }
    else if (days === 1) { elapsedTime = days + ' day'; }
    else if (days > 1) { elapsedTime = days + ' days'; }
    else if (hours === 1) { elapsedTime = hours + ' hour'; }
    else if (hours > 1) { elapsedTime = hours + ' hours'; }
    else if (minutes === 1) { elapsedTime = minutes + ' minute'; }
    else if (minutes > 1) { elapsedTime = minutes + ' minutes'; }
    else if (minutes === 0) { return 'Just now'; }

    return elapsedTime + ' ago';
};

export default getElapsedTime;