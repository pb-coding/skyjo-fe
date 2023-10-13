import { FC, useEffect, useState, useRef } from "react";
import { socket } from "../socket";

type VoiceChatProps = {
  session: string;
};

const VoiceChat: FC<VoiceChatProps> = ({ session }) => {
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const pc = useRef(new RTCPeerConnection(servers));
  const sessionRef = useRef<string>(session);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const [isWebcamSetup, setIsWebcamSetup] = useState(false);

  // Setup media sources
  const setupWebcam = async () => {
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    localStreamRef.current.getTracks().forEach((track) => {
      if (!localStreamRef.current) return;
      pc.current.addTrack(track, localStreamRef.current);
    });
  };

  // Create an offer
  const createOffer = async () => {
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);
    console.log("session (create offer):", session);
    socket.emit("create-offer", { offerDescription, sessionName: session });
  };

  // Answer the call
  const answerCall = async (offer: RTCSessionDescriptionInit) => {
    console.log("Answer call triggered");

    await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    console.log("session (answer call):", sessionRef.current);

    socket.emit("answer-call", {
      answerDescription,
      sessionName: sessionRef.current,
    });
  };

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    socket.on("offer-made", async (offer) => {
      console.log("Offer received:", offer);
      answerCall(offer);
    });

    socket.on("answer-made", async (answer) => {
      console.log("Answer received:", answer);
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
      console.log("set remote description", pc.current);
      console.log("set");
    });

    socket.on("add-ice-candidate", (candidate) => {
      console.log("Ice candidate received:", candidate);
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.toJSON();
        console.log("Emit ICE-candidate:", candidate);
        socket.emit("ice-candidate", {
          candidate,
          sessionName: sessionRef.current,
        });
      }
    };

    pc.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStreamRef.current.addTrack(track);
      });
      console.log("remote stream", remoteStreamRef.current);
      if (remoteVideoRef.current) {
        console.log("setting remote video ref");
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    };
  }, []);

  const startWebcam = async () => {
    await setupWebcam();
    setIsWebcamSetup(true);
  };

  const initiateCall = async () => {
    if (isWebcamSetup) {
      // Only allow calls if the webcam is set up
      await createOffer();
    } else {
      console.log("Please set up your webcam first.");
    }
  };

  return (
    <div style={{ zIndex: 100 }}>
      <h2>Webcam</h2>
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video ref={localVideoRef} autoPlay muted></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video ref={remoteVideoRef} autoPlay></video>
        </span>
      </div>

      <button style={{ zIndex: 100 }} onClick={startWebcam}>
        Start Webcam
      </button>
      <h2>2. Create a new Call</h2>
      <button onClick={initiateCall}>Initiate Call</button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>

      <input id="callInput" />
      <button id="answerButton" disabled>
        Answer
      </button>

      <h2>4. Hangup</h2>

      <button id="hangupButton" disabled>
        Hangup
      </button>
    </div>
  );
};

export default VoiceChat;
