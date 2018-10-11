// Функция рисования рейтинга для карзины
var reiting = function(reit) {
	var stars = '&#xe801;&#xe801;&#xe801;&#xe801;&#xf123;';
	return stars;
};

// Получаем параметры адресной строки
var getUrl = new Promise((resolve) => {
	
	var host = window.location.hostname;
	var port = window.location.port;
	if(port != '') {
		host = host + ':' + port; 
	}
	
	var search = window.location.search.replace('?','');
	var pairs = search.split('&');

	var objPreview = {
		url: window.location.href,
		host: host,
		pathname: window.location.pathname.replace('/',''),
		searchstr: search,
		numSearch: 0,
		search: {
			category: '',
			filtr: '',
			href: '',
			page: '',
			plates: '',
		}
		
	}
	
	pairs.forEach(function(item) {
		var keyItem = item.split('=');
		
		if(keyItem[0] != '' && keyItem[1] != '' && keyItem.length == 2) {
			var key = keyItem[0];
			objPreview.search[key] = keyItem[1];
			
			objPreview.numSearch++;
		}
	});
	console.log(objPreview);
	resolve(objPreview);
});

function buildCart() {
	// Очищаем корзину
	$('.cart-menu').empty();

	// Отправляем запрос на получение списка товаров в корзине
	$.ajax({
		url: 'http://localhost:3000/cart',
		dataType: 'json',
		success: function(cart) {
			// Переменная для хранения стоимости товаров в корзине
			var amount = 0;
			// Переменная для хранения количества товаров в корзине
			var number = 0;
			
			// Создаем блок с товаром в списке
			var $triangle = $('<div />', {
				class: 'triangle triangle-position-cart',
			});	
			
			// Создаем блок с элементами карзины
			var $blockFlex = $('<div />', {
				class: 'cart-flex',
			});	

			// Добавляем базовые элементы карзины в dom
			$('.cart-menu').append($triangle);
			
			// Перебираем товары
			cart.forEach(function(item) {
				// Создаем блок с товаром в списке
				var $div = $('<div />', {
					class: 'cart-item',
				});				
				
				// Создаем картинку товара
				var $img = $('<img>', {
					src: 'img/' + item.img,
					alt: item.name,
				});
				
				// Создаем блок с картинкой в списке
				var $divImg = $('<div />', {
					class: 'cart-menu-photo',
				});
				
				// Добавляем картинку в блок
				$divImg.append($img);
				$div.append($divImg);

				// Создаем блок с описанием товара
				var $divText = $('<div />', {
					class: 'cart-menu-text',
				});					
				
				// Создаем название товара
				var $name = $('<h4 />', {
					text: item.name,
				});				
				
				// Создаем блок со стоимостью
				var $price = $('<p />', {
					text: item.quantity + ' x $' + item.price,
				});	
				
				// звезды
				var $stars = '&#xe801;&#xe801;&#xe801;&#xe801;&#xf123;';
				
				// Создаем рейтинг товара
				var $starReiting = $('<i />', {
					class: 'reiting-icon icon-star',
				});
				
				// добавляем звезды
				$starReiting.append($stars);
				
				// Добавляем описание к товару
				$divText.append($name);
				$divText.append($starReiting);
				$divText.append($price);
				$div.append($divText);
				
				// Создаем блок с кнопкой Удалить
				var $divDel = $('<div />', {
					class: 'cart-menu-close',
				});				
				
				//крестик
				var $cross = '&#xe803;';
				
				// Создаем кнопку для удаления товара из корзины
				var $button = $('<i />', {
					class: 'demo-icon icon-cancel-circled',
					'data-id': item.id,
					'data-quantity': item.quantity,
				});
				
				$button.append($cross);
				
				$divDel.append($button);
				$div.append($divDel);

				// Суммируем 
				amount += +item.quantity * +item.price;
				// Складываем количество товаров
				number += +item.quantity;
				
				// Добавляем все в dom
				$($blockFlex).append($div);
			});

			// Создаем блок со стоимостью всех товаров
			var $divTotal = $('<div />', {
				class: 'cart-total',
			});				

			// Создаем элемент TOTAL
			var $total = $('<p />', {
				text: 'TOTAL',
			});
			
			// Создаем блок со стоимостью всех товаров
			var $priceCount = $('<span />', {
				text: '$' + amount,
			});	
			
			// добавляем общую сумму в карзину
			$divTotal.append($total);
			$divTotal.append($priceCount);
			$($blockFlex).append($divTotal);

			// Создаем ссылку на страницу оформления заказа
			var $linkCheckout = $('<a />', {
				class: 'but-checkout',
				href: 'http://127.0.0.1:8080/checkout.html',
				text: 'Checkout',
			});

			// Создаем ссылку на страницу со списком выбранных товаров
			var $linkCart = $('<a />', {
				class: 'but-go-to-cart',
				href: 'http://127.0.0.1:8080/cart.html',
				text: 'Go to cart',
			});
			
			$($blockFlex).append($linkCheckout);
			$($blockFlex).append($linkCart);

			// Добавляем блок карзины в dom
			$('.cart-menu').append($blockFlex);			
			
			if(number > 0) {
				buildCartNumGoogs(number);
				$('.cart').attr('data-key', 'close');
			}
			else {
				$('.cart').attr('data-key', 'none');
				$('.num-goods').remove();
				$('.cart-menu').css("display", "none");
			}
		}
	})
}

