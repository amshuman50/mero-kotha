"use client";

import { BACKEND } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../utils/context/authContext";
import HeaderBox from "../components/headerBox";
import { UserType } from "../interface/userType";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Chat() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [title, setTitle] = useState<string[]>([]);
  const [myRooms, setMyRooms] = useState<any[]>();
  const [selectedRoom, setSelectedRoom] = useState<any>();
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const roomMessagesRef = useRef<any[]>([]);
  const selectedRoomRef = useRef<any>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => console.log("connected"));
    socket.on("disconnect", () => console.log("disconnected"));
  }, []);

  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId && user) {
      // console.log("the userId passed is: ", userId);
      // console.log("myrooms", myRooms);
      const filteredRoom = myRooms?.find((room) => {
        return room.users.some((user: UserType) => user.id === +userId);
      });
      console.log("filteredRoom1", filteredRoom);
      if (filteredRoom) {
        console.log("filteredRoom", filteredRoom);
        setSelectedRoom(filteredRoom);
        router.replace("/chat");
      } else {
        console.log("no rooms exists with id " + userId);
        createRoom(+userId);
        router.replace("/chat");
      }
    }
  }, [user]);

  useEffect(() => {
    console.log("selected room from useEffect: ", selectedRoom);
    selectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    roomMessagesRef.current = roomMessages;
    scrollToBottom();
  }, [roomMessages]);

  // useEffect(()=>{
  //   scrollToBottom();
  // }, [roomMessages])

  const createRoom = (id: number) => {
    const user2 = { id: id };
    const room = {
      name: `ROOM ${Date().slice(0, 10)}`,
      users: [user2],
    };
    socket.emit("createRoom", room);
  };

  const joinRoom = (room: any) => {
    console.log("clicked joinRoom");
    socket.emit("joinRoom", room);
  };

  const leaveRoom = (room: any) => {
    console.log("clicked leaveRoom");
    socket.emit("leaveRoom", room);
  };

  const addMessage = (message: any) => {
    socket.emit("addMessage", message);
  };

  socket.on("messageAdded", (value) => {
    console.log("Room Messages: ", roomMessagesRef.current);
    console.log("Selected Room: ", selectedRoomRef.current);
    console.log("Added Message: ", value);

    const { room, text, created_at, updated_at, user } = value;

    if (room.id === selectedRoomRef.current?.id) {
      setRoomMessages((prevMessages) => {
        // Check if the message already exists in the array
        const messageExists = prevMessages.some((msg) => msg.text === text);

        // If the message doesn't exist, add it to the array
        if (!messageExists) {
          return [
            ...prevMessages,
            {
              id: prevMessages.length + 1,
              text: text,
              created_at: created_at,
              updated_at: updated_at,
              user: user,
            },
          ];
        }

        // If the message already exists, return the previous messages array unchanged
        return prevMessages;
      });
    }
  });

  // Listen for incoming messages
  socket.on("message", (value) => {
    setTitle([...title, value]);
    console.log("Received message: ", value);
    // Handle the received message as needed
  });

  socket.on("messages", (value) => {
    setRoomMessages(value);
    console.log("Received Message: ", value);
  });

  socket.on("rooms", (value) => {
    setMyRooms(value);
    // console.log("Received rooms:", value);
    // console.log(myRooms);
    // Handle the received message as needed
  });

  useEffect(() => {
    if (myRooms) {
      console.log("myRooms: ", myRooms);
      // setSelectedRoom(myRooms[0].id);
    }
  }, [myRooms]);

  return (
    <>
      <HeaderBox title="Conversations" />
      <Container sx={{ marginY: 10, width: "80%" }}>
        {myRooms && (
          <Stack direction="row" justifyContent="space-between">
            <Stack
              divider={<Divider orientation="horizontal" flexItem sx={{}} />}
              gap={2.5}
              // marginY={4}
              minWidth="30%"
              // maxWidth="30%"
              sx={{
                border: "1px solid black",
                borderRadius: "10px 0 0 10px",
                padding: 4,
              }}
            >
              {myRooms.length > 0 &&
                user &&
                myRooms.map((room) => (
                  // Use a fragment or a container to wrap the elements returned by map
                  <React.Fragment key={room.id}>
                    {room.users.map((Seluser: UserType) => {
                      // Check if the user id is not equal to the current user id
                      if (Seluser.id !== user.id) {
                        return (
                          <React.Fragment key={Seluser.id}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={3}
                              sx={{ cursor: "pointer" }}
                              onClick={() => {
                                leaveRoom(selectedRoom);
                                setSelectedRoom(room);
                                joinRoom(room);
                              }}
                            >
                              <Avatar
                                alt="user avatar"
                                src={`${BACKEND}/uploads/avatars/${Seluser.avatar}`}
                              />
                              <Typography>{Seluser.name}</Typography>
                            </Stack>
                          </React.Fragment>
                        );
                      }
                      // Return null if the condition is not met
                      return null;
                    })}
                  </React.Fragment>
                ))}
            </Stack>

            <Container
              sx={{
                width: "70%",
                minHeight: "75vh",
                // maxHeight: "80vh",
                border: "1px solid black",
                borderRadius: "0 10px 10px 0",
                margin: 0,
                // overflowY: "scroll",
                position: "relative",
                paddingBottom: "70px",
              }}
              style={{ padding: 0 }}
            >
              {!selectedRoom ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <Typography>No Rooms Selected!</Typography>
                </Stack>
              ) : (
                <Stack
                  paddingBottom="75px"
                  sx={{ maxHeight: "80vh", overflowY: "scroll" }}
                  ref={messagesEndRef}
                >
                  <Box
                    sx={{
                      padding: 4,
                      backgroundColor: "#282e38",
                      color: "white",
                      marginBottom: 2,
                    }}
                  >
                    <Typography>
                      ({selectedRoom.id}) {selectedRoom.name}
                    </Typography>
                    <Typography>
                      {selectedRoom.users.map((user: UserType) => (
                        <Typography key={user.id}>
                          [Name: {user.name}, email: {user.email}]
                        </Typography>
                      ))}
                    </Typography>
                  </Box>
                  {roomMessages &&
                    roomMessages.map((msg) => {
                      return (
                        <Stack
                          key={msg.id}
                          marginLeft={msg.user.id === user?.id ? "auto" : 2}
                          sx={{
                            // border: "3px solid black",
                            display: "inline-block",
                            maxWidth: "fit-content",
                            borderRadius: 2,
                            padding: 2,
                            marginRight: 2,
                            marginBottom: 2,
                            backgroundColor:
                              msg.user.id === user?.id ? "#fb6749" : "#7fcfdf",
                            color: msg.user.id === user?.id ? "white" : "black",
                            // marginLeft: "auto",
                            // marginLeft: {msg.user.id === user.id ? "auto" : "none"},
                          }}
                          // alignItems="flex-end"
                        >
                          <Typography sx={{ fontStyle: "italic" }}>
                            {msg.user.name}
                          </Typography>
                          <Typography>{msg.text}</Typography>
                          {/* <Divider /> */}
                        </Stack>
                        // <Stack key={msg.id}>
                        // </Stack>
                      );
                    })}
                  <Stack
                    direction="row"
                    gap={2}
                    justifyContent="center"
                    sx={{
                      bottom: 0,
                      position: "absolute",
                      width: "94%",
                      marginBottom: 4,
                      marginX: 4,
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      label="Send Message"
                      variant="standard"
                      fullWidth
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={() => {
                        const msg = {
                          text: newMessage,
                          user: user,
                          room: selectedRoom,
                        };
                        setNewMessage("");
                        addMessage(msg);
                      }}
                    >
                      Send
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Container>
          </Stack>
        )}
        {!myRooms && (
          <Stack justifyContent="center" alignItems="center" height="40vh">
            <Typography>No Recent Conversations!</Typography>
          </Stack>
        )}
      </Container>
    </>
  );
}
