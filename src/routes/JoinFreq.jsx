import React, { useRef, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useParams } from "react-router-dom"
import { Container, Button } from '../Components'
import endCall from '../Assests/End_call_icon.png'
import audioSwitch from '../Assests/Camera_off_icon.png'
import switchCam from '../Assests/Switch_cam_icon.png'
import { Size, Color } from '../Theme/Theme'


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

export const JoinFreq = () => {
  const { room } = useParams();
  console.log('[INFO] JoinFreq room:', room)
  const peerRef = useRef()
  const socketRef = useRef()
  const otherUser = useRef()
  const sendChannel = useRef() // Data channel
  const videoRef = useRef(null)
  const audioInterval = useRef()
  const isVoiceOnly = useRef(false)
  const remoteStream = useRef(null)
  const parent = 'parent'

  const [remoteMediaStream, setRemoteMediaStream] = useState(null)
  const [volume, setVolume] = useState(0)

  useEffect(() => {
    console.log('[INFO] JoinFreq useEffect', room)
    socketRef.current = io.connect(URL)
    setTimeout(() => {
      console.log('TIMEDOUT: checking remote stream, ', remoteMediaStream)
      if (!remoteStream.current) {
        // window.location.replace(`enter-freq`)
        window.history.back()
        alert('TIMEDOUT: Can not connect to baby room. Please try again.')

      }
    }, 10000);

    // ====================== 1. Emit joining roomID to server ======================
    socketRef.current.emit('join-freq', { parent, room })

    // ====================== 4. Add Listener for server if there is another user in room ======================
    socketRef.current.on('other-user', userID => {
      console.log('[INFO] JoinFreq other-user', { userID })
      // ====================== 5. Call this other user with userID ======================
      callUser(userID)
      otherUser.current = userID
    })
    // Signals that both peers have joined the room
    socketRef.current.on('user-joined', userID => {
      console.log('[INFO] JoinFreq user-joined', { userID })

      otherUser.current = userID
    })

    socketRef.current.on('offer', handleOffer)

    // ====================== 19. Add Listener for incoming answer ======================
    socketRef.current.on('answer', handleAnswer)
    // ====================== 25. Add Listener for incoming ice-candidate ======================
    socketRef.current.on('ice-candidate', handleNewICECandidateMsg)

    socketRef.current.on('end', handleEnd)

    socketRef.current.on('toggle-audio', handleOnAndOffCamera)

  }, [])

  const getMedia = async () => {
    let voiceOnly = false

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      const audioTrack = await mediaStream.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled

      if (voiceOnly) {
        let videoTrack = await mediaStream.getVideoTracks()[0]
        videoTrack.enabled = false
      }

      peerRef.current.addStream(mediaStream)
      return mediaStream
    } catch (err) {
      // Handle Error
      console.log({ err })
    }
  }

  const Peer = (userID) => {
    console.log('[INFO] JoinFreq Peer')
    /*
      Here we are using Turn and Stun server
      (ref: https://blog.ivrpowers.com/post/technologies/what-is-stun-turn-server/)
    */
    // ====================== 7. Start RTCPeerConnection  ======================
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    peer.ontrack = handleTrackEvnet
    // ====================== 8. Add Listener for hand shake to handle Negotiation need  ======================
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID)
    peer.onaddstream = event => handleAddStream(event)
    return peer
  }

  const callUser = (userID) => {
    // ====================== 6. Initiated a call with Peer() & add peerRef ======================
    console.log('[INFO] JoinFreq Initiated a call')
    peerRef.current = Peer(userID)
    getMedia()
  }

  const handleAddStream = async (event) => {
    console.log('[Join] handleAddStream', { event })
    remoteStream.current = event.stream
    setRemoteMediaStream(event.stream)
    const video = videoRef.current
    video.srcObject = event.stream

    video.addEventListener('loadedmetadata', () => video.play())
    video.addEventListener('timeupdate', async () => {
      const sender = peerRef.current.getReceivers()[0]
      const stats = await sender.getStats()
      const result = stats.values()

      for (let value of result) {
        if (value.audioLevel) {
          // console.log('[INFO] JoinFreq Audio Level')
          // console.log(value.audioLevel);
        }
        // console.log(value)
        // console.log(value?.audioLevel);
        // console.log(value?.totalAudioEnergy);

      }
    })
  }

  const handleNegotiationNeededEvent = (userID) => {
    // Offer made by the initiating peer to the receiving peer.
    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    }
    // ====================== 9. Create offer & setLocalDescription with offer ======================
    peerRef.current.createOffer(sessionConstraints)
      .then(offer => {
        return peerRef.current.setLocalDescription(offer)
      })
      .then(() => {
        console.log('[INFO] JoinFreq handleNegotiationNeededEvent')
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        }
        // ====================== 10. Emit offer to Server ======================
        socketRef.current.emit('offer', payload)
      })
      .catch(err => console.log('Error handling negotiation needed event', err))
  }

  const handleTrackEvnet = (e) => {
    console.log('[INFO] JoinFreq Track received from peer', e)
  }

  function handleOffer(incoming) {
    /*
      Here we are exchanging config information
      between the peers to establish communication
    */
    console.log('[INFO] JoinFreq Handling Offer')
    peerRef.current = Peer()
    peerRef.current.ondatachannel = event => {
      sendChannel.current = event.channel
      sendChannel.current.onmessage = handleReceiveMessage
      console.log('[SUCCESS] JoinFreq Connection established')
    }
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

    peerRef.current
      .setRemoteDescription(desc)
      .then(() => { })
      .then(() => {
        return peerRef.current.createAnswer()
      })
      .then(answer => {
        return peerRef.current.setLocalDescription(answer)
      })
      .then(() => {
        console.log('[INFO] JoinFreq handleOffer answer,')

        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        }

        socketRef.current.emit('answer', payload)
      })
  }

  function handleReceiveMessage(e) {
    // Listener for receiving messages from the peer
    console.log('[INFO] JoinFreq Message received from peer', e.data)
    // setRemoteMediaStream(e.data)
  }

  const handleAnswer = (message) => {
    // Handle answer by the receiving peer
    // =========== 20. Set remote descp and possibly emitting ice candidate event ============
    console.log('[INFO] JoinFreq handleAnswer.')
    const desc = new RTCSessionDescription(message.sdp)

    peerRef.current.setRemoteDescription(desc)
      .catch(e => console.log('Error handle answer', e))
  }

  const handleEnd = () => {
    console.log('[INFO] JoinFreq end')
    setRemoteMediaStream(null)
    peerRef.current.close()
    window.location.replace('/')
  }

  const handleNewICECandidateMsg = (incoming) => {
    // =========== 26. create & set ice candidate to peer  ============
    console.log('[INFO] JoinFreq handleNewICECandidateMsg', incoming)
    const candidate = new RTCIceCandidate(incoming.candidate)

    peerRef.current.addIceCandidate(candidate).catch(e => console.log(e))
  }

  const setAudioInterval = () => {
    // console.log('[INFO] JoinFreq setAudioInterval')
    audioInterval.current = setInterval(async () => {
      const stats = await peerRef.current.getStats()
      for (let value of stats) {
        if (value[1].audioLevel) {
          console.log('[INFO] JoinFreq Stats value', value[1].audioLevel)
          setVolume(value[1].audioLevel * 15)
        }
      }
    }, 100)
  }

  const clearAudioInterval = () => {
    // console.log('[INFO] JoinFreq clearAudioInterval')
    clearInterval(audioInterval.current)
  }

  const handleOnAndOffCamera = () => {
    console.log('[handleOnAndOffCamera] isVoiceOnly: ', isVoiceOnly.current)
    console.log('[handleOnAndOffCamera] remoteMediaStream: ', remoteMediaStream)
    if (isVoiceOnly.current) {
      videoRef.current.style.display = 'none'
      setAudioInterval()
    } else {
      videoRef.current.style.display = 'block'
      clearAudioInterval()
    }
  }

  const emitSwitchCamera = () => {
    socketRef.current.emit('switch-camera')
  }

  const handleEmitEnd = () => {
    socketRef.current.emit('end', room)
    handleEnd()
  }

  const emitToggleAudio = () => {
    console.log('emitToggleAudio', isVoiceOnly.current)
    isVoiceOnly.current = !isVoiceOnly.current
    socketRef.current.emit('toggle-audio')
  }

  console.log('isVoiceOnly: ', isVoiceOnly.current)
  return (
    <Container style={styles.container} >
      <h1>Parent Room</h1>
      <video style={styles.video} ref={videoRef} />
      {isVoiceOnly.current && (
        <div style={{ ...styles.volumeMeter, ...{ transform: `scale(${volume}, ${volume})` } }} />
      )}
      {!remoteMediaStream ? (
        <h1>Connecting...</h1>
      ) : (
        <>
          <div style={styles.buttonContainer}>
            <Button primary icon={audioSwitch} onClick={emitToggleAudio} />
            <Button secondary icon={endCall} onClick={handleEmitEnd} />
            <Button primary icon={switchCam} onClick={emitSwitchCamera} />
          </div>
        </>
      )}
    </Container>
  )
}

const styles = {
  container: {
    paddingTop: 0,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  volumeMeter: {
    width: Size.large,
    height: Size.large,
    backgroundColor: Color.darkGreen,
    borderRadius: Size.xxxlarge,
    margin: 100,
  },
  button: {
    margin: 30
  },
  video: {
    width: 400
  },
};