var socket = io('/');
const vdGrid = document.getElementById('video-grid');

const peers ={}

const peerHere = new Peer(undefined, {
	host: '/',
	port: '3001'
})

const myVd = document.createElement('video')
myVd.muted = true;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVdStream(myVd, stream);

    peerHere.on('call', call => {
        call.answer(stream)

        const video = document.createElement('video')

        call.on('stream', userVideoStream => {
            addVdStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

peerHere.on("open", id=>{
	socket.emit("join-room", idR, id);
});

socket.on('user-disconnected', userId => {
    console.log("User Disconnected -> "+ userId)
    if(peers[userId]){
        peers[userId].close()
    }
})

function connectToNewUser(userId, stream){
    const call = peerHere.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVdStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVdStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    vdGrid.append(video)
}