function buildCartNumGoogs(num) {
	$('.num-goods').remove();
	// Создаем блок с количеством товаром в карзине
	var $div = $('<div />', {
		class: 'num-goods',
		text: num,
	});	

	$('.cart').append($div);
}

function buildLiMenu (objCategory, menu, filtr, divLi) {

	// Запрашиваем список пунктов мега меню
	filtr.forEach(function(itemCat) {
		if(objCategory.id === itemCat.id) {
				
				// создаем название блока
				var $divName = $('<h3 />', {
					text: itemCat.name,
				});	

				// Добавляем имя раздела в блок
				divLi.append($divName);
				
			// создаем контейнер списка
			var $divUl = $('<ul />');
	
			itemCat.list.forEach(function(itemList) {
			
				if(objCategory.list.indexOf(itemList.id) != -1) {

					// Создаем пункт меню в списке
					var $li = $('<li />');

					var $a_href = $('<a />', {
						href: '/' + menu.href + '&filtr=' + itemCat.id + '&category=' + itemList.id,
						text: itemList.name,
					});	
					
					$li.append($a_href);
					
					// Добавляем товар в блок
					$divUl.append($li);
				}
			});

			divLi.append($divUl);
		}
	});
	return divLi;
}

function chekArrayMenu(arr, menu, filtr, div) {

	// Запрашиваем список пунктов мега меню
	arr.forEach(function(item) {

		var $divFlex = $('<div />', {
			class: 'mega-menu-flex',
		});	
		
		if(item instanceof Array) {
			div.append(chekArrayMenu(item, menu, filtr, $divFlex));
		}
		else {
			menu.filtr.forEach(function(cat) {
				if(cat.list.length > 0 && cat.id === item) {

					buildLiMenu(cat, menu, filtr, $divFlex);
					div.append($divFlex);
				}
			});
		}
	});
	
	return div;
}		

function buildMegaMenu(item, filtr) {

	// создаем основной контейнер
	var $div = $('<div />', {
		class: 'mega-menu',
	});				

	// создаем треугольник
	var $triangle = $('<div />', {
		class: 'triangle pos-triag-mega-menu',
	});
			
	// Добавляем треугольник в контейнер
	$div.append($triangle);
	
	// получаем список ссылок
	var $list = chekArrayMenu(item.submenu, item, filtr, $div);
	
	$div.append($list);

	return $div;				
}

function buildMenu() {
	
$.ajax('http://localhost:3000/filtr')
.then(function(filtr) {
	// Очищаем меню
	$('.container.nav').empty();

	// Запрашиваем список пунктов главного меню
	$.ajax({
		url: 'http://localhost:3000/menu',
		dataType: 'json',
		success: function(nav) {

			var $ul = $('<ul />', {
				class: 'menu',
			});				
			
			// Перебираем список пунктов меню
			nav.forEach(function(item) {
				
				// Создаем пункт меню в списке
				var $link = $('<li />');
			
				var $a_href = $('<a />', {
					href: '/' + item.href,
					text: item.name,
				});	
				
				$link.append($a_href);
				
				// формируем Мега меню
				if(item.submenu.length > 0) {
					var $megaMenu = buildMegaMenu(item, filtr);
					
					// добавляем Мега меню
					$link.append($megaMenu);
				}
				
				// Добавляем товар в блок
				$ul.append($link);
			});
			
			// Добавляем все в dom
			$('.container.nav').append($ul);	
		}
	});
});
}

