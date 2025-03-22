import React, { useState, useEffect } from "react";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { Send, MessageSquare } from "lucide-react";

export default function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        const channel = window.Echo.channel("chat-channel"); // Public channel

        channel.listen("MessageSent", (event) => {
            console.log("New message received:", event.message);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: event.message, sender: "Server" }
            ]);
        });

        return () => {
            channel.stopListening("MessageSent");
        };
    }, []);

    const sendMessage = async () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: "You" }]);

            await fetch("http://127.0.0.1:8000/send-message", { // Using web.php route
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            setInput("");
        }
    };

    return (
        <>
            <Header />
            <div className="container mx-auto mt-4 p-4">
                <div className="flex h-[80vh] shadow-lg rounded-lg overflow-hidden border border-gray-300">
                    <div className="w-1/4 bg-gray-100 p-4 border-r">
                        <h2 className="text-xl font-semibold mb-4">Chats</h2>
                        <div className="space-y-3">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className="p-3 bg-white rounded-lg shadow-md flex items-center cursor-pointer hover:bg-gray-200 transition">
                                        <MessageSquare className="mr-2 text-blue-500" /> {msg.text}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">No messages yet</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 bg-white p-4">
                        <div className="flex-1 overflow-auto p-4 space-y-3">
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 max-w-[70%] rounded-lg shadow-md ${
                                            msg.sender === "You" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-black"
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
                        <div className="flex items-center p-3 border-t bg-gray-50 shadow-sm rounded-b-lg">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
