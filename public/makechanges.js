const makeChangesButton = document.querySelector('#make-changes-button')

makeChangesButton.addEventListener('click', () => {
    //hit the update end point
    console.log('changes called');
    fetch('/')
    .catch(err => console.error(err))
})