function buildGoodsList() {
	// Запрашиваем список товаров на складе
	$.ajax({
		url: 'http://localhost:3000/goods',
		dataType: 'json',
		success: function(cart) {
			// Перебираем список товаров
			cart.forEach(function(item) {
				var $block = $('<div />', {
					class: 'parent-product',
				});			
			
				// Создаем товар в списке
				var $link = $('<a />', {
					class: 'product',
					href: 'http://localhost:3000/goods/' + item.id,
				});
			
				// Создаем картинку товара
				var $img = $('<img>', {
					src: 'img/' + item.img,
					alt: item.name,
				});
			
				// Создаем название товара
				var $name = $('<p />', {
					text: item.name,
				});
			
				// Создаем цену товара
				var $price = $('<span />', {
					text: '$' + item.price,
				});	
			
				// Создаем блок с названием и ценой
				var $info = $('<div />', {
					class: 'product-text',
				});
			
				// Собираем блок картинки с ссылкой
				$info.append($name);
				$info.append($price);
			
				$link.append($img);
				$link.append($info);

				// Создаем картинку кнопки
				var $imgBut = $('<img>', {
					src: 'img/cart-white.svg',
					alt: 'cart',
				});

				// Создаем ссылку для кнопки
				var $linkBut = $('<div />', {
					class: 'add-to-cart',
				});

				// Добавляем картинку кнопке добавить
				$linkBut.append($imgBut);
				$linkBut.append('Add to Cart');
			
				// Создаем кнопку для покупки
				var $button = $('<div />', {
					class: 'position-add-to-cart',
					'data-id': item.id,
					'data-name': item.name,
					'data-price': item.price,
					'data-img': item.img,
				});

				// Добавляем товар в блок
				$button.append($linkBut);
			
				// Добавляем товар в блок
				$block.append($link);
				$block.append($button);
			
				// Добавляем все в dom
				$('.products').append($block);			
			});
		}
	})
}

// формируем список категорий для фильтра
function getFiltrCategory(category, arrCategory, url, ul) {
	var $ul = ul;
	// перебираем пункты категорий фильтров
	category.list.forEach(function(arr) {
		// если в массиве пунктов для выбранного раздела есть текущий пункт,
		// создаем его
		if(arrCategory.indexOf(arr.id) != -1) {
			// Создаем пункт меню в списке
			var $link = $('<li />');
			
			var filtr = '';
			if(category.id != '') {
				filtr = '&filtr=' + category.id;
			}	

			var categ = '';
			if(arr.id != '') {
				categ = '&category=' + arr.id;
			}				
			
			var $a_href = $('<a />', {
				href: url.pathname + '?href=' + url.search.href + filtr + categ,
				text: arr.name,
			});	
			
			if(+url.search.category === +arr.id && +url.search.filtr === +category.id) {
				$a_href.addClass('red');
			}
			
			$link.append($a_href);
			$ul.append($link);						
		}
		
	});
	return $ul;
}


// получаем список фильтров, и выбираем достпупные для данной категории
function getMenuFiltr(object, url) {
	$.ajax({
		url: 'http://localhost:3000/filtr',
		dataType: 'json',
		success: function(filtr) {
			// перебираем фильтр с доступными массивами категорий
			object.filtr.forEach(function(cat) {
				
				// если в массиве 1 и более, получаем данные пунктов для фильтра
				if(cat.list.length > 0) {
					
					// перебираем список возможных фильтров для страницы
					filtr.every(function(list) {
						if(+cat.id === +list.id) {
							
							if(+url.search.filtr === +list.id) {
								
								var $details = $('<details />', {
									open: "",
								});	
							}
							else {
								var $details = $('<details />');
							}
							
							var $summary = $('<summary />', {
								text: list.name,
							});	
							$details.append($summary);
							
							var $ul = $('<ul />');
							
							$ul = getFiltrCategory(list, cat.list, url, $ul);
							
							$details.append($ul);
							// Добавляем все в dom
							$('.menu-filtr').append($details);
							return false;
						}
						else {
							return true;
						}
					});
				}
			});
		}
	});
}

// загружаем полный список категорий фильтра
function getAllFiltr(url) {
	$.ajax({
		url: 'http://localhost:3000/filtr',
		dataType: 'json',
		success: function(filtr) {
				
			// перебираем список возможных фильтров для страницы
			filtr.forEach(function(list) {

				if(+url.search.filtr === +list.id) {
								
					var $details = $('<details />', {
						open: "",
					});	
				}
				else {
					var $details = $('<details />');
				}

				var $summary = $('<summary />', {
					text: list.name,
				});	

				$details.append($summary);
							
				var $ul = $('<ul />');
	
					list.list.forEach(function(cat) {
						// Создаем пункт меню в списке
						var $link = $('<li />');
			
						var $a_href = $('<a />', {
							href: url.pathname + '?filtr=' + list.id + '&category=' + cat.id,
							text: cat.name,
						});	
			
						if(+url.search.category === +cat.id && +url.search.filtr === +list.id) {
							$a_href.addClass('red');
						}
			
						$link.append($a_href);
						$ul.append($link);						
					});
							
				$details.append($ul);
				// Добавляем все в dom
				$('.menu-filtr').append($details);
			});
		}
	});
}

