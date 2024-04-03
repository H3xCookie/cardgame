let checked = false

const blur = document.querySelector(".blur-mask")

const cardWrapper = document.querySelector("#card-wrapper")
const addCard = document.querySelector("#add-card")
const cardPopup = document.querySelector("#popup-card")
const closeCard = document.querySelector("#close-card")

const deckWrapper = document.querySelector("#deck-wrapper")
const addDeck = document.querySelector("#add-deck")
const deckPopup = document.querySelector("#popup-deck")
const closeDeck = document.querySelector("#close-deck")
const allBox = document.querySelector('#all-cbox')
const cardBoxes = document.querySelectorAll(".checkbox-cards")

const black = document.querySelector("#black")
black.value = 'off'

const card = document.querySelector(".game-card")


addCard.onclick = () => {
    cardPopup.style.display = "flex";
    cardWrapper.style.display = "flex";
    blur.style.filter = "blur(2px)";
}

addDeck.onclick = () => {
    deckPopup.style.display = "flex";
    deckWrapper.style.display = "flex";
    blur.style.filter = "blur(2px)";
}

black.onchange = () => {
    if(!checked){
        card.classList.remove("white")
        card.classList.add("black")
        black.value = 'on'
        checked = true;
    }else{
        card.classList.remove("black")
        card.classList.add("white")
        black.value = 'off'
        checked = false;
    }
}

closeCard.onclick = () => {
    cardWrapper.style.display = 'none'
    blur.style.filter = 'blur(0px)'
}

closeDeck.onclick = () => {
    deckWrapper.style.display = 'none'
    blur.style.filter = 'blur(0px)'
}

allBox.onchange = () => {
    for(const box of cardBoxes){
        box.checked = !box.checked
    }
}
