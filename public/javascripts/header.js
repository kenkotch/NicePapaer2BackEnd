$(document).ready(() => {

  // called on DELETE/EDIT success- reloads only table
  function getAndRenderSchedule() {
    $.ajax({
      method: 'GET',
      url: '/schedule',
      success: 'success'
    })
  }

  // DELETE
  $("#schedule .delete").click((e) => {
    e.preventDefault()
    console.log(`delete ${e.target.id}`)
    $.ajax({
      url: `/schedule/${e.target.id}`,
      method: "DELETE",
      success: getAndRenderSchedule()
    })
      .then((data) => {
        $(e.target).closest('tr').hide()
      })
  })

  // DELETE SUPERSCHEDULE
  $("#superSchedule .delete").click((e) => {
    e.preventDefault()
    $.ajax({
      url: `/super/${e.target.id}`,
      method: "DELETE",
      success: (response) => {
        window.location.href = '/super'
      }
    })
  })

  // UPDATE
  $("#editForm").submit((e) => {
    e.preventDefault()
    let id = $('input[name="id"]').val()

    $.ajax({
      url: `/schedule/${id}`,
      method: "PATCH",
      data: $('#editForm').serialize(),
      success: (res) => {
        window.location = '/schedule'
      }
    })
  })

  $("#editProfileForm").submit((e) => {
    e.preventDefault()
    let id = $('input[name="id"]').val()

    $.ajax({
      url: `/profile/${id}/editprofile`,
      method: "PATCH",
      data: $('#editProfileForm').serialize(),
      success: (res) => {
        window.location = '/profile'
      }
    })
  })
})
