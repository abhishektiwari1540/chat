import React, { useState, useEffect } from "react";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { Send } from "lucide-react";
import { usePage } from "@inertiajs/react"; // Import usePage hook


export default function ChatRoom({ rooms }) {
    const { url } = usePage();
    const roomId = new URLSearchParams(url.split('?')[1]).get('roomId');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        // Fetch previous messages
        // const fetchMessages = async () => {
        //     try {
        //         const response = await fetch(route("home.chat.room"));
        //         const data = await response.json();
        //         setMessages(data.messages); // Ensure backend sends { messages: [...] }
        //     } catch (error) {
        //         console.error("Error fetching messages:", error);
        //     }
        // };

        // fetchMessages();
        if (!roomId) return;
        const channel = window.Echo.channel(`chat-room-${roomId}`);
        channel.listen(".MessageSent", (event) => {
            console.log("New message received:", event);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: event.message, sender: "Server" },
            ]);
        });

        return () => {
            channel.stopListening(".MessageSent");
        };
    }, [roomId]);

    const sendMessage = async () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: "You" }]);
            setInput("");
            await fetch(route('home.chat.store'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
                body: JSON.stringify({ message: input, roomId: roomId }),
                credentials: "include",
            });

             // Clear input
        }
    };

    return (
        <>
            <Header />

            <div className="container mx-auto mt-4 p-4">
                <div>
                </div>
                <div className="flex h-[80vh] shadow-lg rounded-lg overflow-hidden border border-gray-300">

                    {/* Chat Window */}
                    <div className="flex flex-col flex-1 bg-white">

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 max-w-[70%] rounded-lg shadow-md ${
                                            msg.sender === "You"
                                                ? "bg-blue-500 text-black self-end ml-auto"
                                                : "bg-gray-300 text-black"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">No messages yet</p>
                            )}
                        </div>

                        {/* Message Input Box */}
                        <div className="flex items-center p-3 border-t bg-gray-100 shadow-sm rounded-b-lg">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-3 p-3 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition"
                            >
                                <Send size={18} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
