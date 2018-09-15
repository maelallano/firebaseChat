const messagesRef = firebase.database().ref("messages/");

// Pseudo set to $author or Anon if prompt null/undefined/""
let author = prompt('Enter you name: ');
if (author === "" || author === null || author === undefined) {
    author = "Anon";
}

const messagesContainer = document.querySelector('.messagesContainer');
const form = document.querySelector('.sendMessForm');


// add message to firebase db
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const content= document.querySelector('.sendMessForm__input').value;
    const date = newDate();

    messagesRef.push ({
        author: author,
        content: content,
        date: date
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    document.querySelector('.sendMessForm__input').value = "";
});


// display message into the chat
const displayMessage = (author, content, date) => {
    const html = `
        <div class="singleMess">
        <p class="singleMess__author">${author}: </p>
        <p class="singleMess__content">${content}</p>
        <p class="singleMess__date">à ${date}</p>
        </div>
    `;

    messagesContainer.innerHTML += html;
};


// get messages content
const getMessages = data => {
    for (variable in data.messages) {
        displayMessage(data.messages[variable].author, data.messages[variable].content, data.messages[variable].date)
    }
};


const ref = firebase.database().ref();


// get messages from firebase db once when the page is loaded
ref.once("value", function(snapshot) {
    getMessages(snapshot.val());

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}, function (error) {
    console.log("Error: " + error.code);
});


// get messages from firebase db everytime a new message is added
ref.on("value", function(snapshot) {
    const messagesKeys = Object.keys(snapshot.val().messages);
    const newMessage = snapshot.val().messages[messagesKeys[messagesKeys.length - 1]];

    displayMessage(newMessage.author, newMessage.content, newMessage.date);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}, function (error) {
        console.log("Error: " + error.code);
});


// get current date
const newDate = () => {
    const d = new Date();

    return `${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}:${d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}`;
}


/*---------------------- Smiley --------------------------*/

const btn = document.querySelector('.app_smileys button');
const ul = document.querySelector('.app_smileys ul');
const li = document.querySelectorAll('.app_smileys li');

btn.addEventListener('click', function() {
    ul.classList.toggle('is-active');
});

for (var i = 0; i < li.length; i++) {
    li[i].addEventListener('click', function() {
        document.querySelector('.sendMessForm__input').value += this.textContent;
        ul.classList.remove('is-active');
        document.querySelector('.sendMessForm__input').focus()
    });
}

/*---------------------------------------------------------------*/


/*---------------------- Drag the chat --------------------------*/

// target elements with the "draggable" class
interact('.draggable')
.draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
        restriction: "parent",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener
});

function dragMoveListener (event) {
var target = event.target,
// keep the dragged position in the data-x/data-y attributes
x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

// translate the element
target.style.webkitTransform =
target.style.transform =
'translate(' + x + 'px, ' + y + 'px)';

// update the posiion attributes
target.setAttribute('data-x', x);
target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

/*--------------------------------------------------------------*/