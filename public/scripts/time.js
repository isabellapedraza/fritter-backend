/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createTime(fields) {
  fetch('/api/times', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewTimesByCreator(fields) {
  fetch(`/api/times?creator=${fields.creator}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewTimesByGroup(fields) {
  fetch(`/api/times?group=${fields.group}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteTime(fields) {
  fetch(`/api/times/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function editTimeStartTime(fields) {
  fetch(`/api/times/${fields.id}/startTime`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editTimeEndTime(fields) {
  fetch(`/api/times/${fields.id}/endTime`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

