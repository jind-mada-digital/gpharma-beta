
const padZero = (number) => {
    return number.toString().padStart(2, '0');
}

exports.getCurrentTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = padZero(now.getMonth() + 1);
    const day = padZero(now.getDate());
    const hour = padZero(now.getHours());
    const minute = padZero(now.getMinutes());
    const second = padZero(now.getSeconds());
    return `${year}${month}${day}${hour}${minute}${second}`;
}