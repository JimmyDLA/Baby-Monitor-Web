import React, { useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { v4 as uuidV4 } from 'uuid'
import io from 'socket.io-client'
import Button from '@mui/material/Button';


const URL = process.env.REACT_APP_SERVER
const mediaConstraints = {
  // don't know if noise suppression actually work as is
  noiseSuppression: false,
  audio: true,
  video: {
    frameRate: 30,
    facingMode: 'user',
  },
}
const styles = {
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    margin: 30
  }
};

export const CreateFreq = () => {
  const room = uuidV4()
  const peerRef = useRef()
  const socketRef = useRef()
  const otherUser = useRef()
  const sendChannel = useRef() // Data channel
  const mediaRef = useRef()

  const [localMediaStream, setLocalMediaStream] = useState(null)
  const [isVoiceOnly, setIsVoiceOnly] = useState(false)

  useEffect(() => {
    console.log('[INFO] createFreq useEffect')

    socketRef.current = io.connect(URL)

    socketRef.current.emit('join-freq', room) // Room ID

    socketRef.current.on('other-user', userID => {
      console.log('[INFO] createFreq other-user: ', userID)
      otherUser.current = userID
    })
    // Signals that both peers have joined the room
    socketRef.current.on('user-joined', userID => {
      console.log('[INFO] createFreq user-joined: ', userID)
      otherUser.current = userID
    })

    // ====================== 13. Add listener for icoming offers ======================
    socketRef.current.on('end', handleEnd)
    socketRef.current.on('offer', handleOffer)
    socketRef.current.on('answer', handleAnswer)
    socketRef.current.on('switch-camera', handleSwitch)
    socketRef.current.on('toggle-audio', handleOnAndOffCamera)
    socketRef.current.on('ice-candidate', handleNewICECandidateMsg)
  })

  const getMedia = async () => {
    let voiceOnly = false

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)

      if (voiceOnly) {
        let videoTrack = await mediaStream.getVideoTracks()[0]
        videoTrack.enabled = false
      }
      // InCallManager.setSpeakerphoneOn(true)

      return mediaStream
    } catch (err) {
      // Handle Error
      console.log({ err })
    }
  }

  const Peer = () => {
    console.log('[INFO] createFreq Peer')
    /*
      Here we are using Turn and Stun server
      (ref: https://blog.ivrpowers.com/post/technologies/what-is-stun-turn-server/)
    */

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    // =========== 21. Add listener on ice candidate once done setting all descps ============
    peer.onicecandidate = handleICECandidateEvent
    peer.ontrack = handleTrackEvnet
    // peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID)
    peer.onsignalingstatechange = event => {
      console.log('[STAT] createFreq signal', peerRef.current.signalingState)
    }
    peer.ondatachannel = async event => {
      sendChannel.current = event.channel
      sendChannel.current.onmessage = handleReceiveMessage
      console.log('[SUCCESS] createFreq Connection established')
    }
    return peer
  }

  const handleTrackEvnet = (e) => {
    console.log('[INFO] createFreq handleTrackEvnet', e)
  }

  function handleReceiveMessage(e) {
    // Listener for receiving messages from the peer
    console.log('[INFO] createFreq Message received from peer', e.data)
  }

  async function handleOffer(incoming) {
    // ====================== 14. Handle offer ======================
    /*
      Here we are exchanging config information
      between the peers to establish communication
    */

    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    }

    peerRef.current = Peer()
    mediaRef.current = await getMedia()
    setLocalMediaStream(mediaRef.current)

    /*
      Session Description: It is the config information of the peer
      SDP stands for Session Description Protocol. The exchange
      of config information between the peers happens using this protocol
    */
    const desc = new RTCSessionDescription(incoming.sdp)

    /*
      Remote Description : Information about the other peer
      Local Description: Information about you 'current peer'
    */
    // ====================== 15. Answer, save remote & local descp ======================

    peerRef.current.setRemoteDescription(desc)
      .then(() => {
        peerRef.current.addStream(mediaRef.current)
      })
      .then(() => {
        return peerRef.current.createAnswer()
      })
      .then(answer => {
        return peerRef.current.setLocalDescription(answer)
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        }
        // ====================== 16. Emit answer payload to server ======================
        socketRef.current.emit('answer', payload)
      })
      .catch(e => console.log('[ERROR] ', e))
  }

  function handleAnswer(message) {
    // Handle answer by the receiving peer
    console.log('[INFO] createFreq Handling Answer', message)
    const desc = new RTCSessionDescription(message.sdp)
    peerRef.current
      .setRemoteDescription(desc)
      .catch(e => console.log('Error handle answer', e))
  }

  function handleEnd() {
    console.log('[INFO] createFreq End')
    setLocalMediaStream(null)
    peerRef.current.close()
    window.location.replace('/')
  }

  async function handleSwitch() {
    console.log('[INFO] createFreq handleSwitch')
    let cameraCount = 0

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()

      devices.map(device => {
        if (device.kind !== 'videoinput') {
          return
        }

        cameraCount = cameraCount + 1
      })
      console.log('[INFO] createFreq', { cameraCount })
    } catch (err) {
      // Handle Error
      console.log('[ERR] createFreq handleSwitch error')
    }
    if (cameraCount > 1) {
      let videoTrack = await mediaRef.current.getVideoTracks()[0]
      videoTrack._switchCamera()
    }
  }

  async function handleOnAndOffCamera() {
    console.log('[INFO] createFreq handleOnAndOffCamera', !isVoiceOnly)
    let videoTrack = await mediaRef.current.getVideoTracks()[0]
    videoTrack.enabled = !isVoiceOnly
    setIsVoiceOnly(!isVoiceOnly)
  }

  function handleNewICECandidateMsg(incoming) {
    console.log('[INFO] createFreq handleNewICECandidateMsg')

    const candidate = new RTCIceCandidate(incoming)

    peerRef.current.addIceCandidate(candidate).catch(e => console.log(e))
  }

  const handleICECandidateEvent = (e) => {
    console.log('[INFO] createFreq handleICECandidateEvent')

    /*
      ICE stands for Interactive Connectivity Establishment. Using this
      peers exchange information over the intenet. When establishing a
      connection between the peers, peers generally look for several
      ICE candidates and then decide which to choose best among possible
      candidates
    */
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
        origin: socketRef.current.id,
      }
      // =========== 22. Emit to server ice candidate ============
      socketRef.current.emit('ice-candidate', payload)
    }
  }

  return !localMediaStream ? (
    <div style={styles.container} >
      <h1>Create Frequency</h1>
      <h1>Baby Room</h1>
      <h4>Scan QR code to join frequency</h4>
      <QRCode size={200} value={room} />
      <h4>OR</h4>
      <h4>Type frequncy ID to join:</h4>
      <h4>{room}</h4>
    </div>
  ) : (
    <div style={styles.container}>
      <h1>Create Frequency</h1>
      <h1>Baby Room</h1>
      <h1>We're LIVE</h1>
    </div>

  )
}