import { Dispatch, FC, SetStateAction, useState } from "react";
import { socket } from "../socket";

type JoinSessionProps = {
  session: string;
  setSession: Dispatch<SetStateAction<string>>;
};

export const JoinSession: FC<JoinSessionProps> = ({ session, setSession }) => {
  const [sessionField, setSessionField] = useState("");

  function joinSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    socket.emit("join-session", sessionField);
    setSession(sessionField);
    setSessionField("");
  }

  if (session !== "") {
    return null;
  }

  return (
    <form onSubmit={joinSession}>
      <input onChange={(e) => setSessionField(e.target.value)} />

      <button type="submit">Join</button>
    </form>
  );
};
