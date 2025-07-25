// utils/time-helper.js

export const getTimeStr = () => {
    const now = new Date();
    const timeString = [
      now.getFullYear(),
      (now.getMonth() + 1).toString().padStart(2, "0"),
      now.getDate().toString().padStart(2, "0"),
      "_",
      now.getHours().toString().padStart(2, "0"),
      now.getMinutes().toString().padStart(2, "0"),
      now.getSeconds().toString().padStart(2, "0"),
      now.getMilliseconds().toString().padStart(3, "0"),
    ].join("");
    return timeString;
  };