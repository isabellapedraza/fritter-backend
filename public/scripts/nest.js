/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

// function viewAllNests(fields) {
//   fetch('/api/nests')
//     .then(showResponse)
//     .catch(showResponse);
// }
function viewNestsByCreator(fields) {
  fetch(`/api/nests?creator=${fields.creator}`)
    .then(showResponse)
    .catch(showResponse);
}

function createNest(fields) {
  fetch('/api/nests', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
  
//   function editFreet(fields) {
//     fetch(`/api/freets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
//       .then(showResponse)
//       .catch(showResponse);
//   }

function deleteNest(fields) {
  fetch(`/api/nests/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