// строим левое вертикальное меню с категориями товаров
function buildMenuFiltr(url, menu) {

	// Очищаем меню
	$('.menu-filtr').empty();
		
	buildPageNavigation(url, 40);
			
	if(url.search.href !== '') {
		// Перебираем пункты главного меню
		menu.every(function(object) {
			// если встречаем индекс текущей страницы равный пункту меню, получаем список фильтров
			if(+url.search.href === object.id) {
				getMenuFiltr(object, url);
					return false;
			}
			else {
				return true;
			}			
		});
	}
	else {
		getAllFiltr(url);
	}
}

// формируем элементы страницы
function buildPage(url) {

	// Очищаем меню
	$('.menu-filtr').empty();
	
	$.ajax({
		url: 'http://localhost:3000/menu',
		dataType: 'json',
		success: function(menu) {
			
			buildPageNavigation(url, 40);
			
			buildMenuFiltr(url, menu);
		}
	});
}

// строим навигацию по страницам
function buildPageNavigation(src, count) {
	
	var url = {};
	url = src;
	
	$('.page-menu').empty();
	
	if(count > 0) {

		// определяем количество товара на странице
		var pagePlates;
		if(url.search.plates == '') {
			pagePlates = 3;
		}
		else {
			pagePlates = +url.search.plates;
		}
		
		// получаем количество страниц
		var countPages = Math.ceil(+count / pagePlates);
		
		var forCount;
		if(countPages < pagePlates) {
			forCount = countPages;
		}
		else {
			forCount = 6;
		}

		// определяем текущую страницу
		var pageNow;
		if(url.search.page == '' || url.search.page > countPages || url.search.page < 1) {
			pageNow = 1;
			url.search.page = 1;
		}
		else {
			pageNow = +url.search.page;
		}		
		
		// определяем с какой страницы начинать старт
		var countStart;
		var countFinish;
		
		if((countPages - pageNow) < forCount/2) {
			countStart = pageNow - forCount/2;
			countFinish = countPages;
		}
		else if(pageNow <= forCount/2) {
			countStart = 1;
			countFinish = forCount;
		}
		else {
			countStart = pageNow - forCount/2;
			countFinish = pageNow + forCount/2;
		}

		if(url.searchstr.indexOf("page=" + pageNow) != -1) {
			var newLink = url.searchstr;
		}
		else {
			if(url.numSearch === 0) {
				var newLink = url.searchstr + "page=" + pageNow;
			}
			else {
				var newLink = url.searchstr + "&page=" + pageNow;
			}
		}

		// создаем блок навигации страниц
		var $blockNav = $('<div />', {
			class: 'page-nav',
		});
		
		var $iPreviewPage = $('<i />', {
			class: 'demo-page icon-angle-left',
			html: '&#xf104;',
		});

		if(pageNow !== 1) {
			var $aPreviewPage = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=" + (pageNow - 1)),
				class: 'active-page',
			});

			$aPreviewPage.append($iPreviewPage);
			$iPreviewPage = $aPreviewPage;
		}
		
		$blockNav.append($iPreviewPage);		
		
		// если страниц на 2 и более больше, чем количество цикла countPages
		if (pageNow - forCount/2 > 2) {
			var $dots_before = $('<span />', {
				class: 'page-nav-dote',
				text: '.....',
			});				
			
			var $a_first = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=1"),
			});
			
			var $span_first = $('<span />', {
				text: 1,
			});			
			
			$a_first.append($span_first);

			$blockNav.append($a_first);
			$blockNav.append($dots_before);
		}		
		
		// если страниц на 1 меньше
		if (pageNow - forCount/2 === 2) {
			var $a_preview = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=1"),
			});
			
			var $span_preview = $('<span />', {
				text: 1,
			});			
			
			$a_preview.append($span_preview);
			
			$blockNav.append($a_preview);
		}		
		
		// Цикл запустится столько раз, сколько у нас страниц
		for (var page = countStart; page <= countFinish; page++) {
			// создаем ссылку на страницу
			var $a_href = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=" + page),
			});
			
			var $span = $('<span />', {
				text: page,
			});			
			
			$a_href.append($span);
			
			if(pageNow === page) {
				$a_href.addClass('active-page');
			}
			
			$blockNav.append($a_href);
		}
		
		var numNextPage = pageNow + 1;
	
		// если страниц на 1 больше
		if (countPages === forCount + 1) {
			var $a_next = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=" + numNextPage),
			});
			
			var $span_next = $('<span />', {
				text: forCount + 1,
			});			
			
			$a_next.append($span_next);
			
			if(pageNow === forCount + 1) {
				$a_next.addClass('active-page');
			}
			
			$blockNav.append($a_next);
		}
		
		
		
		var $iNextPage = $('<i />', {
			href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=" + numNextPage),
			class: 'demo-page icon-angle-right',
			html: '&#xf105;',
		});

		// если страниц на 2 и более больше, чем количество цикла countPages
		if (countPages - numNextPage >= forCount/2) {
			var $dots_after = $('<span />', {
				class: 'page-nav-dote',
				text: '.....',
			});				
			
			var $a_last = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=" + countPages),
			});
			
			var $span_last = $('<span />', {
				text: countPages,
			});			
			
			$a_last.append($span_last);
			
			$blockNav.append($dots_after);
			$blockNav.append($a_last);
		}	
		//console.log(numNextPage - countPages);
		if(countPages - numNextPage >= 0) {
			var $aNextPage = $('<a />', {
				href: url.pathname + '?' + newLink.replace("page=" + pageNow, "page=" + numNextPage),
				class: 'active-page',
			});

			$aNextPage.append($iNextPage);
			$iNextPage = $aNextPage;
		}
		
		$blockNav.append($iNextPage);
		
		var $a_all = $('<a />', {
				href: '/' + url.pathname,
				class: 'show-all-items',
				text: 'View All',
		});
		
		$('.page-menu').append($blockNav);
		$('.page-menu').append($a_all);
	}
}

