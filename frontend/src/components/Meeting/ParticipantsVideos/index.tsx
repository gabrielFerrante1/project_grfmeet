import React, { useEffect, useRef, useState } from "react";
import Peer, { Instance } from "simple-peer";
import styled from "styled-components";
import { socket } from "../../Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from './ParticipantsVideos.module.scss'

const ControlSmall = styled.div`
  margin: 3px;
  padding: 5px;
  height: 16px;
  width: 98%;
  margin-top: -6vh;
  filter: brightness(1);
  z-index: 1;
  border-radius: 6px;
  display: flex;
  justify-content: center;
`;

const ImgComponentSmall = styled.img`
  height: 15px;
  width: 25px;
  text-align: left;
  opacity: 0.5;
`;

const Video = (props: { peer: Instance }) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        props.peer.on("stream", (stream) => {
            if (ref.current) ref.current.srcObject = stream;
        });
    }, []);

    return (
        <div className={styles.userVideo}>
            <video className={styles.video} playsInline autoPlay ref={ref} />;
        </div>
    )
};


const Room = () => {
    const meeting = useSelector((state: RootState) => state.meeting)

    const [peers, setPeers] = useState<{ peer: Instance, peerID: number }[]>([]);
    const [userUpdate, setUserUpdate] = useState([]);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<{ peer: Instance, peerID: number }[]>([]);

    function createStream() {
        const videoConstraints = {
            height: 230,
            width: 400,
        };


        navigator.mediaDevices
            .getUserMedia({ video: videoConstraints, audio: true })
            .then((stream) => {
                // Set strem of user
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;

                    handleToggleVideo(meeting.meetingMyConfig.videoIsEnable);
                    handleToggleAudio(meeting.meetingMyConfig.audioIsEnable);
                }

                // Join user in session room meeting
                socket.emit('join room', meeting.meeting?.code)

                socket.on("all users", (users) => {
                    console.log(users)
                    const peers: { peer: Instance, peerID: number }[] = [];
                    users.forEach((userID) => {
                        const peer = createPeer(userID, socket.id, stream);
                        peersRef.current.push({
                            peerID: userID,
                            peer,
                        });
                        peers.push({
                            peerID: userID,
                            peer,
                        });
                    });
                    setPeers(peers);
                });
                socket.on("user joined", (payload) => {
                    console.log("==", payload)
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer,
                    });
                    const peerObj = {
                        peer,
                        peerID: payload.callerID,
                    };
                    setPeers((users) => [...users, peerObj]);
                });

                socket.on("user left", (id) => {
                    const peerObj = peersRef.current.find((p) => p.peerID === id);
                    if (peerObj) {
                        peerObj.peer.destroy();
                    }
                    const peers = peersRef.current.filter((p) => p.peerID !== id);
                    peersRef.current = peers;
                    setPeers(peers);
                });

                socket.on("receiving returned signal", (payload) => {
                    const item = peersRef.current.find((p) => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });

                socket.on("change", (payload) => {
                    setUserUpdate(payload);
                });
            });
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("sending signal", {
                userToSignal,
                callerID,
                signal,
            });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", (signal) => {
            socket.emit("returning signal", { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const handleToggleVideo = (isEnabled: boolean) => {
        if (!userVideo.current?.srcObject) return;

        userVideo.current.srcObject.getTracks().forEach(function (track: MediaStreamTrack) {
            if (track.kind === "video") {
                socket.emit("change", [...userUpdate, {
                    id: socket.id,
                    videoFlag: isEnabled,
                    audioFlag: meeting.meetingMyConfig.audioIsEnable,
                }]);

                track.enabled = isEnabled;
            }
        });
    }

    const handleToggleAudio = (isEnabled: boolean) => {
        if (!userVideo.current?.srcObject) return;

        userVideo.current.srcObject.getTracks().forEach(function (track: MediaStreamTrack) {
            if (track.kind === "audio") {
                socket.emit("change", [...userUpdate, {
                    id: socket.id,
                    videoFlag: meeting.meetingMyConfig.videoIsEnable,
                    audioFlag: isEnabled,
                }]);

                track.enabled = isEnabled;
            }
        });
    }

    useEffect(() => {
        handleToggleVideo(meeting.meetingMyConfig.videoIsEnable)
    }, [meeting.meetingMyConfig.videoIsEnable])

    useEffect(() => {
        handleToggleAudio(meeting.meetingMyConfig.audioIsEnable)
    }, [meeting.meetingMyConfig.audioIsEnable])

    useEffect(() => {
        createStream();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.userVideo}>
                <video className={styles.video} muted ref={userVideo} autoPlay playsInline />
            </div>

            {peers.map((peer, index) => {
                let audioFlagTemp = true;
                let videoFlagTemp = true;
                if (userUpdate) {
                    userUpdate.forEach((entry) => {
                        if (peer && peer.peerID && peer.peerID === entry.id) {
                            audioFlagTemp = entry.audioFlag;
                            videoFlagTemp = entry.videoFlag;
                        }
                    });
                }
                return (
                    <div key={peer.peerID} >
                        <Video peer={peer.peer} />
                        <ControlSmall>
                            <ImgComponentSmall src={videoFlagTemp ? "/assets/webcam.svg" : "../assets/webcamoff.svg"} />
                            &nbsp;&nbsp;&nbsp;
                            <ImgComponentSmall src={audioFlagTemp ? 'assets/micunmute.svg' : 'assets/micmute.svg'} />
                        </ControlSmall>
                    </div>
                );
            })}
        </div>
    );
};

export default Room;