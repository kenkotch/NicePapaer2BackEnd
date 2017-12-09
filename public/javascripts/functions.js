$(document).ready(() => {

  // gives current page class=active
  $(".active").each(() => {
    $(this).removeClass("active")
  })
  switch (window.location.pathname) {
    case '/':
      $("#home").addClass("active")
      break
    case '/register':
      $("#register").addClass("active")
      break
    case '/schedule':
      $("#schedule").addClass("active")
      break
    case '/profile':
      $("#profile").addClass("active")
      break
    case '/super':
      $("#super").addClass("active")
      break
    default:
      $("#home").addClass("active")
  }

  if (window.location.pathname === '/' || window.location.pathname === '/register') {
    $("#home").show()
    $('.planeLink').show()
    $('.planeNo').hide()
  } else {
    $("#home").hide()
    $('.planeLink').hide()
    $('.planeNo').show()
  }
})
