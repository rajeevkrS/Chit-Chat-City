import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context API/AuthContext";

const Chats = () => {
  // Fetch user and chats from firestore db
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);

  // Using onShnapshot() method of firebase will return realtime chats.
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.email),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };

    // If there is current user id after that call the getChats() func.
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // console.log(Object.entries(chats));

  return (
    <div className="chats">
      {/* Chats here is in object fromat "{}" which is getting from onSnapshot method, but for mapping over "chats" we need to conert it into array so to convert I used a method Object.entries() method which converts it into array "[]". */}
      {Object.entries(chats)?.map((chat) => (
        <div className="userChat" key={chat[0]}>
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].userInfo.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
