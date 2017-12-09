$(document).ready(() => {

  function getAndRenderSchedule() {
    $.ajax({
      method: 'GET',
      url: '/schedule',
      success: 'success'
    })
  }

  if (document.location.href.match(/register$/)) {
    $('#newOwner').submit((event) => {
      event.preventDefault()

      let data = $('#newOwner').serialize()

      $.post("/register", data, null, 'json').then((data) => {
        document.location = '/'
      })
        .fail((err) => {
          $('#errorMessage').html(`<div>${err.responseText}</div>`)
        })
    })
  }

  if (document.location.href.match(/\/$/)) {

    $('#loginForm').submit((event) => {
      event.preventDefault()

      let data = $('#loginForm').serialize()

      $.post('/token', data, null, 'json').then((data) => {
        if (Number(data.role) === 1) {
          document.location = '/super'
        } else {
          document.location = '/schedule'
        }
      })
        .fail((err) => {
          $('#errorMessage').html(`<div>${err.responseText}</div>`)
        })
    })
  }

  $('#logout').click(() => {
    $.ajax({
      method: 'DELETE',
      url: '/token',
      success: 'success'
    }).then(() => {
      document.location = '/'
    })
  })

  $('.userSched').click((e) => {
    let id = `${e.target.id}`

    $.ajax({
      method: 'GET',
      url: '/super',
      success: 'success'
    }).then((res) => {
      document.location = `/schedule/${id}`
    })
  })
  // $('.userSched').click((e) => {
  //   console.log('clicked on', e.target.id)
  //   let data = `id=${e.target.id}`
  //   console.log(data)
  //
  //   $.get('/super', data, null, 'json')
  //   .then((data) => {
  //     console.log('data returning from super', data[0])
  //     $.get('/schedule', data, null, 'json')
  //   })
  // })
})
