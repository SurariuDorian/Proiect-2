window.onload = func;

function func() {
    anim = document.getElementById("change");
    anim.onmouseover = function() {
        anim.innerText = "Lorem";

    }
    anim.onmouseleave = function() {
        anim.innerText = " Lorem ipsum dolor sit ";

    }
}



const list = document.getElementById('list');
const formUrl = document.getElementById('formUrl');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');

// fetch the image list
function getImg() {
    fetch('http://localhost:3000/imagini')
        .then(function(response) {
            // Trasform server response to get the image
            response.json().then(function(img) {
                appendImgToDOM(img);
            });
        });
};

// post image
function postImg() {
    // create post object
    const postObject = {
            img: formUrl.value
        }
        // post image
    fetch('http://localhost:3000/imagini', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function() {
        // Get the new image list
        getImg();
        // Reset Form
        resetForm();
    });
}

// delete image
function deleteImg(id) {
    // delete image
    fetch(`http://localhost:3000/imagini/${id}`, {
        method: 'DELETE',
    }).then(function() {
        // Get the new img list
        getImg();
    });
}

// update image
function updateImg(id) {
    // create put object
    const putObject = {
            img: formUrl.value
        }
        // update image
    fetch(`http://localhost:3000/imagini/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function() {
        // Get the new image list
        getImg();

        // change button event from update to add
        addButton.disabled = false;

        // remove all event from update button
        clearUpdateButtonEvents();

        // Reset Form
        resetForm();
    });
}

// copy edited image information to form and add event listener on update button
function editImg(imag) {
    // copy image information to form
    formUrl.value = imag.img;

    // disable add button
    addButton.disabled = true;

    // clear all events update button events
    clearUpdateButtonEvents();

    // enable and add event on update button
    updateButton.disabled = false;
    updateButton.addEventListener('click', function() {
        updateImg(imag.id)
    });

}

// Create and append image DOM tags
function appendImgToDOM(imag) {
    // remove image list if exist
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    // create and append tags
    for (let i = 0; i < imag.length; i++) {
        // create image obj
        let img = document.createElement('img');
        img.src = imag[i].img;

        // create button and event for edit and delete
        let editButton = document.createElement('button')
            // add event on btn and pass image id more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        editButton.addEventListener('click', function() {
            editImg(imag[i])
        });
        editButton.innerText = 'Edit';
        let deleteButton = document.createElement('button')
            // add event on btn and pass image object more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        deleteButton.addEventListener('click', function() {
            deleteImg(imag[i].id)
        });
        deleteButton.innerText = 'Delete';
        // create a container for img
        let container = document.createElement('div');
        // append elements to container
        container.appendChild(img);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        // append container to DOM (list div)
        list.appendChild(container);
    }
}

// reset form
function resetForm() {
    formUrl.value = '';
}
//  remove Update Button to clear events more at https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}
// add event listener on add button
addButton.addEventListener('click', postImg);

// get image
getImg();