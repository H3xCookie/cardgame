import {io} from 'socket.io-client'

const sendButton = document.querySelector('#send')
const textInput = document.getElementById('input')
const toggleBtn = document.querySelector('#toggle')
const cbNoBtn = document.querySelector('#chat-box-no-button')
const removeButton = document.querySelector('.remove-button')
const playerList = document.getElementById('player-list')
const startBtn = document.querySelector('#start-btn')
const pList = document.querySelector('#p-list')
const status = document.querySelector('#status')
const board = document.querySelector('#board')
const deckBoxes = document.querySelectorAll('.deck-cbox')
const allBox = document.querySelector('#all-cbox')
const hand = document.querySelector('#hand')
const roomSocket = io()

var hiddenChat = false

roomSocket.emit('join-room', room)

roomSocket.on('receive-message', (username, info, message) => {
    if(!info){
        displayMessage((`<b>${username}</b>: ${message}`), info)
    }else{
        displayMessage(message, info)
    }
});

roomSocket.on('start-game', (king, nextRound) => {
    startGame(king == id, nextRound)
})

roomSocket.on('draw-card', (cards, show = true) => {
    cards.forEach(card => {
    console.log('DRAWING: ')
    console.log(card)
        hand.innerHTML +=`
            <div class="game-card small playable" id="${card.id}">
                <span>${card.text}</span>
            </div> 
        `
    })

    if(show){
        hand.style.display = 'flex'
    }
})

roomSocket.on('reveal', (cards, king) => {
    cards.forEach(card => {
        displayCard(card.card.text, card.pId, true, king == id)
    })

    if(king == id){
        for(const card of document.querySelectorAll(".medium.selectable")){
            card.onclick = () => {
                selectCard(card.id)
            }
        }
    }
})

roomSocket.on('reveal-selected', (winnerCardId, winnerName) => {
    console.log('le revealing winner')
    const winnerText = `Победител: ${winnerName}`
    const winnerP = document.createElement('p')
    winnerP.innerText = winnerText

    board.insertBefore(winnerP, board.firstChild)
    console.log(`board.firstChild = ${board.firstChild}`)

    hideWhiteWithoutWinner(winnerCardId)
})

roomSocket.on('update-room', (joining, user) => {
    if(joining){
        pList.innerHTML += `<p id='${user.id}'>${user.username}</p>`
    }else{
        document.getElementById(`${user.id}`).remove()
    }
    joining ? console.log(`${user.username} joining`) : console.log(`${user.username} leaving`)
})

roomSocket.on('redirect', () => {
    window.location = '/lobby'
})

roomSocket.on('receive-card', (card) => {
    displayCard(card.text, card.id)
})

if(removeButton){
    removeButton.onclick = () => {
        roomSocket.emit('remove-room', room)
    }

    startBtn.onclick = () => {
    const decks = []
    for(let i = 0 ; i < deckBoxes.length; i++){
        const box = deckBoxes[i]
        console.log(box)
        if(box.checked){
            decks.push(box.id)
        }
    }
        roomSocket.emit('try-start-game', decks, room, (response) => {
            if(response.status != 'ok'){
                alert(response.status)
            }
        })
    }
}

sendButton.onclick = () => {
    const input = textInput;
    const message = input.value
    if(input.value == '') {
        return;
    }

    displayMessage(message, false, true)
    roomSocket.emit('send-message', room, message)
    input.value = ''
}

toggleBtn.onclick = () => {
    const box = cbNoBtn

    if(hiddenChat){
        box.style.display = 'block';
        hiddenChat = false;
    }else{
        box.style.display = 'none';
        hiddenChat = true;
    }
}

allBox.onchange = () => {
    for(const box of deckBoxes){
        box.checked = !box.checked
    }
}

textInput.addEventListener('keypress', (e) => {
    if(e.key == 'Enter'){
        const input = textInput;
        const message = input.value

        if(input.value == '') {
            return;
        }
        displayMessage(message, false, true)
        roomSocket.emit('send-message', room, message)
        input.value = ''
    }
})




function displayMessage(text, info, own = false){
    const el = document.createElement('li');
    if(own){
        el.style.fontWeight = "bold";
    }else if(info){
        el.style.fontStyle = "italic";
    }
    el.innerHTML = own ? `You: ${text}<hr style="margin: 0px auto">` : `${text}<hr style="margin: 0px auto">`;
    document.querySelector('#chat-ul').appendChild(el)
}

function displayCard(message, id, white = false, selectable = false){
    board.innerHTML += `<div 
    class='game-card medium ${white ? "white" : "black"} ${selectable ? "selectable" : ""}' 
    id=${id}
    >
    <span>${message}</span>
    </div>`
}

function sendCard(id){
    document.getElementById(id).remove()
    roomSocket.emit('send-card', id, (response) => {
        if(response.status == 'ok'){
            hand.style.display = 'none'
        }else{
            alert(response.status)
    }})
}

function selectCard(pId){
    roomSocket.emit('select-card', pId, (response) => {
        if(response.status != 'ok'){
            alert(response.status)
        }else{
            const nextBtn = document.createElement('button')
            nextBtn.innerHTML = "Продължи"
            nextBtn.onclick = () => {
                roomSocket.emit('next-round', (response) =>{
                    hideKing()
                    if(id == response.status){
                        showKing()
                        hideEl(hand)
                    }
                })
            }
            board.appendChild(nextBtn)
        }
    })
}

function hideWhiteWithoutWinner(id){
    const cards = document.querySelectorAll(".white.medium")
    cards.forEach(card => {
        if(card.id != id){
            card.remove()
        }else{
            card.classList.remove('selectable')
            card.onclick = () => {}
        }
    })
}


function startGame(king, firstRound){
    hideEl(playerList)
    const playableCards = document.querySelectorAll('.playable')

    for(const card of playableCards){
        const id = card.id
        card.onclick = () => {
        sendCard(id)
    }}
    
    if(!firstRound) {
        clearBoard()
        showElFlex(hand)
    }
         
    if(king){
        showKing()
        hideEl(hand)
    }else{
        hideKing()
    }
}

roomSocket.on('test', () => {
    console.log('test')
})

function clearBoard(){ board.innerHTML = '' }
function hideEl(el){ el.style.display = 'none' }
function showElFlex(el){ el.style.display = 'flex' }
function showKing(){
    const tsarText = document.createElement('h2')
    tsarText.id = 'tsar-text'
    tsarText.innerHTML = 'Ти си Царя' 
    board.insertBefore(tsarText, board.firstChild)
}
function hideKing() {
    if(document.getElementById("tsar-text")){
        document.getElementById("tsar-text").remove()
    }
}

window.addEventListener("beforeunload", () => {
    roomSocket.emit('leave-room', room)
});