$(document).ready(function(){

//отключаем правую клавишу
// $(document).on("contextmenu",function(e){
// 	e.preventDefault();
// });
//маска телефона
$('input[name="phone"]').mask('+7 (999)999-9999');


// $('.fix-menu-js').on('click', function(){
// 	$('#panel').toggleClass('hidden_pannel');
// 	$('#overlay').toggle();
// })

// $('#overlay').on('click', function() {
// 		$('#overlay').hide();
// 		if(!$('#panel').hasClass('hidden_pannel'))
// 			$('#panel').addClass('hidden_pannel');
// });

$('.zakaz_click').magnificPopup({
	type:"inline",
	preloader:false,
	focus: '#phone',
	mainClass:"mfp-with-zoom"
});

if (!getCookie('diskleimer')) {
	setTimeout(function() {
		$('.diskleymer').addClass('diskleymer__active');
	}, 3500);
}

$(document).on('click', '.diskleymer__btn__a',  function(e){
    e.preventDefault();
    if (!getCookie('diskleimer')) {
       $('.diskleymer').removeClass('diskleymer__active');
        setCookie('diskleimer', true);
    }
});

function setCookie(name, value, options) {
    options = options || {};
    var expires = options.expires;
    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }

    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function getCookie(name){
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


$('.popup-modal').magnificPopup({
	type: 'inline',
	preloader: false,
	closeBtnInside:true,
	modal: true
});

$(document).on('click', '.popup-modal-dismiss', function (e){
	e.preventDefault();
	$.magnificPopup.close();
});

$('.header__meny__list').find('a[href^="#"]').click(function () {
	elementClick = $(this).attr("href");
	var nxt = elementClick.slice(1);
	var destination = $("[name=" + nxt + "]").offset().top;
 // destination = destination + $('nav').offset().top;
	$('html, body').stop().animate( { scrollTop: destination }, 1100 );
	return false;
});

//отправляем письмо
$( "form.form" ).on( "submit", function(event) {
		event.preventDefault();
	var form = $('form').data('name');
	var data = $(this).serialize(),
	phone = $(this).find('input[name="phone"]');
	if (phone.val() == "") {
	//	console.log($(this));
		$(this).find('.form__input').addClass('error');
				setTimeout(function() {
					$('.form__input').removeClass('error');
				}, 1500);
		return false;
	} else {
		$.ajax({
			method: "POST",
			url: '/sendmail.php',
			data: data,
			dataType: "json",
			success: function(answer) {

					$('.pop-result').show();
					
					setTimeout(function () {
						$('.pop-result').toggle();
					}, 3000);
	
				  	$( "form" ).trigger('reset');
				  	$.magnificPopup.close();
				//console.log(answer);
			},
			error: function() {
				$( "#formFail" ).dialog( "open" );
			}
		});

		$.ajax({
			type: "POST",
			url: "/data.php",
			data: data,
			success: function(html) {
				console.log('amo send success!' + html);
			},
			error: function(html) {
				console.log(html);
			}
		});

	return false;
			};
});


})