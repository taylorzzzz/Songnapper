export const timeSince = (date) => {

  // Get the number of seconds elapsed
  var seconds = Math.floor((new Date() - date) / 1000);

  // Then we check the first interval - year. If interval >= 1 then at least a year has passed
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  // Next we check months. If there have been at least 2592000 seconds then a month has passed
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  // Then we check days
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  // then hours 
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  // and finally seconds
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

