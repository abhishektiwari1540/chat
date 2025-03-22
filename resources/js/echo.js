import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: "9267704f2255a675b5de",
    cluster: "ap2",
    forceTLS: true,
});


window.Echo.channel("chat-channel").listen("MessageSent", (event) => {
    console.log("New Message:", event.message);
});