// получаем список товаров, соответствующих определенной категории
function getPageNavigation(src, count) {
	
}



(function($) {
	$(function() {

		// получаем ссылку, и передаем её для построения меню (для индикации выбранного пункта меню \ДОДЕЛАТЬ\)
		getUrl.then(result => { buildMenu(); return result; })
		// отрисовываем элементы страницы (фильтры, меню страниц, \ДОДЕЛАТЬ\ отображение товаров и сортировку)
		.then(result => buildPage(result));
		
		// Рисуем корзину
		buildCart();
		// Рисуем список товаров (\ДОДЕЛАТЬ\ перейдет в функцию buildPage)
		buildGoodsList();

    // Слушаем нажатия на кнопку Карзины
    $('.cart-box').on('click', '.cart', function() {
		var status = $(this).attr('data-key');
		if(status != 'none') {
			if(status === 'close') {
				$('.cart-menu').css("display", "flex");
				$('.cart').attr('data-key', 'open');
			}
			else {
				$('.cart-menu').css("display", "none");
				$('.cart').attr('data-key', 'close');
			
			}
		}
	});		
		
    // Слушаем нажатия на кнопку Купить
    $('.products').on('click', '.position-add-to-cart', function() {
		// Определяем id товара, который пользователь хочет удалить
		var id = $(this).attr('data-id');

		// Пробуем найти такой товар в карзине
		var entity = $('.cart-menu [data-id="' + id + '"]');
		if(entity.length) {
			// Товар в корзине есть, отправляем запрос на увеличение количества
			$.ajax({
				url: 'http://localhost:3000/cart/' + id,
				type: 'PATCH',
				headers: {
					'content-type': 'application/json',
				},
				data: JSON.stringify({
					quantity: +$(entity).attr('data-quantity') + 1,
				}),
				success: function() {
					// Перестраиваем корзину
					buildCart();
				}
			})
		} 
		else {
			// Товара в корзине нет - создаем в количестве 1
			$.ajax({
				url: 'http://localhost:3000/cart',
				type: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				data: JSON.stringify({
					id: id,
					quantity: 1,
					name: $(this).attr('data-name'),
					price: $(this).attr('data-price'),
					img: $(this).attr('data-img'),
				}),
				success: function() {
					// Перерисовываем корзину
					buildCart();
				}
			})
		}
	 
	});
	

	// Слушаем нажатия на удаление товара из корзины
    $('.cart-box').on('click', '.icon-cancel-circled', function() {
		// Получаем id товара, который пользователь хочет удалить
		var id = $(this).attr('data-id');

		var entity = $('.cart-menu [data-id="' + id + '"]');
		// Отправляем запрос на удаление
		$.ajax({
			url: 'http://localhost:3000/cart/' + id,
			type: 'DELETE',
			headers: {
				'content-type': 'application/json',
			},
			data: JSON.stringify({
				quantity: +$(entity).attr('data-quantity') + 1,
			}),
			success: function() {
				// Перерисовываем корзины
				buildCart();
			}
		})
	});

	});
})(jQuery);