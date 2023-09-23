import { Dispatch, FC, SetStateAction, useState } from "react";
import { socket } from "../socket";

import Button from "../global/Button";

type JoinSessionProps = {
  clientsInRoom: number;
  session: string;
  setSession: Dispatch<SetStateAction<string>>;
  showStartGameButton: boolean;
};

export const JoinSession: FC<JoinSessionProps> = ({
  clientsInRoom,
  session,
  setSession,
  showStartGameButton,
}) => {
  const [sessionField, setSessionField] = useState("");

  function joinSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    socket.emit("join-session", sessionField);
    setSession(sessionField);
    setSessionField("");
  }

  function startGame() {
    socket.emit("new-game", { sessionId: session });
  }

  const isActiveSession = session !== "";

  return (
    <section>
      <div
        className="w-full h-full absolute top-0 left-0 z-0"
        style={{
          backgroundImage: "linear-gradient(to bottom, #233876, #111827)",
        }}
      >
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">
            Skyjo
          </h1>
          <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-gray-200">
            Play Skyjo online with your friends!
          </p>
          <div className="p-4">
            {!isActiveSession && (
              <form onSubmit={joinSession}>
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Join Skyjo Session
                </label>
                <div className="flex space-x-1 items-center">
                  <input
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Session name"
                    required
                    onChange={(e) => setSessionField(e.target.value)}
                  />
                  <Button>Join</Button>
                </div>
              </form>
            )}
          </div>

          <p className="text-gray-200 text-3xl my-2">Session: {session}</p>
          <p className="text-gray-200 text-3xl my-4">
            Players: {clientsInRoom}
          </p>
          <br />
          {showStartGameButton && (
            <Button onClick={startGame}>Start Game</Button>
          )}
        </div>
      </div>
    </section>
  );
};
