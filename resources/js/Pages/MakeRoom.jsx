import React, { useState, useRef, useEffect } from "react";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { ArrowRight, Plus } from "lucide-react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios"; // Ensure axios is imported

export default function MakeRoom({ rooms }) {
    const [activeModal, setActiveModal] = useState(null); // 'join' or 'create'
    const [roomCode, setRoomCode] = useState("");
    const [roomName, setRoomName] = useState("");
    const [show, setShow] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const buttonRef = useRef(null);
    const [roomDetails, setRoomDetails] = useState([]); // State to store created/joined room details
    useEffect(() => {
        if (rooms) {
            setRoomDetails(rooms);
        }
    }, [rooms]);

    const [data, setData] = useState({
        roomID: "",
        roomName: "",
        memberCount: 0,
    });

    const handleClose = () => {
        setShow(false);
        setData({ roomID: "", roomName: "", memberCount: 0 });
    };

    useEffect(() => {
        const button = buttonRef.current;
        if (button) {
            button.setAttribute("aria-selected", isSelected ? "true" : "false");
        }
    }, [isSelected]);
    const handleShow = () => setShow(true);

    const handleCreateOrJoinRoom = async (e) => {
        e.preventDefault();

        const apiUrl = route('home.chat.room.details');

        try {
            const response = await axios.post(apiUrl, {
                room_id:  data.roomID,
                room_name: data.roomName,
                member_count: activeModal === "join" ? data.memberCount + 1 : 1,
            });

            if (response.data.success) {
                if (activeModal === "join") {
                    window.location.href = response.data.join_url;
                } else {
                    setRoomDetails((prevRooms) => [...prevRooms, response.data.room]);
                }
            } else {
                console.error("Error:", response.data.message);
            }

            // Handle success (e.g., navigate to the chat room)
        } catch (error) {
            console.error("Error creating/joining room:", error);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />

            <main className="flex-grow container mx-auto p-4">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center mb-4">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Room Management
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto text-center">
                        <button
                            ref={buttonRef}
                            onClick={() => {
                                setActiveModal("room");
                                setShow(true);
                            }}
                            className="btn flex-1 m-3 btn-selected flex items-center justify-center gap-3 px-6 py-4 bg-amber-400 text-gray-900 rounded-xl hover:bg-amber-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                            aria-selected={isSelected}
                        >
                            <Plus className="w-5 h-5" />
                            Create New Room
                        </button>

                        <button
                            onClick={() => {
                                setActiveModal("join");
                                setShow(true);
                            }}
                            className="btn flex-1 m-3 btn-selected flex items-center justify-center gap-3 px-6 py-4 bg-amber-400 text-gray-900 rounded-xl hover:bg-amber-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Join Existing Room
                        </button>
                    </div>
                </div>

                {roomDetails && roomDetails.length > 0 && (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center mt-6">
        <h3 className="text-xl font-bold text-gray-800">Room Details</h3>
        {roomDetails.map((room, index) => (
            <div key={index} className="border-b border-gray-300 py-4 last:border-b-0">
                <p className="mt-2 text-gray-600">
                    <strong>Room Name:</strong> {room.name}
                </p>
                <p className="text-gray-600">
                    <strong>Room ID:</strong> {room.room_no}
                </p>
                <p className="text-gray-600">
                    <strong>Members:</strong> {room.member_count}
                </p>
                <p className="text-gray-600">
                    <strong>Room Link:</strong>{" "}
                    <a
                        href={room.refer_url}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {room.refer_url}
                    </a>
                </p>
            </div>
        ))}
    </div>
)}

                <Modal show={show} onHide={handleClose} top>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>
                            {activeModal === "join"
                                ? "Join Room"
                                : "Create Room"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleCreateOrJoinRoom}>
                            {activeModal === "join" ? (
                                <Form.Group
                                    controlId="roomCode"
                                    className="mb-4"
                                >
                                    <Form.Label className="block text-gray-700 mb-2">
                                        Enter Room ID
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.roomID}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                roomID: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. ABC123"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </Form.Group>
                            ) : (
                                <Form.Group
                                    controlId="roomName"
                                    className="mb-4"
                                >
                                    <Form.Label className="block text-gray-700 mb-2">
                                        Room Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={data.roomName}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                roomName: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. My Study Room"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </Form.Group>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="secondary"
                                    onClick={handleClose}
                                    className="px-4 py-2 m-3 bg-gray-200 text-gray-800 hover:bg-gray-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="px-4 py-2 m-3 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {activeModal === "join"
                                        ? "Join Room"
                                        : "Create Room"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </main>

            <Footer />
        </div>
    );
}
