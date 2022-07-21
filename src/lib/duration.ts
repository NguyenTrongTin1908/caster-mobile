export function secondsToHms(second: any, formater?: string) {
  const sec = parseInt(second, 10);
  let hours = Math.floor(sec / 3600) as any;
  let minutes = Math.floor((sec - hours * 3600) / 60) as any;
  let seconds = (sec - hours * 3600 - minutes * 60) as any;
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  if (hours == 0) {
    // Return in 0m0s format
    if (formater === 'hms') return +minutes + 'm' + parseInt(seconds) + 's';
    else return minutes + ':' + seconds; // Return in MM:SS format
  } else {
    // Return in 0h0m0s format
    if (formater === 'hms') return hours + 'h' + minutes + 'm' + seconds + 's';
    else return hours + ':' + minutes + ':' + seconds; // Return in HH:MM:SS format
  }
}
