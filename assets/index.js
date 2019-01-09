'use strict';

/* eslint-env jquery, browser */
/* global google, AOS, toasty */

(function ($) {
  var $counter = $('.js-counter')
  var $date = $counter.attr('data-date')

  $counter.countdown($date, function (event) {
    $('.js-counter-days').html(event.strftime('%D'))
    $('.js-counter-hours').html(event.strftime('%H'))
    $('.js-counter-minutes').html(event.strftime('%M'))
    $('.js-counter-seconds').html(event.strftime('%S'))
  })

  AOS.init({
    disable: false,
    duration: 900, 
    easing: 'ease',
    once: true
  })


  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    gutter: '.gutter-sizer'
  })

  $grid.imagesLoaded().progress(function () {
    $grid.masonry('layout')
  })

  $(document).on('click', '.js-open-menu', function (e) {
    e.preventDefault()
    var $self = $(this)
    var $icon = $('.icon', $self)
    var iconName = $icon.attr('name')

    var iconAttr = iconName === 'menu' ? 'close' : 'menu'
    $icon.attr('name', iconAttr)
    $('.js-menu').slideToggle('slow')
    $icon.toggleClass('icon--black')
  })

  var sectionsInfo = getSectionsOffset()
  $(window).on('resize', function () {
    sectionsInfo = getSectionsOffset()
  })

  $(document).on('click', '.js-nav-link', function (e) {
    e.preventDefault()

    var target = $(this).attr('href')

    $('html, body').animate(
      {
        scrollTop: $(target).offset().top - 100
      },
      1000
    )
  })

  $(window).on('scroll', debounce(setActiveNavLink, 50))

  $('.js-form').on('submit', function (e) {
    e.preventDefault()
    $('.js-loader').show()
    var $form = $(this)
    var action = $form.attr('action')

    fetch(action, {
      method: 'POST',
      body: new URLSearchParams($form.serialize())
    })
      .then(function (res) {
        if (res.status === 200) {
          $('.js-loader').hide()
          $('.js-form-wrapper').hide()
          $('.js-form-confirmation').show()
          return
        }

        toasty(
          'Oops! Ons kon nie die RSVP verwerk nie. Probeer asb weer.',
          6000
        )
      })
      .catch(function (error) {
        toasty(
          'Oops! Ons kon nie die RSVP verwerk nie. Probeer asb weer.',
          6000
        )
      })
  })

  function getSectionsOffset () {
    var sections = $('.js-section')
    var sectionsInfo = []

    sections.each(function () {
      var $self = $(this)
      sectionsInfo.push({
        id: $self.attr('id'),
        offset: $self.offset().top - 100
      })
    })

    return sectionsInfo
  }

  function setActiveNavLink () {
    var scrollPosition = $(window).scrollTop() + 50
    for (var i = 0; i < sectionsInfo.length; i++) {
      if (scrollPosition >= sectionsInfo[i].offset) {
        $('.js-nav-link').removeClass('active')
        $('.js-nav-link[href="#' + sectionsInfo[i].id + '"]').addClass(
          'active'
        )
      }
    }
  }

  
  function debounce (func, wait) {
    var timeout
    var later = function later () {
      timeout = undefined
      func.call()
    }

    return function () {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(later, wait)
    }
  }

  if (document.location.search === '?enkel') {
    $('.js-guest-input').attr('disabled', true)
  }

  window.initMap = function initMap () {
    // Venue location
    var latlng = { lat: -33.7295, lng: 19.0276 }

    var settings = {
      zoom: 14,
      center: latlng,
      mapTypeControl: false,
      scrollwheel: true,
      draggable: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControl: false,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new window.google.maps.Map(
      document.getElementById('map'),
      settings
    )

    var marker = new google.maps.Marker({ position: latlng, map: map })

    google.maps.event.addDomListener(window, 'resize', handleResize)

    function handleResize () {
      var center = map.getCenter()
      google.maps.event.trigger(map, 'resize')
      map.setCenter(center)
    }
  }
})($)
