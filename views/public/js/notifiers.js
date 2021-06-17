let managerID = document.getElementById("uid").value;
const socket = io();
socket.on(`booking-${managerID}`, function (message) {
  console.log(message);
  showNotification(message);
});
function showNotification(message) {
  if (Notification.permission === "granted") {
    notify(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        notify(message);
      }
    });
  }
}

function notify(message) {
  const notification = new Notification("New booking", {
    body: `You have an order at ${message.resName}:\nCheck in: ${message.ReserveTime}\nNumber of dinners: ${message.NumOfDiners}`,
    icon: "img/logo.png",
  });
  notification.onclick = (e) => {
    window.location.replace("/manager/BookingList");
  };
  setTimeout(notification.close.bind(notification), 7000);
}
