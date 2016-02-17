var url   = "http://client.nameu.com.br/api";
var glbaproduct		= {id:0, sku:0, fltype:0};
var glbacategory	= {id:0, pg:0, ra:10};
var glbageo			= {latitude:0, longitude:0};
var glbaadress		= {id:0, logradouro:"", rua:"", numero:"", cep:"", bairro:"", latitude:0, longitude:0};
var glbaaffiliate	= {id:0, cep:"", all:0, allcart:0, email:''};
var glbashipping	= {id:0, price:0};
var glbidhelpdesk	= 0;
var gblasocialu		= {idtheme:0, idmessage:0};
var gblfind			= "";
var gblidpushu		= 0;
var gblidorder		= 0;
var gblapay			= {id:0, method:'', idorder:0};
var gblacart_prod	= {itemId1: 0, itemDescription1: '', itemAmount1: 0, itemQuantity1:0};
var gblauser		= {CPF:"",birthdate:""};

var gblenviroment   = true; // true = sandbox ; false = production

var gblacard = {cdCard:"", cdToken: "", cdbrand: "", cdParc: 0, cdValue : 0 , cdMinParc: 1};

var loadhome = true;
var comment_get;
var helpdesk;

var hasSessionId = false; 


/// --  variavel que recebe o nome da página anterior
/// -- by Rafa
var getBackPage = '';
var arrObjAddressLoja = [];


$(document).ready(function(){
	toogle_return();
    NameU_MenuCircle_Hide(0);
    NameU_MenuCircle_Hide(1);
    init_navigation_center();
    document.addEventListener("deviceready", onDeviceReady, false);
	
	setaffiliates();
    var alutura = $(window).innerHeight()*0.35;
	$('.menu_btn').css({ bottom: alutura});
    


	///-- Verificando se existe uma loja selecionada e atribuindo os dados ao Obj
	///-- by Rafa
	if(localStorage.getItem('lojaselecionada'))
	{
		var objLoja = JSON.parse(localStorage.getItem('lojaselecionada'));
		glbaaffiliate.id = objLoja.allData.id;
		glbaaffiliate.cep = objLoja.allData.cep;
		glbaaffiliate.all = objLoja.allData.all;
		glbaaffiliate.allcart = objLoja.allData.allcart;
		glbaaffiliate.email = objLoja.allData.email;

		if(glbaaffiliate["id"] > 0){
			$(".NameU-img-sacola").attr("src", "img/sacola-on.png");
		}else{
			$(".NameU-img-sacola").attr("src", "img/sacola-off.png");
			glbaaffiliate["id"] = "";
		}
	}
	
});

// ///////////////////////////////////////////////// FUNÇÕES DE INTERFACE /////////////////////////////////////////////////
function menu_app(menu){
    var ctx_menu =  '' +
                '<div class="control_top" onclick="loginsetpagedb(\'#vw_profile\')">' +
                '    <img class="fotos" src="img/side-connect.png" width="30px" height="30px" id="profile_image"> ' +
					'    <div class="connect_link">' +
				'';
	ctx_menu += gblauserdb["flstate"] ? gblauserdb["nickname"] + '<br><small>' + gblauserdb["email"] + '<small>' : '' +
				'        <a href="#">Entrar</a> ' +
				'        &bull;' +
				'        <a href="#">Cadastre-se</a>';
    ctx_menu += '' +
					'    </div>' +
				'</div>' +
				'<ul>' +
                '    <li onclick="NameU_Tredir(\'#vw_home\')"><a href="#">Início</a></li>' +
                '    <li onclick="NameU_Tredir(\'#vw_cart\')"><a href="#">Minha Sacola</a></li>' +
                '    <li onclick="loginsetpagedb(\'#vw_my_order\')"><a href="#">Meus Pedidos</a></li>' +
                '    <li onclick="loginsetpagedb(\'#vw_wishlist\')"><a href="#">Meus Favoritos</a></li>' +
                '    <li onclick="NameU_Tredir(\'#vw_socialu\')"><a href="#">Trends</a></li>' +
                '    <li onclick="NameU_Tredir(\'#vw_storeu\')"><a href="#">Vitrine</a></li>' +
                '    <li onclick="NameU_Tredir(\'#vw_affiliate\')"><a href="#">Lojas próximas a mim</a></li>' +
                '    <li onclick="loginsetpagedb(\'#vw_help_desk\')"><a href="#">Atendimento</a></li>' +
                '    <li onclick="termsofuse()"><a href="#">Termos de uso</a></li>' +
                '</ul>';
    $(menu).empty().append(ctx_menu);
}


///// -- by Rafa -14-02
///// -- Function Wizard que chama a geolocation e redireciona para a tela de selecionar a loja mais prox

function callgeolocation_fromwinzard(){

	getBackPage = 'vw_wizard';

	NameU_Interacao_Top_Time("Por favor aguarde!", 1500);

	if(!localStorage.getItem('lojaselecionada')){

		navigator.geolocation.getCurrentPosition(
		function(position){


				glbaadress["latitude"] = position.coords.latitude;
				glbaadress["longitude"] = position.coords.longitude;
				


				///--CARREGANDO O ENDEREÇO DE ACORDO COM A LATITUDE E LONGITUDE
				$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude, function(data){

					if(data.status == 'OK'){

						glbaadress["logradouro"] = data.results[0].address_components[1].long_name + ', ' 
												 + data.results[0].address_components[0].long_name + ' - ' 
												 + data.results[0].address_components[7].long_name + ' - ' 
												 + data.results[0].address_components[2].long_name;
						glbaadress["rua"] = data.results[0].address_components[1].long_name;
						glbaadress["numero"] = data.results[0].address_components[0].long_name;
						glbaadress["cep"] = data.results[0].address_components[7].long_name;
						glbaadress["bairro"] = data.results[0].address_components[2].long_name;
						glbaadress["latitude"]   = position.coords.latitude;
						glbaadress["longitude"]  = position.coords.longitude;

						localStorage.setItem('user_address', JSON.stringify(glbaadress));

					}
					else if(data.status == 'ZERO_RESULTS')
					{

					}
				});

				if(gblaheaders.Authorization.length > 0){
					savepeopleaddress('ADDRESS',0,glbaadress.cep,glbaadress.rua,glbaadress.numero,'',glbaadress.bairro,'','','',0,glbaadress.latitude,glbaadress.longitude);
				}
				storeavailable();


			NameU_Tredir('#vw_affiliate');

			console.log(localStorage.getItem('lojaselecionada'))

		}, 
		function(error){

			//NameU_Interacao_Top("Por favor ative sua localização para que possamos encontrar as lojas para você!");

			///--- notifications.handleNotification(obj);
			///--- Method para chamar notificações de Alert ou Confirm passando os parâmetros por OBJ
			///--- by Rafa

			notifications.handleNotification(
						{
						tipo:'confirm',
						message:'Por favor, é necessário que sua localização esteja ativa. Deseja continuar assim mesmo?',
						callback:function(index){ 

							if(index == 2){
								NameU_Tredir('#vw_affiliate');
							}
						},
						title:'Atenção',
						textButton:['Fechar', 'Ok']
						});

		}, 
		{timeout: 5000, enableHighAccuracy: true});

	}
	else
	{
				var lojaAddress = JSON.parse(localStorage.getItem('user_address'));

				console.log(lojaAddress)
				///--CARREGANDO O ENDEREÇO DE ACORDO COM A LATITUDE E LONGITUDE
				$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lojaAddress.latitude+','+lojaAddress.longitude, function(data){

					if(data.status == 'OK'){

						glbaadress["logradouro"] = data.results[0].address_components[1].long_name + ', ' 
												 + data.results[0].address_components[0].long_name + ' - ' 
												 + data.results[0].address_components[7].long_name + ' - ' 
												 + data.results[0].address_components[2].long_name;
						glbaadress["rua"] = data.results[0].address_components[1].long_name;
						glbaadress["numero"] = data.results[0].address_components[0].long_name;
						glbaadress["cep"] = data.results[0].address_components[7].long_name;
						glbaadress["bairro"] = data.results[0].address_components[2].long_name;
						glbaadress["latitude"]   = lojaAddress.latitude;
						glbaadress["longitude"]  = lojaAddress.longitude;


						if(gblaheaders.Authorization.length > 0){
							savepeopleaddress('ADDRESS',0,glbaadress.cep,glbaadress.rua,glbaadress.numero,'',glbaadress.bairro,'','','',0,glbaadress.latitude,glbaadress.longitude);
						}
						storeavailable();

					}
					else if(data.status == 'ZERO_RESULTS')
					{

					}
				});

		NameU_Tredir('#vw_home');
	}

	
}
// //////////////////////////////////////////// NAVIGATION CONTROL /////////////////////////////////////////////////
function init_navigation_center(){
    $('.bar01').click(function(){
		loginsetpagedb("#vw_profile");
    });

    $('.bar02').click(function(){
		NameU_Tredir("#vw_cart");
    });
    
    $('.bar03').click(function(){
		NameU_Tredir_Up("#vw_wishlist");
    });
    
    $('.bar04').click(function(){
		NameU_Tredir("#vw_socialu");
    });
    
    $('.bar05').click(function(){
		NameU_Tredir_Up("#vw_search");
    });
}

function priceproduct(final_price, tier_price, obj){
	var valor = "";
	var pffinal_price = parseFloat(final_price);
	var pftier_price = parseFloat(tier_price);
	if(final_price <= 0){
		valor = "";
	}else if(pffinal_price > pftier_price){
		if(tier_price <= 0){
			valor = '<span class="tier_product_box_grey">por </span><span class="tier_product_box">' + NameU_pontue(pffinal_price, 2, ",", ".") + '</span>';
		}else{
			valor = '<span class="price_product_tier_box_grey">de </span><span class="price_product_tier_box">' + NameU_pontue(pffinal_price, 2, ",", ".") + '</span> ' +
					'<span class="tier_product_box_grey">por </span><span class="tier_product_box">' + NameU_pontue(pftier_price, 2, ",", ".") + '</span>';
		}
	}else{
		valor = '<span class="tier_product_box_grey">por </span><span class="tier_product_box">' + NameU_pontue(pffinal_price, 2, ",", ".") + '</span>';
	}
    if( typeof obj === 'undefined' || obj === null ){
        return valor;
    }else{
        $(obj).empty().append(valor).trigger("create");
    }
}

function adddevice(){
    $.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/adddevice",
        data: {  regid:gbl_device.regid
               , cordova:gbl_device.cordova
               , model:gbl_device.model
               , platform:gbl_device.platform
               , version:gbl_device.version
               , isvirtual:gbl_device.isVirtual
               , serial:gbl_device.serial},
		cache: false
	})
	.done(function(data) { 
        //NameU_Interacao_Top(data.msg);
    })
	.fail(function(xhr, err) {
        //NameU_Fail(xhr, err);
    })
	.always(function() { }); 
    
}

function termsofuse(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/termsofuse",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.termsofuse;
				$("#text_termo").empty().append(linha.content + " <br><br> <small>Última alteração em: " + NameU_DateTime_BR(linha.dtupdate) + "</small>");
				NameU_LoadingPage_Hide();
				NameU_Tredir_Up("#vw_terms_privacy");
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function setmoretheme(id){
	gblasocialu["idtheme"] = id;
	gettheme();
}
function moretheme(local){
	$(local).empty();
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/moretheme",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.moretheme, function(k,v){
					var linha = obj.moretheme[k];
					items.push('<a href="#" onclick="setmoretheme(' + linha.idtenant_social_group + ')" class="link">' + linha.group_hashtag + '</a>');
				});
				var list = items.join(' ');
				$(local).append(list);
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function get_mylocal_gbl(mylocal_obj,update){
    $(mylocal_obj).empty();
    if (glbaadress.logradouro != ""){
        var items = [];
		var funconclick = update ? ' onclick="mylocal()"' : '';
        items.push('<li' + funconclick + '>' +
					'	' + glbaadress.logradouro.replace(/\,/g, "<br>") +
					'</li>');
        var list = items.join(' ');
        $(mylocal_obj).append(list).listview().listview('refresh');
    }
}

function get_affiliate_gbl(store_affiliate){
    $(store_affiliate).empty();
    if (glbaaffiliate["id"] > 0){
        NameU_LoadingPage_Show();
        $.ajax({ 
            headers: gblaheaders,
            type: "GET",
            url: url + "/getaffiliates/" + glbaaffiliate["id"],
            cache: false
        })
        .done(function(data) {
            var obj = data;
            if (obj.error == 0){
                if (obj.retorno > 0){
                    var items = [];
                        var linha = obj.getaffiliates;
                        var dataadr = obj.getaffiliates["ADDRESS"];
                        var dataphn = obj.getaffiliates["PHONE"];
                        var dataweb = obj.getaffiliates["WEB"];
                        var htmladdress = "";
                        var htmlphone = "";
                        var htmlweb = "";
                            // ADDRESS
                            if(dataadr[2] > 0){
                                $.each(dataadr[1], function(ka,va){
                                    // idtenant_affiliates_address
                                    var linhaaddress = dataadr[1][ka];
                                    var aref_number = linhaaddress.ref_number.length > 0 ? ', ' + linhaaddress.ref_number: '';
                                    var acomplement = linhaaddress.complement.length > 0 ? ' - ' + linhaaddress.complement: '';
                                    var acity = linhaaddress.city.length > 0 ? linhaaddress.city : '';
                                    var adistrict = linhaaddress.district.length > 0 ? '<br>' + linhaaddress.district + (linhaaddress.city.length > 0 ? ' - ' + linhaaddress.city: ''): '<br>' + acity;
                                    var acountry = linhaaddress.country.length > 0 ? linhaaddress.country: '';
                                    var astates = linhaaddress.states.length > 0 ? linhaaddress.states + (linhaaddress.country.length > 0 ? ' - ' + linhaaddress.country: ''): acountry;
                                    var azip_code = linhaaddress.zip_code.length > 0 ? '<br>' + linhaaddress.zip_code + (astates.length > 0 ? ' - ' + astates: ''): (astates.length > 0 ? '<br>' + astates: '');
                                    htmladdress += '<br>' + linhaaddress.address + aref_number + acomplement + adistrict + azip_code;
                                });
                            }
                            // PHONE
                            if(dataphn[2] > 0){
                                $.each(dataphn[1], function(kp,vp){
                                    // idtenant_affiliates_phone
                                    var linhaphone = dataphn[1][kp];
                                    var pprefixcode = linhaphone.prefixcode.length > 0 ? '(' + linhaphone.prefixcode + ') ': '';
                                    var pareacode = linhaphone.areacode.length > 0 ? '(' + linhaphone.areacode + ') ': '';
                                    var pcodephone = linhaphone.codephone.length > 0 ? ' Ramal: ' + linhaphone.codephone: '';
                                    htmlphone += '<br>Tel.: ' + pprefixcode + pareacode + linhaphone.telephone + pcodephone;
                                });
                            }
                            // WEB
                            if(dataweb[2] > 0){
                                $.each(dataweb[1], function(kp,vp){
                                    // idtenant_affiliates_web
                                    var linhaweb = dataweb[1][kp];
                                    htmlweb += '<br>' + linhaweb.uri;
                                });
                            }
                        // companyname, ISDISTANCE, DISTANCE
                        items.push('<li data-id="' + linha.idtenant_affiliates + '"  onclick="mylocal()" >' +
                                    '	<strong>' + linha.companyfantasy + ' - ' + linha.affiliates_name + '</strong>' +
                                    '	<div class="NameU-dados-aff">' + htmladdress + htmlphone + htmlweb + '</div>' +
                                    '</li>');

                    var list = items.join(' ');
                    $(store_affiliate).append(list).listview().listview('refresh');
                    NameU_LoadingPage_Hide();
                }else{
                    NameU_Interacao_Top(obj.msg);
                }
            }else{
                NameU_Interacao_Top(obj.msg);
            }
        })
        .fail(function(xhr, err) { 
            NameU_Fail(xhr, err);
        })
        .always(function() {
            NameU_LoadingPage_Hide();
        }); 
    }
}
// ///////////////////////////////////////////////// PÁGINAS /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_home", function(event) {

	menu_app("#sidebar_menu_1");
	if(loadhome){
		moreproduct();
	}

	// -- by Rafa
	//Method que verifica se há loja selecionada ou não
	handleInsertTarja('vw_home');

});
$( document ).on( "pagehide", "#vw_home", function(event) {
	NameU_MenuCircle_Hide(0);
});

$( document ).on( "pagecreate", "#vw_home", function(event) {
    NameU_MenuCircle_Hide(0);
    NameU_MenuCircle_Hide(1);
	$('#menu_center_0').click(function(){
        NameU_MenuCircle(0);
    });
    
    $('#home_product_more').delegate(".click_sku", "click", function(){
		glbaproduct = {id:$(this).attr("data-id"), sku:$(this).attr("data-sku"), fltype:$(this).attr("data-type")};
        obtproduct();
	});
});

function moreproduct(){
    $('#home_product_more').empty();
	NameU_LoadingPage_Show();
	var furl = url + "/moreproductnp";
	if(glbaaffiliate["id"] > 0){
		furl = url + "/moreproductwp/" + glbaaffiliate["id"];
	}
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: furl,
		cache: false,
        data: {amount:4}
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.listproduct;
				var items = [];
				$.each(obj.listproduct, function(k,v){
					var linha = obj.listproduct[k];
					if(k == 0){
						items.push('<div class="ui-grid-a">');
					}
					var vui = k % 2 == 1 ? "ui-block-b" : "ui-block-a";
					items.push('<div class="' + vui + ' fotos click_sku" data-id="' + linha.ID + '" data-sku="' + linha.IDSKU + '" data-type="' + linha.TYPE + '">' +
								'	<img src="' + linha.IMGPRODUCT + '?' + NameU_Random() + '" width="100%">' +
								'	<div class="box_product_show">' +
								'		<h5>' + linha.DESCRIPTION + '</h5>' +
								'		<p class="store_search_item" >' +
								'			' + priceproduct(linha.final_price, linha.tier_price) +
								'		</p>' +
								'	</div>' +
								'</div>');
					if(k % 2 == 1){
						items.push('</div><div class="ui-grid-a">');
					}
				});
				items.push('</div>');
				var list = items.join(' ');
				$('#home_product_more').append(list);
				loadhome = false;
				moretheme('#home_social_hash');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_check_Images();
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_category", function(event) { });
$( document ).on( "pagecreate", "#vw_category", function(event) {
    $('#category_list').delegate("li a", "click", function(){
		glbacategory = {id:$(this).attr("data-id"), pg:0, ra:100};
		productpcat(true);
	});
});

function category(){
	$('#category_list').empty();
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/category",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.category;
				var items = [];
				$.each(obj.category, function(k,v){
					var linha = obj.category[k];
					items.push('<li><a href="#" data-id="' + linha.idtenant_category + '" class="store_category">' + linha.category_title + '</a></li>');
				});
				var list = items.join(' ');
				$('#category_list').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
				NameU_Tredir_Up("#vw_category");
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_search", function(event) { 
    if (gblfind != ""){
        $("#text_search").val(gblfind);
    }
});
$( document ).on( "pagecreate", "#vw_search", function(event) {
    $('#search_list').empty();
	$('#search_list').delegate("li .store_search_item", "click", function(){
		glbaproduct = {id:$("#search_item_" + $(this).attr("data-id")).attr("data-id"), sku:$("#search_item_" + $(this).attr("data-id")).attr("data-sku"), fltype:$("#search_item_" + $(this).attr("data-id")).attr("data-type")};
		obtproduct();
	});

	$('#search_list').delegate("li p button.class_buy", "click", function(){
		glbaproduct = {id:$("#search_item_" + $(this).attr("data-id")).attr("data-id"), sku:$("#search_item_" + $(this).attr("data-id")).attr("data-sku"), fltype:$("#search_item_" + $(this).attr("data-id")).attr("data-type")};
		NameU_Tredir("#vw_cart");
	}); 
    
	$("#text_search").keydown( function(event) {
		if (event.which === 13) {
			gblfind = $("#text_search").val();
			search_list();
		}
	});
});

function search_list(){
    $('#search_list').empty();
	NameU_LoadingPage_Show();
    var furl = url + "/productfilternp";
	if(glbaaffiliate["id"] > 0){
		furl = url + "/productfilterwp/" + glbaaffiliate["id"];
	}
    $.ajax({
		type: "POST",
		url: furl,
		data: {find:$("#text_search").val(),ra:100,pg:0},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.productfilter["DATA"], function(k,v){
                    var linha = obj.productfilter["DATA"][k];
                    var active_buy = '';
                    if(glbaaffiliate["id"] > 0){     
                        active_buy = '<p   data-id="' + linha.ID + '" class="store_search_item">' + priceproduct(linha.final_price, linha.tier_price) + '</p>' +
                                     '<p><button data-id="' + linha.ID + '" class="class_buy">COMPRE AGORA</button></p>';
                    }
                    items.push('<li id="search_item_' + linha.ID + '" class="" data-id="' + linha.ID + '" data-sku="' + linha.IDSKU + '" data-type="' + linha.TYPE + '">' +
                                    '<img  data-id="' + linha.ID + '" src="' + linha.IMGPRODUCT + '?' + NameU_Random() + '" class="store_search_item">' +
                                    '<h4  data-id="' + linha.ID + '" class="store_search_item">' + linha.DESCRIPTION + '</h4>' +
                                    active_buy +
                                '</li>');
                }); 
				var list = items.join(' ');
				$('#search_list').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
        }
    })
    .fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
        NameU_check_Images();
		NameU_LoadingPage_Hide();
	});
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_affiliate", function(event) { 

});

$( document ).on( "pagecreate", "#vw_affiliate", function(event) {
	$("#affiliate_definir_end").click(function(){
        if ($('#affiliate_logradouro_rua').val().length > 0 && $('#affiliate_logradouro_rua').val() != ""){
			if ($('#affiliate_logradouro_cep').val().length > 0 && $('#affiliate_logradouro_cep').val() != ""){
				glbaadress["logradouro"] = $('#affiliate_logradouro_rua').val() + ', ' + $('#affiliate_logradouro_numero').val() + ' - ' + $('#affiliate_logradouro_cep').val() + ' - ' + $('#affiliate_logradouro_bairro').val();
				glbaadress["rua"] = $('#affiliate_logradouro_rua').val();
				glbaadress["numero"] = $('#affiliate_logradouro_numero').val();
				glbaadress["cep"] = $('#affiliate_logradouro_cep').val();
				glbaadress["bairro"] = $('#affiliate_logradouro_bairro').val();
				glbaadress["latitude"]   = glbageo["latitude"];
				glbaadress["longitude"]  = glbageo["longitude"];
				mylatlong();
			}else{
				NameU_Interacao_Top("Por favor informe o seu CEP válido para entrega ou onde deseja encontrar nossas lojas!");
			}
        }else{
            NameU_Interacao_Top("Por favor informe o seu endereço para entrega ou onde deseja encontrar nossas lojas!");
        }
	});
    $('#affiliate_list').delegate("li.click_affiliates", "click", function(){


		glbaaffiliate["cep"] = $(this).attr("data-cep");
		glbaaffiliate["email"] = $(this).attr("data-email");
		if(glbaaffiliate["id"] == $(this).attr("data-id")){
			glbaaffiliate["id"] = 0;
		}else{
            NameU_Interacao_Top("Você entrou na loja:<br>" + $(this).attr("data-name") + "<br><small>Estamos buscando sua sacola!</small>");
			glbaaffiliate["id"] = $(this).attr("data-id");
            //NameU_Back();

            NameU_Tredir('#vw_home');
		}

		//Obj da loja Salva
		//-- by Rafa
		var objLoja = {};
			objLoja.nome = $(this).attr("data-name");
			objLoja.allData = glbaaffiliate;
			objLoja.latitude = glbaadress["latitude"];
			objLoja.longitude = glbaadress["longitude"];

			localStorage.setItem('lojaselecionada', JSON.stringify(objLoja));


		setaffiliates();
	});
});

function setaffiliates(){
	$(".click_affiliates").removeClass("NameU-set-affiliates");
	$("#li_affiliates_" + glbaaffiliate["id"]).addClass("NameU-set-affiliates");
	if(glbaaffiliate["id"] > 0){
		$(".NameU-img-sacola").attr("src", "img/sacola-on.png");
	}else{
		$(".NameU-img-sacola").attr("src", "img/sacola-off.png");
		glbaaffiliate["id"] = "";
	}
	loadhome = true;
}

function mylocal(){
	$('#affiliate_logradouro_rua').val("");
	$('#affiliate_logradouro_numero').val();
	$('#affiliate_logradouro_cep').val();
	$('#affiliate_logradouro_bairro').val();
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/mylocal",
		data: {latitude:glbageo["latitude"], longitude:glbageo["longitude"]},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.mylocal;
				var explode = linha.split(" - ");
				var explog = explode[0].split(", ");
				$('#affiliate_logradouro_rua').val(explog[0]);
				$('#affiliate_logradouro_numero').val(explog[1]);
				var expcep = explode[2].split(",");
				$('#affiliate_logradouro_cep').val(expcep[1]);
				var expbairro = explode[1].split(",");
				$('#affiliate_logradouro_bairro').val(expbairro[0])
			}
		}
	})
	.fail(function(xhr, err) { })
	.always(function() {
		NameU_LoadingPage_Hide();
		NameU_Tredir("#vw_affiliate");
	}); 
}

function mylatlong(){
	$("#affiliate_definir_end").prop("disabled", true);
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/mylatlong/" + glbaadress["logradouro"],
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.mylatlong;
				glbaadress["latitude"] = linha.lat;
				glbaadress["longitude"] = linha.long;
				if(gblaheaders.Authorization.length > 0){
					savepeopleaddress('ADDRESS',0,glbaadress.cep,glbaadress.rua,glbaadress.numero,'',glbaadress.bairro,'','','',0,glbaadress.latitude,glbaadress.longitude);
				}
				storeavailable();
			}
		}
	})
	.fail(function(xhr, err) { })
	.always(function() {
		setTimeout(function() { 
			$("#affiliate_definir_end").prop("disabled", false);
		}, 2000); 
		NameU_LoadingPage_Hide();
		NameU_Tredir_Up("#vw_affiliate");
	}); 
}

function savepeopleaddress(pidtenant_people_address,pzip_code,paddress,pref_number,pcomplement,pdistrict,pcity,pstates,pcountry,paddress_type,platitude,plongitude){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/savepeopleaddress",
		data: {idtenant_people_address:pidtenant_people_address,zip_code:pzip_code,address:paddress,ref_number:pref_number,complement:pcomplement,district:pdistrict,city:pcity,states:pstates,country:pcountry,address_type:paddress_type,latitude:platitude,longitude:plongitude},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.savepeopleaddress;
				glbaadress["id"] = obj.retorno;
			}
		}
	})
	.fail(function(xhr, err) { })
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function savepeoplephone(pidtenant_people_phone,pprefixcode,pareacode,ptelephone,pcodephone,pphone_type){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/savepeoplephone",
		data: {idtenant_people_phone:pidtenant_people_phone,prefixcode:pprefixcode,areacode:pareacode,telephone:ptelephone,codephone:pcodephone,phone_type:pphone_type},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.savepeoplephone;
			}
		}
	})
	.fail(function(xhr, err) { })
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function storeavailable(){
	$('#affiliate_list').empty();
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/storeavailable",
		data: {latitude:glbaadress["latitude"], longitude:glbaadress["longitude"]},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.storeavailable, function(k,v){
					var linha = obj.storeavailable[k];
					var dataadr = obj.storeavailable[k]["ADDRESS"];
					var dataphn = obj.storeavailable[k]["PHONE"];
					var dataweb = obj.storeavailable[k]["WEB"];
					var htmladdress = "";
					var htmlphone = "";
					var htmlweb = "";
					var affcep = "";
					var affemail = "";
						// ADDRESS
						if(dataadr[2] > 0){
							$.each(dataadr[1], function(ka,va){
								// idtenant_affiliates_address
								var linhaaddress = dataadr[1][ka];
								if(ka == 0){
									affcep = linhaaddress.zip_code;
								}
								var aref_number = linhaaddress.ref_number.length > 0 ? ', ' + linhaaddress.ref_number: '';
								var acomplement = linhaaddress.complement.length > 0 ? ' - ' + linhaaddress.complement: '';
								var acity = linhaaddress.city.length > 0 ? linhaaddress.city : '';
								var adistrict = linhaaddress.district.length > 0 ? '<br>' + linhaaddress.district + (linhaaddress.city.length > 0 ? ' - ' + linhaaddress.city: ''): '<br>' + acity;
								var acountry = linhaaddress.country.length > 0 ? linhaaddress.country: '';
								var astates = linhaaddress.states.length > 0 ? linhaaddress.states + (linhaaddress.country.length > 0 ? ' - ' + linhaaddress.country: ''): acountry;
								var azip_code = linhaaddress.zip_code.length > 0 ? '<br>' + linhaaddress.zip_code + (astates.length > 0 ? ' - ' + astates: ''): (astates.length > 0 ? '<br>' + astates: '');
								htmladdress += '<br>' + linhaaddress.address + aref_number + acomplement + adistrict + azip_code;
							});
						}
						// PHONE
						if(dataphn[2] > 0){
							$.each(dataphn[1], function(kp,vp){
								// idtenant_affiliates_phone
								var linhaphone = dataphn[1][kp];
								var pprefixcode = linhaphone.prefixcode.length > 0 ? '(' + linhaphone.prefixcode + ') ': '';
								var pareacode = linhaphone.areacode.length > 0 ? '(' + linhaphone.areacode + ') ': '';
								var pcodephone = linhaphone.codephone.length > 0 ? ' Ramal: ' + linhaphone.codephone: '';
								htmlphone += '<br>Tel.: ' + pprefixcode + pareacode + linhaphone.telephone + pcodephone;
							});
						}
						// WEB
						if(dataweb[2] > 0){
							$.each(dataweb[1], function(kp,vp){
								// idtenant_affiliates_web
								var linhaweb = dataweb[1][kp];
								if(kp == 0){
									affemail = linhaweb.uri;
								}
								htmlweb += '<br>' + linhaweb.uri;
							});
						}
					// companyname, ISDISTANCE, DISTANCE
					items.push('<li class="click_affiliates" id="li_affiliates_' + linha.idtenant_affiliates + '" data-id="' + linha.idtenant_affiliates + '" data-name="' + linha.companyfantasy + ' - ' + linha.affiliates_name + '" data-cep="' + affcep + '" data-email="' + affemail + '">' +
								'	<strong>' + linha.companyfantasy + ' - ' + linha.affiliates_name + '</strong><br>' +
								'	<div class="NameU-dados-aff">' + htmladdress + htmlphone + htmlweb + '</div>' +
								'</li>');
				});
				items.push('</div>');
				var list = items.join(' ');
				$('#affiliate_list').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
		setaffiliates();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_storeu", function(event) {
	menu_app("#sidebar_menu_5");
    if (glbacategory.id == 0){
        productpcat(false);
    }else{
        productpcat(true);
    }

    // -- by Rafa
	//Method que verifica se há loja selecionada ou não
	handleInsertTarja('vw_storeu');


});
$( document ).on( "pagehide", "#vw_storeu", function(event) {
	NameU_MenuCircle_Hide(1);
});
$( document ).on( "pagecreate", "#vw_storeu", function(event) {
    $('#menu_center_1').click(function(){
        NameU_MenuCircle(1);
    });
    $('#storeu_product_more').delegate(".click_sku", "click", function(){
		glbaproduct = {id:$(this).attr("data-id"), sku:$(this).attr("data-sku"), fltype:$(this).attr("data-type")};
        obtproduct();
	});
});

function productpcat(iscategory){
	$('#storeu_product_more').empty();
	NameU_LoadingPage_Show();
	var furl = url + "/productpcatnp";
    var datavar = {amount:100};
    var vmethod = "POST";
    if (iscategory){
        furl = url + "/productpcatnp";
        if(glbaaffiliate["id"] > 0){
            furl = url + "/productpcatwp/" + glbaaffiliate["id"];
        }
        datavar = {idtenant_category:glbacategory["id"], ra:glbacategory["ra"], pg:glbacategory["pg"]};
    }else{
        furl = url + "/moreproductnp";
        if(glbaaffiliate["id"] > 0){
            furl = url + "/moreproductwp/" + glbaaffiliate["id"];
        }
    }
	$.ajax({ 
		headers: gblaheaders,
		type: vmethod,
		url: furl,
		data: datavar,
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
                var dados;
                if (iscategory){
                    dados = obj.listproduct["DATA"];
                }else{
                    dados = obj.listproduct;
                }
				$.each(dados, function(k,v){
					var linha = dados[k];
					if(k == 0){
						items.push('<div class="ui-grid-a">');
					}
					var vui = k % 2 == 1 ? "ui-block-b" : "ui-block-a";
					items.push('<div class="' + vui + ' fotos click_sku" data-id="' + linha.ID + '" data-sku="' + linha.IDSKU + '" data-type="' + linha.TYPE + '">' +
								'	<img src="' + linha.IMGPRODUCT + '?' + NameU_Random() + '" width="100%">' +
								'	<div class="box_product_show">' +
								'		<h5>' + linha.DESCRIPTION + '</h5>' +
								'		<p class="store_search_item">' +
								'			' + priceproduct(linha.final_price, linha.tier_price) +
								'		</p>' +
								'	</div>' +
								'</div>');
					if(k % 2 == 1){
						items.push('</div><div class="ui-grid-a">');
					}
				});
				items.push('</div>');
				var list = items.join(' ');
				$('#storeu_product_more').append(list);
				NameU_Tredir_Up("#vw_storeu");
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
        NameU_check_Images();
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** ///////////////////////////////////////////////// 
$( document ).on( "pageshow", "#vw_product_sku", function(event) {
	$("#sku_amount").val(1);
    $("#product_img").owlCarousel({
      singleItem:true
    });
    
    $(".next").on("click", function(){
        var owl = $("#product_img").data('owlCarousel');
        owl.next();
    });
    
    if(glbaaffiliate["id"] > 0){
        $("#sku_label_01").val(glbaproduct["sku"]);
        $("#sku_label_01").selectmenu('refresh',true);
    }
});

$( document ).on( "pagecreate", "#vw_product_sku", function(event) {
    var src = $('#product_img').attr('src');
    
    $("#btn_wishlist").click(function(){
        addwishlist();
    });
    
    $("#btn_share_product_sku").click(function(){
        window.plugins.socialsharing.share(null, null, src);
    });
    if(glbaaffiliate["id"] > 0){
        $("#sku_label_01").change(function(){
            glbaproduct.sku = $('option:selected', this).val();
            $('#product_name_price').empty().append('<span>' + $('option:selected', this).attr("data-product_name") + '</span><br>' + priceproduct($('option:selected',this).attr("data-price"), $('option:selected',this).attr("data-tier")));
        });
    }
});

function addcart(){
    if ($("#sku_amount").val() != ""){
        if (glbaaffiliate["id"] > 0){
            NameU_LoadingPage_Show();
            $.ajax({ 
                headers: gblaheaders,
                type: "POST",
                url: url + "/saveprdcart/" + glbaaffiliate["id"],
                data: {idtenant_product: glbaproduct["id"],idtenant_product_sku:glbaproduct["sku"],item_amount:$("#sku_amount").val(), fltype:glbaproduct["fltype"]},
                cache: false
            })
            .done(function(data) {
                var obj = data;
                if (obj.error == 0){
                    if (obj.retorno > 0){
						gblapay["idorder"] = 0;
                        NameU_LoadingPage_Hide();
                        NameU_Tredir("#vw_cart");
                    }else{
                        NameU_Interacao_Top(obj.msg);
                    }
                }else{
                    NameU_Interacao_Top(obj.msg);
                }
            })
            .fail(function(xhr, err) { 
                NameU_Fail(xhr, err);
            })
            .always(function() {
                NameU_LoadingPage_Hide();
            });
        }else{
            NameU_Interacao_Top("Selecione uma loja!");
        }
    }else{
       NameU_Interacao_Top("Informe uma quantidade para adicionar ao carrinho!"); 
    }
}

function addwishlist(){
    NameU_LoadingPage_Show();
    $.ajax({ 
        headers: gblaheaders,
        type: "POST",
        url: url + "/savewishlist",
        data: {idtenant_product: glbaproduct["id"],idtenant_product_sku:glbaproduct["sku"], fltype:glbaproduct["fltype"]},
        cache: false
    })
    .done(function(data) {
        var obj = data;
        if (obj.error == 0){
            if (obj.retorno > 0){
                NameU_LoadingPage_Hide();
                NameU_Interacao_Top(obj.msg);
            }else{
                NameU_Interacao_Top(obj.msg);
            }
        }else{
            NameU_Interacao_Top(obj.msg);
        }
    })
    .fail(function(xhr, err) { 
        NameU_Fail(xhr, err);
    })
    .always(function() {
        NameU_LoadingPage_Hide();
    });
}

function obtproduct(){
	$('#product_img').empty();
	$('#product_name_price').empty();
    $('#box_info_product').hide();
    $('#box_notinfo_product').show();
	NameU_LoadingPage_Show();
	var ftype = "GET";
	var logado = gblaheaders["Authorization"].length > 0 ? 'aut' : '';
	var furl = url + "/obtproductnp" + logado + "/" + glbaproduct["id"];
	if(glbaaffiliate["id"] > 0){
        $('#box_info_product').show();
        $('#box_notinfo_product').hide();
		ftype = "POST";
		furl = url + "/obtproductwp" + logado + "/" + glbaproduct["id"];
	}
	$.ajax({ 
		headers: gblaheaders,
		type: ftype,
		url: furl,
		data: {idtenant_affiliates:glbaaffiliate["id"], type:glbaproduct["fltype"]},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){ // IMGPRODUCT
			if (obj.retorno > 0){
				var linha = obj.obtproduct;
                var text_sku = linha.TEXT.length > 0 ? '<br>' + linha.TEXT : '';
				$('#product_img').empty().append('<div class="item next"><img src="' + linha.IMGPRODUCT + '?' + NameU_Random() + '" width="100%"></div>');
				$('#product_name_price').empty().append('<span>' + linha.DESCRIPTION + '</span>' + text_sku + '<br>' + priceproduct(linha.final_price, linha.tier_price));
				
                if(glbaaffiliate["id"] > 0){
                    if (linha.final_price > 0){
                        $("#btn_buy_cart").show();
                    }
                    $("#sku_label_01").empty();
                    
                    
                    if (glbaproduct["fltype"] == 1){
                        $("#sku_label_01").append('<option value="0" data-price="' + linha.final_price + '" data-tier="' + linha.tier_price + '"  data-product_name="' + linha.product_name + '">U</option>');
						glbaproduct["sku"] = 0;
					}else{
                        var count = obj.obtproduct.SKUS[1].length;
                        var objsku = obj.obtproduct.SKUS[1];
                        if (count == 0){
                            $('#box_info_product').hide();
                            $('#box_notinfo_product').show();
                        }else{
                            $.each(objsku, function(k,v){
                                var modatamanho = objsku[k].GRID[1][0];
                                $("#sku_label_01").append('<option value="' + objsku[k].idtenant_product_sku + '" data-price="' + objsku[k].final_price + '" data-tier="' + objsku[k].tier_price + '"  data-product_name="' + objsku[k].product_name + '">' +  modatamanho.p_typeitemoptions_option_value + '</option>');
                            });
                        }
                    }
					$("#sku_label_01").val(glbaproduct["sku"]);
                }
                
                NameU_Tredir_Up("#vw_product_sku");
                NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_check_Images();
		NameU_LoadingPage_Hide();
	}); 
}



// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_cart", function(event) { 
    $("#footer_cart_control").hide();
    $("#control_cart_open").hide();
    $("#control_cart_close").hide();
    $("#products_cart_control_show").hide();
    $("#list_cart_control").hide();
    if(glbaaffiliate["id"] > 0){
		$("#control_cart_open").show();
		get_cart_store();
		get_affiliate_gbl("#mystore_profile_cart");
		get_mylocal_gbl("#mylocal_profile_cart", true);
		shippingpaff();
	}else{
		NameU_Interacao_Top("Entre em uma loja para encher sua sacola!");
		$("#control_cart_close").show();
	}
});
$( document ).on( "pagecreate", "#vw_cart", function(event) {
    $("#btn_open_click").click(function(){
        if(!$("#list_cart_control").is(":visible")){
            $("#list_cart_control").show();
        }else{
            $("#list_cart_control").hide();
        }
    });
    $("#close_btn_check_out").click(function(){
		var retorno_confirm = glbaadress.rua.length == 0 ? "rua, " : '';
		retorno_confirm += glbaadress.numero.length == 0 ? "número, " : '';
		retorno_confirm += glbaadress.cep.length == 0 ? "cep, " : '';
		retorno_confirm += glbaadress.bairro.length == 0 ? "bairro, " : '';
		if(retorno_confirm.length > 0){
			retorno_confirm = retorno_confirm.substring(0,(retorno_confirm.length - 2));
			NameU_Interacao_Top_Time("Favor preencher o(s) seguinte(s) dado(s) da sua localização:<br>" + retorno_confirm, 3000);
		}else{
			loginsetpagedb("#vw_cart_order");
		}
    });
    $('#list_cart_control').delegate(".remove_control_item_cart", "click", function(){
        del_cart_item($(this).attr("data-id"));
    });
    $("#footer_cart_control").hide();
    $("#control_cart_open").hide();
    $("#control_cart_close").hide();
    $("#products_cart_control_show").hide();
	$('#fieldset_shipping').on('change','input[name=shipping_type]:radio',  function () {
		glbashipping["id"] = $("input[name='shipping_type']:checked").val();
		CalcPrecoData();
	});
});

function shippingpaff(){
    $('#fieldset_shipping').empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/shippingpaff/" + glbaaffiliate["id"],
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.shippingpaff, function(k,v){
                    var linha = obj.shippingpaff[k];
					if(k == 0){
						glbashipping["id"] = linha.idtenantshippingtype;
					}
					var ischecked = k == 0 ? ' checked="checked"' : '';
                    items.push('<input type="radio" name="shipping_type" id="shipping_' + linha.idtenantshippingtype + '" value="' + linha.idtenantshippingtype + '"' + ischecked + '>' +
								'<label for="shipping_' + linha.idtenantshippingtype + '" class="control_select_shipping">' + linha.description + '</label>');
								
                });
				var list = items.join(' ');
				$('#fieldset_shipping').append('<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">' + list + '</fieldset>').trigger('create');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		CalcPrecoData();
		NameU_LoadingPage_Hide();
	}); 
}

function del_cart_item(id){
    NameU_LoadingPage_Show();
	var furl = url + "/delprdcart/" + id;
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: furl,
		data: {idtenant_affiliates:glbaaffiliate["id"]},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
                NameU_Interacao_Top(obj.msg);
				get_cart_store();
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function get_cart_store(){
	gblacart_prod = {itemId1: 0, itemDescription1: '', itemAmount1: 0, itemQuantity1:0}
	glbaaffiliate["all"] = 0;
	glbaaffiliate["allcart"] = 0;
	$("#qtde_items_cart").empty().append('VOCÊ AINDA NÃO TEM PRODUTOS ADICIONADOS À SACOLA.');
	$("#footer_cart_control").hide();
	$("#products_cart_control_show").hide();
	$("#vlrs_cart").empty();
	$(".vlr_subtotal_cart").empty().append("0,00");
	$(".vlr_tiertotal_cart").empty().append("0,00");
	$(".vlr_shipping_cart").empty().append("0,00");
	$(".vlr_total_cart").empty().append("0,00");
    $('#list_cart_control').empty();
	NameU_LoadingPage_Show();
    var furl = url + "/itemscart/"+ glbaaffiliate["id"];
	$.ajax({
        headers: gblaheaders,
		type: "GET",
		url: furl,
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				var linhacart_prod = [];
                var active_buy = "";
                if (obj.itemscart.DATA.length > 0){
					glbaaffiliate["all"] = obj.itemscart.DATA.length;
                    $("#qtde_items_cart").empty().append('VOCÊ TEM ' + glbaaffiliate["all"] + ' PRODUTO(S) ADICIONADO(S) À SACOLA.');
                    $("#footer_cart_control").show();
                    $("#products_cart_control_show").show();
                    $(".vlr_subtotal_cart").empty().append(NameU_pontue(obj.itemscart.ALLfinal_price, 2, ",", "."));
                    $(".vlr_tiertotal_cart").empty().append(NameU_pontue(obj.itemscart.DISCOUNT, 2, ",", "."));
                    $(".vlr_shipping_cart").empty().append(NameU_pontue(0, 2, ",", "."));
					glbaaffiliate["allcart"] = obj.itemscart.ALLtier_price;
                    $(".vlr_total_cart").empty().append(NameU_pontue(glbaaffiliate["allcart"], 2, ",", "."));
				}
                
				$.each(obj.itemscart.DATA, function(k,v){
                    var linha = obj.itemscart.DATA[k];
                    if(glbaaffiliate["id"] > 0){     
                        active_buy = '<p data-id="' + linha.IDSKU + '" class="store_search_item">' + priceproduct(linha.final_price, linha.tier_price) + '</p>';
                    }
                    var sku_grid_product = "";
                    if(linha.TYPE == 0){
						if (linha.GRID[2] > 0){
                            sku_grid_product =	'<div class="ui-grid-a sku_control_cart">'+
												'    <div class="ui-block-a">'+
												'        ' + linha.GRID[1][0].p_typeitem_frontend_type + 
												'    </div>'+
												'    <div class="ui-block-b">'+
												'        <span class="control_select_sku_cart">'+
												'          ' +  linha.GRID[1][0].p_typeitemoptions_option_value +  
												'       </span>'+
												'    </div>'+
												'</div>';
						}
                    }else{
                        sku_grid_product =  '<div class="ui-grid-a sku_control_cart">' + linha.TEXT + '</div>'; 
                    }
                    var qtd = NameU_pontue(linha.item_amount, 0, ",", ".");
                    items.push('<li data-id="' + linha.ID + '" data-sku="' + linha.IDSKU + '" data-type="' + linha.TYPE + '" >' +
                                '	<img src="' + linha.IMGPRODUCT + '?' + NameU_Random() + '" class="store_search_item">' +
                                '	<h4  class="store_search_item">' + linha.DESCRIPTION + '</h4>' +
                                '	<img src="img/fechar.png"  width="30px" class="remove_control_item_cart" data-id="' + linha.idtenant_device_cart_sku + '">' +
                                '	' + sku_grid_product + 
                                '     <div class="ui-grid-a sku_control_cart">' +
                                '        <div class="ui-block-a">' +
                                '            QUANTIDADE' +
                                '        </div>' +
                                '        <div class="ui-block-b">' +
                                '            <span class="control_select_sku_cart">' +
                                '                ' + qtd + '' +
                                '            </span>' +
                                '        </div>' +
                                '     </div>' +
                                '	' + active_buy + 
                                '</li>');
					var numarray = k+1;
					gblacart_prod['itemId' + numarray] = linha.ID;
					gblacart_prod['itemDescription' + numarray] = linha.DESCRIPTION;
					gblacart_prod['itemAmount' + numarray] = NameU_pontue(linha.ALL_price, 2, ".", "");
					gblacart_prod['itemQuantity' + numarray] = qtd;
                }); 
				var list = items.join(' ');
				$('#list_cart_control').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}else{
                $("#qtde_items_cart").empty().append('VOCÊ AINDA NÃO TEM PRODUTOS ADICICIONADOS À SACOLA.');
			}
        }else{
            $("#qtde_items_cart").empty().append('VOCÊ AINDA NÃO TEM PRODUTOS ADICICIONADOS À SACOLA.');
        }
    })
    .fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
        NameU_check_Images();
		NameU_LoadingPage_Hide();
	});
}

function multall(cod){
	return glbaaffiliate["all"]*cod;
}

function CalcPrecoData(){
	$(".vlr_shipping_cart").empty().append("0,00");
	$(".vlr_total_cart").empty().append(NameU_pontue(glbaaffiliate["allcart"], 2, ",", "."));
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/shipping/correios/CalcPreco/" + glbashipping["id"],
		data: {sCepOrigem: glbaaffiliate["cep"]
				, sCepDestino: glbaadress["cep"]
				, nCdServico: 41106
				, nVlPeso: multall(0.100)
				, nCdFormato: multall(1)
				, nVlComprimento: multall(40)
				, nVlAltura: multall(5)
				, nVlLargura: multall(23)
				, nVlDiametro: multall(10)
				, sCdMaoPropria: 'N'
				, nVlValorDeclarado: 0
				, sCdAvisoRecebimento: 1},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var vlrlinha = obj["shipping/correios/CalcPreco"]["Servicos"]["cServico"]["Valor"];
				glbashipping["price"] = parseFloat(vlrlinha);
				$(".vlr_shipping_cart").empty().append(NameU_pontue(parseFloat(vlrlinha), 2, ",", "."));
				var sum = parseFloat(glbaaffiliate["allcart"]) + parseFloat(vlrlinha);
				$(".vlr_total_cart").empty().append(NameU_pontue(parseFloat(sum), 2, ",", "."));
				NameU_LoadingPage_Hide();
			}
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}



// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_cart_order", function(event) {
    $('#div_paymenttype').empty();
	hasSessionId = false;
	obtprofilecart();
	if(glbaaffiliate["id"] > 0){
		selecttypePayaff();
	}
	get_mylocal_gbl("#mylocal_profile_cart_order", false);
});
$( document ).on( "pagehide", "#vw_cart_order", function(event) {
    $('#div_paymenttype').empty();
	$('#profile_order_complement, #profile_order_city, #profile_order_states').val("");
});
$( document ).on( "pagecreate", "#vw_cart_order", function(event) {
   $('#div_select_paymenttype').on('change','input[name=selectpayment_type]',  function () {
       paymentpaff($(this).attr("data-option_value"), $(this).attr("data-id"), $(this).attr("data-description"));
       $('html, body').animate({ scrollTop: $("#div_select_paymenttype").offset().top }, 2000);
   });
    
	$('#profile_order_complement, #profile_order_city, #profile_order_states').val("");
    $("#close_btn_order_pay").click(function(){
        NameU_Tredir("#vw_cart_pay");
    });
	
	$('#div_paymenttype').on('change','div div fieldset input[name=cart_I]:radio',  function () {
		if ($("input[name='cart_I']:checked").val() == 'true'){
			$("#card_dados_inf").addClass('NameU-Hide');
		}else{
			$("#card_dados_inf").removeClass('NameU-Hide');
		}
	});
	$('#div_paymenttype').on('change','div div input[name=cardNumber]',  function () {
		var cardBin = $("#cardNumber").val().substring(0, 6);
		if (String(cardBin).length >= 6) {
			updateCardBrand(cardBin);
		}else{
			$("#installmentsWrapper").hide();
		}
	});
    
    // Atualizando o valor do parcelamento
   
    $('#div_paymenttype').on('change','div div div div div select[name=installmentQuantity]',  function () {
        var option = $(this).find("option:selected");
        if (option.length) {
            gblacard.cdParc = option.val();
            $("#installmentValue").val(option.attr("dataPrice"));
            gblacard.cdValue = option.attr("dataPrice");
        }
    });
    
});


function efetuar_pagamento(){
    
}

function obtprofilecart(){
    NameU_LoadingPage_Show();
	gblauser = {CPF:"",birthdate:""};
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/obtprofile",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.obtprofile;
				$('#profile_order_firstname').val(linha.firstname);
				$('#profile_order_lastname').val(linha.lastname);
				$('#profile_order_birthdate').val(linha.birthdate);
				$('#order_profile_sexo_' + linha.sexo).attr('checked', true).checkboxradio().checkboxradio('refresh');
				$('#div_fielset_order_profile_sexo').trigger('create');
				$('#order_profile_document').val(linha.document);
				gblauser = {CPF:linha.document,birthdate:linha.birthdate};
				NameU_LoadingPage_Hide();
			}
            NameU_LoadingPage_Hide();
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		getpeoplephonecart();
		NameU_LoadingPage_Hide();
	}); 
}

function getpeoplephonecart(){
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/getpeoplephone",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.getpeoplephone[0];
				$('#creditCardHolderAreaCode').val(linha.areacode);
				$('#creditCardHolderPhone').val(linha.telephone);
			}
        }
	})
	.fail(function(xhr, err) { })
	.always(function() { }); 
}

function paymentpaff(typepayment, idtenantpaymenttype, description){
    $('#div_paymenttype').empty();
    var datebirthday = gblauser["birthdate"].split('-');
    
    NameU_LoadingPage_Show();
    var creditCard_vw = '<div>' +
                        '	<img class="NameU-IMG-Center" src="img/pagseguro.png">' +
                        '</div>' +     
                        '<div class="ui-grid-a">' +
                        '	<input type="text" id="cardemail" class="input_control_box" placeholder="E-MAIL PAGSEGURO"/>' +
                        '</div>' +
                        '<div class="ui-grid-a">' +
                        '	<input type="text" name="cardName" id="cardName" class="input_control_box" placeholder="NOME NO CARTÃO"/>' +
                        '</div>' +
                        '<div class="ui-grid-solo">' +
                        '	<div class="ui-block-a"><input type="text" class="input_control_box" placeholder="CPF" id="cardCPF" value="' + gblauser["CPF"] + '"></div>' +
                        '</div>' +
                        '<div class="NameU-label">Data de Nascimento (dd/mm/yyyy)</div>' +
                        '<div class="ui-grid-b NemeU-txtalign-ctr">' + 
                        '   <div class="ui-block-a">' +
                        '		<input type="number" id="tday" name="tday" class="input_control_box" size="2"  value="' + datebirthday[2] + '" />' +
                        '   </div>' +
                        '   <div class="ui-block-b">' +
                        '		<input type="number" id="tmonth" name="tmonth" class="input_control_box" size="2"  value="' + datebirthday[1]  + '"/>' +
                        '   </div>' +
                        '   <div class="ui-block-c">' +
                        '		<input type="number" id="tyear" name="tyear" class="input_control_box" size="4"  value="' + datebirthday[0] + '"/>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="NameU-label">NÚMERO DO CARTÃO</div>' +
                        '<div class="ui-grid-a">' +
                        '	<input type="number" id="cardNumber" name="cardNumber" class="input_control_box" placeholder="NÚMERO DO CARTÃO" size="16"/>' +
                        '   <div id="cardBrand">' +
                        '   </div>' +
                        '</div>' +
                        '<div class="ui-grid-b NemeU-txtalign-ctr">' + 
                        '   <div class="ui-block-a">' +
                        '	    <div class="NameU-dselect-pay">' +
                        '	    <select id="cardExpirationMonth">' +
                        '	    	<option value="01">01</option>' +
                        '	    	<option value="02">02</option>' +
                        '	    	<option value="03">03</option>' +
                        '	    	<option value="04">04</option>' +
                        '	    	<option value="05">05</option>' +
                        '	    	<option value="06">06</option>' +
                        '	    	<option value="07">07</option>' +
                        '	    	<option value="08">08</option>' +
                        '	    	<option value="09">09</option>' +
                        '			<option value="10">10</option>' +
                        '		    <option value="11">11</option>' +
                        '		    <option value="12">12</option>' +
                        '	    </select>' +
                        '	    </div>' +
                        '   </div>' +
                        '   <div class="ui-block-b">' +
                        '	    <div class="NameU-dselect-pay">' +
                        '	    <select id="cardExpirationYear">' +
                        '	    	<option value="2016">2016</option>' +
                        '	    	<option value="2017">2017</option>' +
                        '	    	<option value="2018">2018</option>' +
                        '	    	<option value="2019">2019</option>' +
                        '	    	<option value="2020">2020</option>' +
                        '	    	<option value="2021">2021</option>' +
                        '	    	<option value="2022">2022</option>' +
                        '	    	<option value="2023">2023</option>' +
                        '	    	<option value="2024">2024</option>' +
                        '	    	<option value="2025">2025</option>' +
                        '	    	<option value="2026">2026</option>' +
                        '	    	<option value="2027">2027</option>' +
                        '	    	<option value="2028">2028</option>' +
                        '	    	<option value="2029">2029</option>' +
                        '	    	<option value="2030">2030</option>' +
                        '	    </select>' +
                        '	    </div>' +
                        '   </div>' +
                        '   <div class="ui-block-c">' +
                        '	    <input type="text" name="cardCvv" id="cardCvv" maxlength="5" class="input_control_box"  placeholder="CVV"/>' +
                        '   </div>' +
                        '</div>' +
                        '<div id="installmentsWrapper">' +
                        '<div class="ui-grid-a">' +
                        '	<div class="ui-grid-solo">' +
                        '		<div class="ui-block-a">' +
                        '			<div class="NameU-label">PARCELAMENTO</div>' +
                        '		</div>' +
                        '	</div>' +
                        '</div>' +
                        '<div class="ui-grid-a">' +
                        '	<div class="ui-grid-solo">' +
                        '		<div class="ui-block-a">' +
                        '			<div class="NameU-dselect-parcela">' +
                        '				<select name="installmentQuantity" id="installmentQuantity">' +
                        '				</select>' +
                        '				<input type="hidden" name="installmentValue" id="installmentValue"/>' +
                        '			</div>' +
                        '		</div>' +
                        '	</div>' +
                        '</div>' +
                        '</div>' +
                        '<br>' +
                        '<div class="NameU-label">DADOS DE PAGAMENTO</div>' +
                        '<div class="control_cart_select" id="div_fielset_cart_I">' +
                        '	<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" class="NameU-center" id="fielset_cart_I">' +
                        '		<input type="radio" name="cart_I" id="cart_I_1" value="true" checked>' +
                        '		<label for="cart_I_1" class="control_select_shipping">MEUS DADOS</label>' +
                        '		<input type="radio" name="cart_I" id="cart_I_0" value="false">' +
                        '		<label for="cart_I_0" class="control_select_shipping">INFORMAR</label>' +
                        '	</fieldset>' +
                        '</div>' +
                        '<div id="card_dados_inf" class="NameU-Hide">' +
                        '	<div class="NameU-label-top">TELEFONE</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<div class="ui-block-a">' +
                        '			<input type="number" id="cardAreaCode" holderField="areaCode" class="areaCode input_control_box" maxlength="2" placeholder="DDD" />' +
                        '		</div>' +
                        '		<div class="ui-block-b ui-block-c">' +
                        '			<input type="number" id="cardPhone" holderField="phone" class="phone input_control_box" maxlength="9" placeholder="TELEFONE"/>' +
                        '		</div>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardPostalCode" class="input_control_box" placeholder="CEP"/>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardStreet" class="input_control_box" placeholder="RUA"/>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardStreetNumber" class="input_control_box" placeholder="NÚMERO"/>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardComplement" class="input_control_box" placeholder="COMPLEMETO"/>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardDistrict" class="input_control_box" placeholder="BAIRRO"/>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardCity" class="input_control_box" placeholder="CIDADE"/>' +
                        '	</div>' +
                        '	<div class="ui-grid-a">' +
                        '		<input type="text" id="cardState" class="input_control_box" placeholder="ESTADO"/>' +
                        '	</div>' +
                        '</div>' +
                        '<input type="hidden" name="creditCardToken" id="creditCardToken"  />' +
                        '<input type="hidden" name="creditCardBrand" id="creditCardBrand"  />';
    
    var btn_fim_cd =   '<button type="button" class="ui-btn btn_def_order_checkout"  onclick="dopay(\'CD\', ' + idtenantpaymenttype + ')">FINALIZAR PEDIDO</button>';
                        

    var eftData_view =  '<div>' +
                        '	<img class="NameU-IMG-Center" src="img/pagseguro.png">' +
                        '</div>' +
                        '<div id="eftData" class="paymentMethodGroup" dataMethod="eft">' +
                        '	<ul>' +
                        '		<li dataBank="bancodobrasil" class="bank-flag bancodobrasil">Banco do Brasil</li>' +
                        '		<li dataBank="bradesco" class="bank-flag bradesco">Bradesco</li>' +
                        '		<li dataBank="itau" class="bank-flag itau">Itau</li>' +
                        '		<li dataBank="banrisul" class="bank-flag banrisul">Banrisul</li>' +
                        '		<li dataBank="hsbc" class="bank-flag hsbc">HSBC</li>' +
                        '	</ul>' +
                        '</div>';
    
    //var btn_fim_eft =   '<button type="button" class="NameU-finish-order-pay"  onclick="dopay(\'eft\', ' + idtenantpaymenttype + ')">FINALIZAR PEDIDO</button>';
    var btn_fim_eft =   '<button type="button" class="ui-btn btn_def_order_checkout"  onclick="dopay(\'eft\', ' + idtenantpaymenttype + ')">FINALIZAR PEDIDO</button>';

    var boleto_view = '	<img class="NameU-IMG-Center" src="img/pagseguro.png">' +
                        '<img class="NameU-IMG-Center" src="images/boleto.png">' +
                        '<div class="ui-grid-a">' +
                        '	<input type="text" id="boletoemail" class="input_control_box" placeholder="E-MAIL PAGSEGURO"/>' +
                        '</div>';
    
    var btn_fim_bl =    '<button type="button" class="ui-btn btn_def_order_checkout"  onclick="dopay(\'BL\', ' + idtenantpaymenttype + ')">FINALIZAR PEDIDO</button>';

    
    var htmlform = "";
    if(typepayment == "CD"){
        htmlform = creditCard_vw;
        $('#btn_checkout_order_pay').empty().append(btn_fim_cd).trigger('create');
        initpay(idtenantpaymenttype);
    }else if(typepayment == "DC"){
        htmlform = eftData_view;
        $('#btn_checkout_order_pay').empty().append(btn_fim_eft).trigger('create');
        initpay(idtenantpaymenttype);
    }else if(typepayment == "BL"){
        htmlform = boleto_view;
        $('#btn_checkout_order_pay').empty().append(btn_fim_bl).trigger('create');
        initpay(idtenantpaymenttype);
    }else if(typepayment == "PK"){
        var btn_fim_pk = '<button type="button" class="ui-btn btn_def_order_checkout"  onclick="dopay(\'LOJA\', ' + idtenantpaymenttype + ')">FINALIZAR PEDIDO</button>';
        $('#btn_checkout_order_pay').empty().append(btn_fim_pk).trigger('create');
        htmlform = '';
    }
    var items = [];
    items.push('<div class="control_pay_type">' +
               '	' + htmlform + 
               '</div><br><br>');
    var list = items.join(' ');
    $('#div_paymenttype').append(list).trigger('create');
    $("#installmentsWrapper").hide();
    NameU_LoadingPage_Hide();
			
}

function selecttypePayaff(){
    $('#div_select_paymenttype').empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/paymentpaff/" + glbaaffiliate["id"],
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.paymentpaff, function(k,v){
                    var linha = obj.paymentpaff[k];
                    items.push( '<input type="radio" name="selectpayment_type" id="select_pay_' + linha.idtenantpaymenttype + '" value="' + linha.option_value + '" data-id="' + linha.idtenantpaymenttype + '"  data-description="' + linha.description + '" data-option_value="' + linha.option_value + '">'+
                                '<label for="select_pay_' + linha.idtenantpaymenttype + '">' + linha.description.toUpperCase() + '</label>');
                });
                var list = items.join(' ');
                var SelectPay = '<fieldset data-role="controlgroup">' +
                                '<legend>Escolha uma opção de pagamento:</legend>' +
                                list + 
                                '</fieldset>';
				$('#div_select_paymenttype').append(SelectPay).trigger('create');
            }else{
                NameU_Interacao_Top(obj.msg);
            }
        }else{
            NameU_Interacao_Top(obj.msg);
        }
        NameU_LoadingPage_Hide();
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function initpay(idtenantpaymenttype){
    NameU_LoadingPage_Show();
    var sendidurl = "";
    $.ajax({
        url: url + "/payment/pagseguro/initsession/" + idtenantpaymenttype + "/" + gblenviroment + "?" +  NameU_Random(),
        type:"GET",
        cache: false,
        headers: gblaheaders,
        success: function(response) {
            hasSessionId = true;
            PagSeguroDirectPayment.setSessionId(response["payment/pagseguro/initsession"]);
			NameU_LoadingPage_Hide();
        },
        error: function() {
             hasSessionId = false;
            var ex = " Não foi possível obter o Session ID do PagSeguro ";
            NameU_Interacao_Top(ex);
            NameU_LoadingPage_Hide();
        },
        complete: function() {
            
        }
    });
}

function dopay(varmethodpay,idpay){
	if(gblapay["id"] == idpay){
		gblapay["id"] = idpay;
		gblapay["method"] = varmethodpay;
	}else{
		gblapay = {id:idpay, method:varmethodpay, idorder:0};
	}
	
	updprofile('PAY',$('#profile_order_firstname').val(),$('#profile_order_lastname').val(),$('#profile_order_firstname').val(),$('#profile_order_birthdate').val(),$("input[name='order_profile_sexo']:checked").val(),$('#order_profile_document').val());
}

function execdopay(){
	NameU_LoadingPage_Show();
	var purl = "";
	var pdata = {idtenant_affiliates:glbaaffiliate['id']
				, order_code:''
				, textcomment:''
				, cost_shipping:glbashipping["price"]
				, idtenantpaymenttype:gblapay["id"]
				, idtenant_people_address:glbaadress['id']
				, idtenantshippingtype:glbashipping["id"]
				, idorder: gblapay["idorder"]
				};
	if(gblapay["method"] == "LOJA"){
		purl = url + "/saveorder";
		postdopay(purl,pdata);
	}else if(gblapay["method"] == "CD" || gblapay["method"] == "BL"){
		if(hasSessionId){
			purl = url + "/payment/pagseguro/dopayment";
			var VsenderHash = PagSeguroDirectPayment.getSenderHash();
			var dados = {paymentMode: 'default'
						, paymentMethod: 'boleto'
						, receiverEmail: glbaaffiliate["email"]
						, currency: 'BRL'
						, notificationURL: url + '/payment/pagseguro/listenpayment'
						, senderName: $('#profile_order_firstname').val() + ' ' + $('#profile_order_lastname').val()
						, senderCPF: NameU_NumberChar($('#order_profile_document').val())
						, senderAreaCode: $('#creditCardHolderAreaCode').val()
						, senderPhone: $('#creditCardHolderPhone').val()
						, senderHash: VsenderHash
						, shippingAddressStreet: glbaadress["rua"]
						, shippingAddressNumber: glbaadress["numero"]
						, shippingAddressComplement: $('#profile_order_complement').val()
						, shippingAddressDistrict: glbaadress["bairro"]
						, shippingAddressPostalCode: NameU_NumberChar(glbaadress["cep"])
						, shippingAddressCity: $('#profile_order_city').val()
						, shippingAddressState: $('#profile_order_states').val().toUpperCase()
						, shippingAddressCountry: 'BRA'
						, shippingType: 1
						, shippingCost: NameU_pontue(glbashipping["price"], 2, ".", "")
						};
				pdata = NameU_Json_Concat(pdata, dados);
				pdata = NameU_Json_Concat(pdata, gblacart_prod);
			if(gblapay["method"] == "CD"){
				if($('#cardemail').val().length > 0){
                    var BirthDay = $('#tday').val() + '/' + $('#tmonth').val() + '/' + $('#tyear').val();
                  	var isI = $("input[name='cart_I']:checked").val();
					
					var retorno_confirm = $('#cardName').val().length == 0 ? "nome, " : '';
					retorno_confirm += $('#cardCPF').val().length == 0 ? "CPF, " : '';
					retorno_confirm += BirthDay.length < 3 ? "data de nascimeto, " : '';
					retorno_confirm += $('#installmentQuantity').val().length == 0 ? "quantidade de parcela, " : '';
					retorno_confirm += $('#cardNumber').val().length == 0 ? "número do cartão, " : '';
					retorno_confirm += $('#cardExpirationMonth').val().length == 0 ? "mês de validade, " : '';
					retorno_confirm += $('#cardExpirationYear').val().length == 0 ? "ano de validade, " : '';
					retorno_confirm += $('#cardCvv').val().length == 0 ? "CVV, " : '';
					if(isI == 'false'){
						retorno_confirm += $('#cardAreaCode').val().length == 0 ? "DDD, " : '';
						retorno_confirm += $('#cardPhone').val().length == 0 ? "telefone, " : '';
						retorno_confirm += $('#cardPostalCode').val().length == 0 ? "CEP, " : '';
						retorno_confirm += $('#cardStreet').val().length == 0 ? "rua, " : '';
						retorno_confirm += $('#cardStreetNumber').val().length == 0 ? "número do endereço, " : '';
						retorno_confirm += $('#cardDistrict').val().length == 0 ? "bairro, " : '';
						retorno_confirm += $('#cardCity').val().length == 0 ? "cidade, " : '';
						retorno_confirm += $('#cardState').val().length == 2 ? '' : "estado com dois caracteres, ";
					}
					if(retorno_confirm.length > 0){
						retorno_confirm = retorno_confirm.substring(0,(retorno_confirm.length - 2));
						NameU_LoadingPage_Hide();
						NameU_Interacao_Top_Time("Favor preencher o(s) seguinte(s) dado(s) do pagamento:<br>" + retorno_confirm, 3000);
					}else{
						var isIAreaCode		= isI == 'true' ? $('#creditCardHolderAreaCode').val() : $('#cardAreaCode').val();
						var isIPhone		= isI == 'true' ? $('#creditCardHolderPhone').val() : $('#cardPhone').val();
						var isIStreet		= isI == 'true' ? glbaadress["rua"] : $('#cardStreet').val();
						var isINumber		= isI == 'true' ? glbaadress["numero"] : $('#cardStreetNumber').val();
						var isIComplement	= isI == 'true' ? $('#profile_order_complement').val() : $('#cardComplement').val();
						var isIDistrict		= isI == 'true' ? glbaadress["bairro"] : $('#cardDistrict').val();
						var isIPostalCode	= isI == 'true' ? glbaadress["cep"] : $('#cardPostalCode').val();
						var isICity			= isI == 'true' ? $('#profile_order_city').val() : $('#cardCity').val();
						var isIState		= isI == 'true' ? $('#profile_order_states').val() : $('#cardState').val();
                        
						var ddscd = {paymentMethod: 'creditCard'
									, senderEmail: $('#cardemail').val()
									, creditCardToken: gblacard.cdToken
									, installmentQuantity: gblacard.cdParc
									, installmentValue: gblacard.cdValue
									, creditCardHolderName: $('#cardName').val()
									, creditCardHolderCPF: NameU_NumberChar($('#cardCPF').val())
									, creditCardHolderBirthDate: BirthDay
									, creditCardHolderAreaCode: isIAreaCode
									, creditCardHolderPhone: isIPhone
									, billingAddressStreet: isIStreet
									, billingAddressNumber: isINumber
									, billingAddressComplement: isIComplement
									, billingAddressDistrict: isIDistrict
									, billingAddressPostalCode: NameU_NumberChar(isIPostalCode)
									, billingAddressCity: isICity
									, billingAddressState: isIState.toUpperCase()
									, billingAddressCountry: 'BR'
									};
						pdata = NameU_Json_Concat(pdata, ddscd);
                        //alert(JSON.stringify(pdata));
						postdopay(purl,pdata);
                        NameU_LoadingPage_Hide();
					}
				}else{
					NameU_LoadingPage_Hide();
					NameU_Interacao_Top("Favor preencher o e-mail do pagseguro, na comprar por cartão de crédito!");
				}
			}else if(gblapay["method"] == "BL"){
				if($('#boletoemail').val().length > 0){
					pdata["senderEmail"] = $('#boletoemail').val();
					pdata["paymentMethod"] = 'boleto';
					postdopay(purl,pdata);
                    NameU_LoadingPage_Hide();
				}else{
					NameU_LoadingPage_Hide();
					NameU_Interacao_Top("Favor preencher o e-mail do pagseguro, na comprar por boleto!");
				}
			}
		}else{
			NameU_LoadingPage_Hide();
			NameU_Interacao_Top("Aguarde...");
		}
	}
}

function postdopay(purl,pdata){
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: purl,
		data: pdata,
		cache: false
	})
	.done(function(data) {
		var obj = data;
        //alert(JSON.stringify(obj));
		if (obj.error == 0){
			if (obj.retorno > 0){
				gblapay["idorder"] = 0;
				if(gblapay["method"] == "CD"){
					// var linha = obj["payment/pagseguro/dopayment"].transaction;
					// var vcode = linha.code;
					// var vpaymentLink = linha.paymentLink;
					// $("#div_ret_paymenttype").empty().append(vcode + '<a href="#" onclick="window.open(\'' + vpaymentLink + '\',\'_system\');" >' + vpaymentLink + '</a>');
				}else{
					
				}
				NameU_LoadingPage_Hide();
				get_order_pay(obj.retorno);
			}
		}else{
            NameU_Interacao_Top(obj.msg);
            NameU_LoadingPage_Hide();
			//alert(JSON.stringify(obj));
		}
		var ridorder = obj["payment/pagseguro/dopayment"]["idorder"];
		if( typeof ridorder !== 'undefined' && ridorder !== null ){
			gblapay["idorder"] = ridorder;
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_cart_pay", function(event) { });
$( document ).on( "pagecreate", "#vw_cart_pay", function(event) { });

function get_order_pay(pid){
    $("#order_list_user_pay").empty();
    $("#list_cart_pay_control").empty();
    $("#order_close_end").empty();
    NameU_LoadingPage_Show();
    $.ajax({ 
        headers: gblaheaders,
        type: "GET",
        url: url + "/obtorderppl/" + pid,
        cache: false
    })
    .done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.obtorderppl;
				var items = [];
				var items_end = [];

				$("#order_list_user_pay").empty();
				$("#list_cart_pay_control").empty();
				var btnblt = linha.is_pay == 1 ? (linha.textcomment.length > 0 ? '<button type="button" class="ui-btn btn_def_log" onclick="window.open(\'' + linha.textcomment + '\',\'_system\')">BOLETO</button>' : '') : '';
				items.push('<li data-id="' + linha.idtenant_order + '" class="btn_my_order_control"> ' +
							'    <p>NUMERO DO PEDIDO: <span>' + linha.idtenant_order + '</span></p> ' +
							'    <p>NOME DA LOJA: <span>' + linha.affiliates_name + '</span></p> ' +
                            '    <p>DATA DA COMPRA: <span>' + NameU_DateTime_BR(linha.dtcreate) + '</span></p> ' +
                            '    <p>DATA DO PAGAMENTO: <span>' + NameU_DateTime_BR(linha.dtpayment) + '</span></p> ' +
                            '    <p>VALOR DA COMPRA: <span>' + NameU_pontue(linha.pay_price, 2, ",", ".") + '</span></p> ' +
							'    <p>SITUAÇÃO: <span>' + linha.LOG + '</span></p> ' +
							'	' + btnblt +
							'</li>');
				var list = items.join(' ');
				$('#order_list_user_pay').append(list).listview().listview('refresh');
				$("#order_close_end").empty().append('<div class="ui-grid-b class_sum_reg">'+
													'<div class="ui-block-a adjuste_cart_checkout">'+
													'    SUB TOTAL'+
													'</div>'+
													'<div class="ui-block-b">'+
													'</div>'+
													'<div class="ui-block-c">'+
													'    ' + NameU_pontue(linha.total_price, 2, ",", ".") + ''+
													'</div>'+
													'</div>'+
													'<div class="ui-grid-b class_sum_reg">'+
													'    <div class="ui-block-a adjuste_cart_checkout">'+
													'        ENTREGA'+
													'    </div>'+
													'    <div class="ui-block-b">'+
													'    </div>'+
													'    <div class="ui-block-c">'+
													'        ' + NameU_pontue(linha.cost_shipping, 2, ",", ".") + ''+
													'    </div>'+
													'</div>'+
													'<div class="ui-grid-b class_sum_reg total_reg">'+
													'    <div class="ui-block-a adjuste_cart_checkout">'+
													'        TOTAL'+
													'     </div>'+
													'    <div class="ui-block-b">'+
													'    </div>'+
													'    <div class="ui-block-c">'+
													'        ' + NameU_pontue(linha.pay_price, 2, ",", ".") + ''+
													'    </div>'+
													'</div>');

				if (linha.ITENS[2] > 0){
					var itens_data_myorder = linha.ITENS[1];
					var item_order_sku = [];
					$.each(itens_data_myorder, function(k,v){
						var linha_item = itens_data_myorder[k];
						var linha_grid = '';
						if (linha_item.GRID[2] > 0){
							linha_grid = '<div class="ui-grid-a sku_control_cart">'+
										'    <div class="ui-block-a">'+
										'        ' + linha_item.GRID[1][0].p_typeitem_frontend_type + 
										'    </div>'+
										'    <div class="ui-block-b">'+
										'        <span class="control_select_sku_cart">'+
										'          ' +  linha_item.GRID[1][0].p_typeitemoptions_option_value +  
										'       </span>'+
										'    </div>'+
										'</div>';
						}
						item_order_sku.push('<li data-id="0" data-sku="0" >'+
											'<img src="' + linha_item.IMGPRODUCT + '?' + NameU_Random() + '" class="store_search_item">'+
											'<h4  class="store_search_item">' + linha_item.product_name + '</h4>'+
											linha_grid + 
											'<div class="ui-grid-a sku_control_cart">'+
											'    <div class="ui-block-a">'+
											'        QUANTIDADE'+
											'   </div>'+
											'    <div class="ui-block-b">'+
											'        <span class="control_select_sku_cart">'+
											'           ' + NameU_pontue(linha_item.item_amount, 2, ",", ".") + ' '+
											'        </span>'+
											'    </div>'+
											'</div>'+
											'<p  class="store_search_item"><span class="price_product_tier">' + NameU_pontue(linha_item.item_price, 2, ",", ".") + '</span></p>'+
											'</li>');
					});
					var list = item_order_sku.join(' ');
					$('#list_cart_pay_control').append(list).listview().listview('refresh');
				}
				NameU_LoadingPage_Hide();
				NameU_Tredir("#vw_cart_pay");
			}else{
				NameU_Interacao_Top(obj.msg);
				NameU_Tredir("#vw_my_order");
			}
		}else{
			NameU_Interacao_Top(obj.msg);
			NameU_Tredir("#vw_my_order");
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
		NameU_Tredir("#vw_my_order");
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	});
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_wishlist", function(event) { 
    wishlist_get();
});


/*******************************/
/******* notifications by Rafa *********/
/*******************************/
var notifications = {
    handleNotification:function(data){
        
        if(data.tipo === 'alert'){
            navigator.notification.alert(
                                        data.message,  		   // message
                                        data.callback,         // callback
                                        data.title,            // title
                                        data.textButton);
        }
        else
        if(data.tipo === 'confirm'){
            navigator.notification.confirm(
                                        data.message,  		   // message
                                        data.callback,         // callback
                                        data.title,            // title
                                        data.textButton);
        }
    }
};


/*******************************/
/******* handleInsertTarja by Rafa *********/
/*******************************/
function handleInsertTarja(page){

	if(localStorage.getItem('lojaselecionada') == 'null' || localStorage.getItem('lojaselecionada') == ''){

		
		$('#'+page).each(function(){

			$(this).find('.NameU-header').empty().append('<div class="loja_nao_selecionada_top" align="center">'+ 
						                        '<a href=\'javascript:0\' onclick="javascript:NameU_Tredir(\'#vw_affiliate\')"> Entrar em uma loja </a>'+
						                  '</div>');
		});
	}
	else
	{
		$('#'+page).each(function(){
			$(this).find('.NameU-header').remove('.loja_nao_selecionada_top');
		});
	}

}




// Show a custom confirmation dialog
//
function showConfirmWishlist() {
    navigator.notification.confirm(
        'Tem certeza que deseja limpar a lista?', // message
         wishlist_del_all,            // callback to invoke with index of button pressed
        'Limpar Favoritos',           // title
        ['Sim','Não']         // buttonLabels
    );
}


$( document ).on( "pagecreate", "#vw_wishlist", function(event) { 
    $("#del_wishlist_product").click(function(){
        showConfirmWishlist();
        /*
        var isGood=confirm('Tem certeza que deseja limpar a lista?');
		if (isGood) {
			wishlist_del_all();
		}
        */
    });
    
 
    
    $('#wishlist_list').delegate("img.item_click_wishlist, h4.item_click_wishlist, p.item_click_wishlist", "click", function(){
        glbaproduct = {id:$(this).attr("data-id"), sku:$(this).attr("data-sku"), fltype:$(this).attr("data-type")};
        obtproduct();
    }); 
    
    $('#wishlist_list').delegate(".remove_control_item_wishlist", "click", function(){
        wishlist_del($(this).attr("data-id"));
    });
});

function wishlist_del_all(buttonIndex){
    if (buttonIndex == 1){
        NameU_LoadingPage_Show();
        $.ajax({ 
            headers: gblaheaders,
            type: "DELETE",
            url: url + "/delallwishlist",
            cache: false
        })
        .done(function(data) {
            var obj = data;
            if (obj.error == 0){
                if (obj.retorno > 0){
                    NameU_Interacao_Top(obj.msg);
                    wishlist_get();
                }else{
                    NameU_Interacao_Top(obj.msg);
                }
            }else{
                NameU_Interacao_Top(obj.msg);
            }
            NameU_LoadingPage_Hide();
        })
        .fail(function(xhr, err) { 
            NameU_Fail(xhr, err);
        })
        .always(function() {
            NameU_LoadingPage_Hide();
        }); 
    }
}

function wishlist_del(id){
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "DELETE",
		url: url + "/delwishlist/" + id,
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
                wishlist_get();
                NameU_Interacao_Top(obj.msg);
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
        NameU_LoadingPage_Hide();
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function wishlist_get(){
    $("#wishlist_list").empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/wishlist",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
                var itemcss = "";
                $.each(obj.wishlist, function(k,v){
                    var linha = obj.wishlist[k];
                    var click_data = ' data-id="' + linha.ID + '" data-sku="' + (linha.IDSKU == null > 0 ? linha.IDSKU : 0) + '"  data-type="' + linha.TYPE + '" ';
                    // var data_buy = "";
                    // if(glbaaffiliate["id"] > 0){
                        // data_buy = '<p><button ' + click_data + ' class="class_buy item_click_wishlist">COMPRAR</button></p>';
                    // }
                    items.push('<li>'+
                                '	<img src="' + linha.IMGPRODUCT + '?' + NameU_Random() + '" class="store_wishlist_item item_click_wishlist" ' + click_data + '>'+
                                '	<img src="img/fechar.png"  width="30px" class="remove_control_item_wishlist"  data-id="' + linha.idtenant_wishlist + '">'+
                                '	<br>' +
								'	<h4 class="store_wishlist_item item_click_wishlist"  ' + click_data + '>' + linha.DESCRIPTION + '</h4>'+
                                '	<p  class="store_wishlist_item item_click_wishlist"  ' + click_data + '></p>' +
                                // data_buy + 
                                ' </li>');
                });
                var list = items.join(' ');
				$('#wishlist_list').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}
			else
			{
				$('#del_wishlist_product').empty().html('Nenhum favorito encontrado, <a href="javascript:0" onclick="javascript:NameU_Tredir(\'#vw_storeu\')"><strong>clique aqui</strong></a>');
			}
            NameU_LoadingPage_Hide();
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
        NameU_check_Images();
		NameU_LoadingPage_Hide();
	}); 
}
// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_connect", function(event) {
	conectadodb("checklogin");
    $("#form_updatepass_control").hide();
});
$( document ).on( "pagecreate", "#vw_connect", function(event) {
    $("#btn_control_pass").click(function(){
        if(!$("#form_updatepass_control").is(":visible")){
            $("#form_updatepass_control").show();
        }else{
            $("#form_updatepass_control").hide();
        }
    });
    $("#login_btn_entrar").click(function(){
		if($("#login_email").val().length > 0){
			if($("#login_password").val().length > 0){
				login();
			}else{
				NameU_Interacao_Top("Informe a senha!");
			}
		}else{
			NameU_Interacao_Top("Informe o e-mail!");
		}
    });
    $("#remember_btn_enviar").click(function(){
		if($("#remember_email").val().length > 0){
			remember();
		}else{
			NameU_Interacao_Top("Informe o e-mail!");
		}
    });
    $("#updpasswordtoken_btn_update").click(function(){
		if($("#updpasswordtoken_token").val().length > 0){
			if($("#updpasswordtoken_newpassword").val().length > 0){
				if($("#updpasswordtoken_confirmnewpassword").val().length > 0){
					if($("#updpasswordtoken_newpassword").val() == $("#updpasswordtoken_confirmnewpassword").val()){
						updpasswordtoken();
					}else{
						NameU_Interacao_Top("Senhas incorretas!");
					}
				}else{
					NameU_Interacao_Top("Confirme a senha!");
				}
			}else{
				NameU_Interacao_Top("Informe a senha!");
			}
		}else{
			NameU_Interacao_Top("Informe o token!");
		}
    });
    $("#register_btn_create").click(function(){
		if($("#register_name").val().length > 0){
			if($("#register_email").val().length > 0){
				if($("#register_password").val().length > 0){
					if($("#register_termsofuse").is(":checked") == 1){
						register();
					}else{
						NameU_Interacao_Top("Aceite o Termo de uso!");
					}
				}else{
					NameU_Interacao_Top("Confirme a senha!");
				}
			}else{
				NameU_Interacao_Top("Informe seu e-mail!");
			}
		}else{
			NameU_Interacao_Top("Informe seu nome!");
		}
    });
});

function login(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/login",
		data: {username:$("#login_email").val(), password:$("#login_password").val()},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.login;
				NameU_LoadingPage_Hide();
				acessardb(linha.session,linha.nickname,linha.email,linha.type,linha.flvalid);
				$("#login_email, #login_password").val("");
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function remember(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/remember",
		data: {email:$("#remember_email").val()},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		NameU_LoadingPage_Hide();
		NameU_Interacao_Top(obj.msg);
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.remember;
				$("#remember_email").val("");
			}
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function updpasswordtoken(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "PUT",
		url: url + "/updpasswordtoken/" + $("#updpasswordtoken_token").val(),
		data: {newpassword:$("#updpasswordtoken_newpassword").val(), confirmnewpassword:$("#updpasswordtoken_confirmnewpassword").val()},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		NameU_LoadingPage_Hide();
		NameU_Interacao_Top(obj.msg);
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.updpasswordtoken;
				$("#updpasswordtoken_token, #updpasswordtoken_newpassword, #updpasswordtoken_confirmnewpassword").val("");
			}
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function register(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/register",
		data: {name:$("#register_name").val(), email:$("#register_email").val(),password:$("#register_password").val(), npassword:$("#register_password").val()},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		NameU_LoadingPage_Hide();
		NameU_Interacao_Top(obj.msg);
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.register;
				NameU_LoadingPage_Hide();
				acessardb(linha.session,linha.nickname,linha.email,linha.type,linha.flvalid);
				$("#register_name, #register_email, #register_password").val('');
			}
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_profile", function(event) {
	conectadodb("checkprofile");
    $("#form_profile").hide();
	inti_profilr();
	obtprofile();
    if (glbaaffiliate["id"] == 0 || glbaadress.logradouro == ""){
        $("#btn_access_store_loja").show();
    }else{
        $("#btn_access_store_loja").hide();
    }
    
});
$( document ).on( "pagehide", "#vw_profile", function(event) {
    $("#form_profile").hide();
	$("#div_flvalid, #profile_dados").empty();
});
$( document ).on( "pagecreate", "#vw_profile", function(event) {
    $("#form_profile").hide();
    $("#logoff_btn_desconectar").click(function(){
		logoff();
    });
    $("#btn_access_store_loja").click(function(){
		mylocal();
    });
    $("#btn_profile_save").click(function(){
		updprofile('PROFILE',$('#profile_firstname').val(),$('#profile_lastname').val(),$('#profile_firstname').val(),$('#profile_birthdate').val(),$("input[name='profile_sexo']:checked").val(),$('#profile_document').val());
    });
    $("#btn_access_store_loja").hide();
    $("#btn_form_updatepass").click(function(){
        if(!$("#form_profile").is(":visible")){
			$("#form_profile").show();
        }else{
			$("#form_profile").hide();
        }
    });
});

function inti_profilr(){
	$("#div_flvalid, #profile_dados").empty();
    
    list_push();
    get_device();
    
    if (glbaaffiliate["id"] > 0){
        $("#list_local_store_show").show();
        get_affiliate_gbl("#mystore_profile");
        get_mylocal_gbl("#mylocal_profile", true);
    }else{
         $("#list_local_store_show").hide();
    }
    
	$("#profile_dados").append('<img src="img/side-connect.png" class="NameU-profile-image">' +
								'<div class="NameU-profile-dados">' + gblauserdb["nickname"] + '<br><small>' + gblauserdb["email"] + '<small></div>').trigger('create');
    $("list_profile_user").listview().listview('refresh');
	if(gblauserdb["flvalid"] == 1){
		$("#div_flvalid").append('<div class="NameU-verifido">VERIFICADO</div>');
	}else{
		$("#div_flvalid").append(   '<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" data-iconpos="right" data-theme="c">' +
                                    '	<h4>VALIDAR PERFIL</h4>' +
                                    '	<ul data-role="listview" data-inset="false">' +
                                    '		<li>' +
                                    '			<div class="ui-grid-solo">' +
                                    '				<div class="ui-block-a"><input type="text" class="input_control" placeholder="DIGITE O CÓDIGO" id="validate_token"></div>' +
                                    '			</div>' +
                                    '			<div class="ui-grid-solo">' +
                                    '				<div class="ui-block-a">' +
                                    '					<input type="password" class="input_control form_control_adjust adjust_control_input" placeholder="SUA SENHA" id="validate_senha">' +
                                    '					<button type="button" class="btn_control_uppass adjust_control_input btn_acert_user" onclick="btn_validate()">Validar</button>' +
                                    '				</div>' +
                                    '			</div>' +
                                    '		</li>' +
                                    '	</ul>' +
                                    '</div>').trigger('create');
	}
	
}

function get_device(){
    $("#my_list_device").empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/getdevice",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
                var itemcss = "";
                $.each(obj.getdevice, function(k,v){
                    var linha = obj.getdevice[k];
					if(linha.device_model.length > 0){
						items.push('<li>' +
									'<strong>' + linha.device_model + '</strong><br>' +
									'<small>' + linha.device_version + '</small>' +
								   '</li>');
					}
                });
                var list = items.join(' ');
				$('#my_list_device').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}
            NameU_LoadingPage_Hide();
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function btn_validate(){	
	if($("#validate_token").val().length > 0){
		if($("#validate_senha").val().length > 0){
			validate();
		}else{
			NameU_Interacao_Top("Informe sua senha!");
		}
	}else{
		NameU_Interacao_Top("Informe o código!");
	}
}

function validate(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "PUT",
		url: url + "/validate/" + $("#validate_token").val(),
		data: {password:$("#validate_senha").val()},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		NameU_LoadingPage_Hide();
		NameU_Interacao_Top(obj.msg);
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.validate;
				updflvaliddb(gblaheaders["Authorization"],1);
				$("#validate_token, #validate_senha").val("");
			}
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function logoff(){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/logoff",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.logoff;
				sairdb();
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function obtprofile(){
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/obtprofile",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.obtprofile;
				$('#profile_firstname').val(linha.firstname);
				$('#profile_lastname').val(linha.lastname);
				$('#profile_birthdate').val(linha.birthdate);
				$('#profile_sexo_' + linha.sexo).attr('checked', true);
				$('#div_fielset_profile_sexo').trigger('create');
				$('#profile_document').val(linha.document);
				NameU_LoadingPage_Hide();
			}
            NameU_LoadingPage_Hide();
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function updprofile(pmsgret,pfirstname,plastname,pnickname,pbirthdate,psexo,pdocument){
	NameU_LoadingPage_Show();
	var exec = false;
	if(pmsgret == 'PROFILE'){
		var exec = true;
	}else if(pmsgret == 'PAY'){
		var retorno_confirm = pfirstname.length == 0 ? "\nInforme seu nome<br>" : '';
		retorno_confirm += plastname.length == 0 ? "\nInforme seu sobrenome<br>" : '';
		retorno_confirm += pdocument.length == 0 ? "\nInforme seu CPF<br>" : '';
		
		retorno_confirm += $('#creditCardHolderAreaCode').val().length == 0 ? "\nInforme seu DDD<br>" : '';
		retorno_confirm += $('#creditCardHolderPhone').val().length == 0 ? "\nInforme seu Telefone<br>" : '';
		retorno_confirm += $('#profile_order_city').val().length == 0 ? "\nInforme sua Cidade<br>" : '';
		retorno_confirm += $('#profile_order_states').val().length == 2 ? '' : "\nInforme seu Estado com dois caracteres<br>";
		if(retorno_confirm.length > 0){
			NameU_Interacao_Top_Time("Favor preencher os seguintes dados:" + retorno_confirm, 3000);
			exec = false;
		}else{
			exec = true;
		}
	}
	if(exec){		
		$.ajax({ 
			headers: gblaheaders,
			type: "PUT",
			url: url + "/updprofile",
			data: {firstname:pfirstname,lastname:plastname,nickname:pnickname,birthdate:pbirthdate,sexo:psexo,document:pdocument,document_type:0},
			cache: false
		})
		.done(function(data) {
			var obj = data;
			if (obj.error == 0){
				if (obj.retorno > 0){
					if(pmsgret == 'PROFILE'){
						obtprofile();
					}else if(pmsgret == 'PAY'){
						savepeopleaddress(pmsgret,0,glbaadress.cep,glbaadress.rua,glbaadress.numero,$('#profile_order_complement').val(),glbaadress.bairro,$('#profile_order_city').val(),$('#profile_order_states').val(),'',0,glbaadress.latitude,glbaadress.longitude);
					}
				}else{
					if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
				}
			}else{
				if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
			}
			if(pmsgret == 'PROFILE'){
				NameU_LoadingPage_Hide();
				NameU_Interacao_Top(obj.msg);
			}
		})
		.fail(function(xhr, err) { 
			NameU_Fail(xhr, err);			
			if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
		})
		.always(function() {
			if(pmsgret == 'PROFILE'){ NameU_LoadingPage_Hide(); }
		}); 
	}else{
		if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
	}
}

function savepeopleaddress(pmsgret,pidtenant_people_address,pzip_code,paddress,pref_number,pcomplement,pdistrict,pcity,pstates,pcountry,paddress_type,platitude,plongitude){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/savepeopleaddress",
		data: {idtenant_people_address:pidtenant_people_address,zip_code:pzip_code,address:paddress,ref_number:pref_number,complement:pcomplement,district:pdistrict,city:pcity,states:pstates,country:pcountry,address_type:paddress_type,latitude:platitude,longitude:plongitude},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.savepeopleaddress;
				glbaadress["id"] = obj.retorno;
				if(pmsgret == 'PAY'){
					savepeoplephone(pmsgret,0,'',$('#creditCardHolderAreaCode').val(),$('#creditCardHolderPhone').val(),'',0);
				}
			}else{
				if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
			}
		}else{
			if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
		if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
	})
	.always(function() {
		if(pmsgret == 'ADDRESS'){ NameU_LoadingPage_Hide(); }
	}); 
}

function savepeoplephone(pmsgret,pidtenant_people_phone,pprefixcode,pareacode,ptelephone,pcodephone,pphone_type){
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/savepeoplephone",
		data: {idtenant_people_phone:pidtenant_people_phone,prefixcode:pprefixcode,areacode:pareacode,telephone:ptelephone,codephone:pcodephone,phone_type:pphone_type},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.savepeoplephone;
                if(gblapay["method"] == "CD"){
				    updateCardToken();
                }else{
                    execdopay();
                }
			}else{
				if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
			}
		}else{
			if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
		if(pmsgret == 'PAY'){ NameU_LoadingPage_Hide(); }
	})
	.always(function() {
		if(pmsgret == 'PHONE'){ NameU_LoadingPage_Hide(); }
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_pushu", function(event) { 
    
});
$( document ).on( "pagecreate", "#vw_pushu", function(event) { 
    $('#list_control_pushu_select').delegate(".control_item_pushu", "click", function(){
        gblidpushu = $(this).attr("data-id");
        obt_push_item($(this).attr("data-id"));
    });
});

function obt_push_item(id){
    $("#content_push_get").empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/obtpushuser/" + id,
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
                var linha = obj.obtpushuser;
                
                items.push('<span>' + NameU_DateTime_BR(linha.dtcreate) + '</span>' + 
                           '<h4>' + linha.TITLE + '</h4>' +
                           '<p>' + linha.MESSAGE + '</p>' +
                           '<img src="' + linha.URL + '" width="100%">');
               
                var list = items.join(' ');
				$('#content_push_get').append(list).trigger("create");
				NameU_LoadingPage_Hide();
                NameU_Tredir_Up("#vw_push_msg");
			}
            NameU_LoadingPage_Hide();
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function list_push(){
    $("#list_control_pushu_select").empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/pushuser",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
                var itemcss = "";
                
				$.each(obj.pushuser, function(k,v){
                    var linha = obj.pushuser[k];
                    items.push('<li class="control_item_pushu" data-id="' + linha.idtenant_push_return + '">' +
                                '<h4>' + linha.TITLE + '</h4>' +
                                '<p>' + linha.MESSAGE + '</p>' +
                                '<span>' + NameU_DateTime_BR(linha.dtcreate) + '</span>' +
                               '</li>');
                });
                var list = items.join(' ');
				$('#list_control_pushu_select').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}
            NameU_LoadingPage_Hide();
		}else{
			NameU_Interacao_Top(obj.msg);
		}
        $("#count_push").empty().append(obj.pushuser.length);
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_push_msg", function(event) { });
$( document ).on( "pagecreate", "#vw_push_msg", function(event) { 
    $("#delete_push_btn").click(function(){
        delete_push_id();
    });
});

function delete_push_id(){
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "DELETE",
		url: url + "/delpush/" + gblidpushu,
		data: {email:$("#remember_email").val()},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		NameU_LoadingPage_Hide();
		NameU_Interacao_Top(obj.msg);
        list_push();
        NameU_Back();
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_my_order", function(event) { 
    menu_app("#sidebar_menu_15");
	get_myorders();
});
$( document ).on( "pagecreate", "#vw_my_order", function(event) {
    $('#list_control_my_order_select').delegate("li.btn_my_order_control", "click", function(){
         idmyorder = $(this).attr("data-id");
         get_order(idmyorder);
	});
});

function get_myorders(){
    $("#list_control_my_order_select").empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/orderppl",
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
                var itemcss = "";
                gblmyorders = obj.orderppl;
				$.each(obj.orderppl, function(k,v){
					var linha = obj.orderppl[k];
                    items.push('<li data-id="' + linha.idtenant_order + '" class="btn_my_order_control"> ' +
                                '    <p>NUMERO DO PEDIDO: <span>' + linha.idtenant_order + '</span></p> ' +
                                '    <p>NOME DA LOJA: <span>' + linha.affiliates_name + '</span></p> ' +
                                '    <p>DATA DA COMPRA: <span>' + NameU_DateTime_BR(linha.dtcreate) + '</span></p> ' +
								'    <p>DATA DO PAGAMENTO: <span>' + NameU_DateTime_BR(linha.dtpayment) + '</span></p> ' +
                                '    <p>VALOR DA COMPRA: <span>' + NameU_pontue(linha.pay_price, 2, ",", ".") + '</span></p> ' +
                                '    <p>SITUAÇÃO: <span>' + linha.LOG + '</span></p> ' +
                                '</li>');
				});
				var list = items.join(' ');
				$('#list_control_my_order_select').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}


// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_order", function(event) { });
$( document ).on( "pagecreate", "#vw_order", function(event) { });

function get_order(id){
    $("#order_list_user").empty();
    $("#list_cart_control_order").empty();
    $("#order_close_end").empty();
    NameU_LoadingPage_Show();
    $.ajax({ 
        headers: gblaheaders,
        type: "GET",
        url: url + "/obtorderppl/" + id,
        cache: false
    })
    .done(function(data) {
        var obj = data;
        if (obj.error == 0){
            if (obj.retorno > 0){
                var linha = obj.obtorderppl;
                var items = [];
                var items_end = [];
                
                $("#order_list_user").empty();
                $("#list_cart_control_order").empty();
				var btnblt = linha.is_pay == 1 ? (linha.textcomment.length > 0 ? '<button type="button" class="ui-btn btn_def_log" onclick="window.open(\'' + linha.textcomment + '\',\'_system\')">BOLETO</button>' : '') : '';
				items.push('<li data-id="' + linha.idtenant_order + '" class="btn_my_order_control"> ' +
                            '    <p>NUMERO DO PEDIDO: <span>' + linha.idtenant_order + '</span></p> ' +
                            '    <p>NOME DA LOJA: <span>' + linha.affiliates_name + '</span></p> ' +
                            '    <p>DATA DA COMPRA: <span>' + NameU_DateTime_BR(linha.dtcreate) + '</span></p> ' +
                            '    <p>DATA DO PAGAMENTO: <span>' + NameU_DateTime_BR(linha.dtpayment) + '</span></p> ' +
                            '    <p>VALOR DA COMPRA: <span>' + NameU_pontue(linha.pay_price, 2, ",", ".") + '</span></p> ' +
                            '    <p>SITUAÇÃO: <span>' + linha.LOG + '</span></p> ' +
                            '	' + btnblt +
							'</li>');
                    var list = items.join(' ');
                    $('#order_list_user').append(list).listview().listview('refresh');
                    $("#order_close_end").empty().append('<div class="ui-grid-b class_sum_reg">'+
                            '<div class="ui-block-a adjuste_cart_checkout">'+
                            '    SUB TOTAL'+
                            '</div>'+
                            '<div class="ui-block-b">'+
                            '</div>'+
                            '<div class="ui-block-c">'+
                            '    ' + NameU_pontue(linha.total_price, 2, ",", ".") + ''+
                            '</div>'+
                            '</div>'+
                            '<div class="ui-grid-b class_sum_reg">'+
                            '    <div class="ui-block-a adjuste_cart_checkout">'+
                            '        ENTREGA'+
                            '    </div>'+
                            '    <div class="ui-block-b">'+
                            '    </div>'+
                            '    <div class="ui-block-c">'+
                            '        ' + NameU_pontue(linha.cost_shipping, 2, ",", ".") + ''+
                            '    </div>'+
                            '</div>'+
                            '<div class="ui-grid-b class_sum_reg total_reg">'+
                            '    <div class="ui-block-a adjuste_cart_checkout">'+
                            '        TOTAL'+
                            '     </div>'+
                            '    <div class="ui-block-b">'+
                            '    </div>'+
                            '    <div class="ui-block-c">'+
                            '        ' + NameU_pontue(linha.pay_price, 2, ",", ".") + ''+
                            '    </div>'+
                            '</div>');
                
                    if (linha.ITENS[2] > 0){
                        var itens_data_myorder = linha.ITENS[1];
                        var item_order_sku = [];
                        $.each(itens_data_myorder, function(k,v){
                            
                            var linha_item = itens_data_myorder[k];
                            var linha_grid = '';
                            if (linha_item.GRID[2] > 0){
                              linha_grid =   '<div class="ui-grid-a sku_control_cart">'+
                                             '    <div class="ui-block-a">'+
                                             '        ' + linha_item.GRID[1][0].p_typeitem_frontend_type + 
                                             '    </div>'+
                                             '    <div class="ui-block-b">'+
                                             '        <span class="control_select_sku_cart">'+
                                             '          ' +  linha_item.GRID[1][0].p_typeitemoptions_option_value +  
                                             '       </span>'+
                                             '    </div>'+
                                             '</div>';
                            }
                            
                            
                            item_order_sku.push('<li data-id="0" data-sku="0" >'+
                             '<img src="' + linha_item.IMGPRODUCT + '?' + NameU_Random() + '" class="store_search_item">'+
                             '<h4  class="store_search_item">' + linha_item.product_name + '</h4>'+
                             linha_grid + 
                             '<div class="ui-grid-a sku_control_cart">'+
                             '    <div class="ui-block-a">'+
                             '        QUANTIDADE'+
                             '   </div>'+
                             '    <div class="ui-block-b">'+
                             '        <span class="control_select_sku_cart">'+
                             '           ' + NameU_pontue(linha_item.item_amount, 2, ",", ".") + ' '+
                             '        </span>'+
                             '    </div>'+
                             '</div>'+
                             '<p  class="store_search_item"><span class="price_product_tier">' + NameU_pontue(linha_item.item_price, 2, ",", ".") + '</span></p>'+
                             '</li>');
                        });
                        var list = item_order_sku.join(' ');
                        $('#list_cart_control_order').append(list).listview().listview('refresh');
                    }
                    NameU_LoadingPage_Hide();
                }else{
                    NameU_Interacao_Top(obj.msg);
                }
            }else{
                NameU_Interacao_Top(obj.msg);
            }
        })
        .fail(function(xhr, err) {
            NameU_Fail(xhr, err);
        })
        .always(function() {
            NameU_LoadingPage_Hide();
        }); 
    
    NameU_Tredir("#vw_order");
    NameU_LoadingPage_Hide(); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_socialu", function(event) {
    menu_app("#sidebar_menu_17");
	moretheme('#area_social_hash');
    social_message_all();
});
$( document ).on( "pagecreate", "#vw_socialu", function(event) {
    $('#click_top_alltheme').click(function(){
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
    
    $('#list_class_card_social_id').delegate("li div div div img.click_add_group", "click", function(){
        gblasocialu["idtheme"] = $(this).attr("data-id");
        loginsetpagedb("#vw_socialu",true);
    });
    
    $('#list_class_card_social_id').delegate(".click_alltheme", "click", function(){
        gblasocialu["idtheme"] = $(this).attr("data-id");
        gettheme();
    });
});

function social_message_all(){
    $("#list_class_card_social_id").empty();
    NameU_LoadingPage_Show();
    
    var furlt = url + "/alltheme";
    if(gblaheaders.Authorization.length > 0){
        furlt = url + "/allthemeon";
    }
    
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: furlt,
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.alltheme, function(k,v){
					var linha = obj.alltheme[k];
                    var varcheckmy = true;
                    var connect_add = '';
                    
                    if (linha.USERS[2] > 0){
                        var data_users = linha.USERS[1];
                        $.each(data_users, function(k1,v1){
                            connect_add += '<img class="fotos user_control_images" src="img/side-connect.png" width="28px" height="28px">';
                            if (data_users[k1].TYPE == 1){
                                 varcheckmy = false;
                            }
                        }); 
                        if (varcheckmy == true){
                            connect_add += '<img class="fotos user_control_images click_add_group" src="img/plus_user.png" width="28px" height="28px"  data-id="' + linha.idtenant_social_group + '">';
                        }
                    }
                    
                    items.push( '<li>' +
                                '	<div class="control_card">' +
                                '		<div class="connect_card">' +
                                '			<img class="fotos img_user_social click_alltheme" data-id="' + linha.idtenant_social_group + '" src="img/side-connect.png" width="33px" height="33px"> ' +
                                '			<div class="click_alltheme" data-id="' + linha.idtenant_social_group + '">' +
                                '				<div class="NemeU-name-hash">' + linha.group_hashtag + '</div>' +
                                '				<span class="NameU-social-date">' + NameU_DateTime_BR(linha.dtcreate) + '</span>' +
                                '				<span class="NameU-social-followers">' + linha.ALLUSER + ' Seguindo &#9825;</span>' +
                                '				<br>' +
                                '				<p class="p_card">' + linha.MESSAGE + '</p>' +
                                '				<img src="img/up_class.png" class="img_card" width="60%">' +
                                '				<p class="p_comment">' + linha.COMMENT + '</p>' +
                                '			</div>' +
                                '			<div class="user_control">' +
                                '				' + connect_add +
                                '			</div>' +
                                '		</div>' +
                                '	</div>' +
								'</li>');
                    
				});
				 var list = items.join(' ');
                $('#list_class_card_social_id').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function saveusertheme(){
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/saveusertheme/" + gblasocialu["idtheme"],
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				social_message_all();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_socialu_msg", function(event) {
    menu_app("#sidebar_menu_18");
	moretheme('#moretheme_social_msg');
});
$( document ).on( "pagecreate", "#vw_socialu_msg", function(event) { 
    $('#ul_dados_theme').delegate("li div div.click_theme_msg", "click", function(){
		gblasocialu["idmessage"] = $(this).attr("data-id");
		var items = [];
		items.push( '<li>' +
					'	<div class="control_card">' +
					'		<img class="img_comment" src="img/side-connect.png" width="33px" height="33px"> ' +
					'		<div class="connect_card"><a href="#vw_social_item">' + $(this).attr("data-hash") + '</a></div>' +
					'		<p class="p_card_box">' + $(this).attr("data-msg") + '<br>' +
					'	</div>' +
					'</li>');
		 var list = items.join(' ');
		$('#ul_dados_theme_comment').empty().append(list).listview().listview('refresh');
		commentmsg();
    });
});

function gettheme(){
    $("#ul_dados_theme").empty();
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/gettheme/" + gblasocialu["idtheme"],
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				var linha = obj.gettheme;
				var theme_msg = '';
				if (linha.MESSAGE[2] > 0){
					var data_users = linha.MESSAGE[1];
					$.each(data_users, function(k1,v1){
						linha_msg = data_users[k1];
						if (k1 != 0){
							theme_msg += '<hr>';
						}
						theme_msg += '<div class="click_theme_msg" data-id="' + linha_msg.idtenant_social_group_msg + '" data-msg="' + linha_msg.msg_description + '" data-hash="' + linha.group_hashtag + '">' +
									'	<p class="p_card_box">' + linha_msg.msg_description + '</p>' +
									'	<div class="p_card_date">' + NameU_DateTime_BR(linha_msg.dtcreate) + '</div>' +
									'	<div class="p_card_comment">' + linha_msg.COUNTCOMMENT + ' COMENTÁRIO(S)</div>' +
									'</div>';
					}); 
				}
				items.push( '<li>' +
							'	<div class="control_card">' +
							'		<img class="img_comment" src="img/side-connect.png" width="33px" height="33px">' +
							'		<div class="connect_card">' +
							'			<a href="#vw_social_item">' +
							'				<span>' + linha.group_hashtag + '</span>' +
							'				<span></span>' +
							'				<span class="dt_card_box">' +  
							'					<p>' + linha.ALLUSER + ' Seguindo &#9825;</p>' +
							'					<p>' + NameU_DateTime_BR(linha.dtcreate) + '</p>' +
							'				</span>' +
							'			</a>' +
							'		</div>' +
							'		<br>' +
							'		' + theme_msg +
							'	</div>' +
							'</li>');
				 var list = items.join(' ');
                $('#ul_dados_theme').append(list).listview().listview('refresh');
				NameU_Tredir("#vw_socialu_msg");
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_socialu_comment", function(event) { });
$( document ).on( "pagecreate", "#vw_socialu_comment", function(event) {
    $('#btn_enviar_comment').click(function(){
        loginsetpagedb("#vw_socialu_comment",true);
    });
});

function commentmsg(){
    $("#ul_comment").empty();
	$("#textarea_message_comment").val("");
    NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "POST",
		url: url + "/commentmsg/" + gblasocialu["idtheme"],
		data: {idtenant_social_group_msg:gblasocialu["idmessage"]},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.commentmsg, function(k,v){
					var linha = obj.commentmsg[k];
					items.push( '<li>' +
								'	<div class="control_card">' +
								'		<img class="img_comment" src="img/side-connect.png" width="25px" height="25px">' +
								'		<div class="connect_card">' +
								'			<a href="#vw_social_item">' +
								'				' + linha.tenantuser_nickname + '' +
								'				<span></span>' +
								'				<span class="dt_card_box"><p>' + NameU_DateTime_BR(linha.dtcreate) + '</p></span>' +
								'			</a>' +
								'		</div>' +
								'		<p class="p_card_box">' + linha.comment_description + '</p>' +
								'	</div>' +
								'</li>' +
								'<li>');
				});
				var list = items.join(' ');
                $('#ul_comment').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) {
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_Tredir("#vw_socialu_comment");
		NameU_LoadingPage_Hide();
	}); 
}
function addcomment(){
	if(gblasocialu["idtheme"] > 0){
		if(gblasocialu["idmessage"] > 0){
			if($("#textarea_message_comment").val().length > 0){
				NameU_LoadingPage_Show();
				$.ajax({ 
					headers: gblaheaders,
					type: "POST",
					url: url + "/addcomment",
					data: {idtenant_social_group:gblasocialu["idtheme"],idtenant_social_group_msg: gblasocialu["idmessage"],comment_description:$("#textarea_message_comment").val()},
					cache: false
				})
				.done(function(data) {
					var obj = data;
					if (obj.error == 0){
						if (obj.retorno > 0){
							$("#textarea_message_comment").val("");
							commentmsg();
						}else{
							NameU_Interacao_Top(obj.msg);
						}
					}else{
						NameU_Interacao_Top(obj.msg);
					}
				})
				.fail(function(xhr, err) {
					NameU_Fail(xhr, err);
				})
				.always(function() {
					NameU_LoadingPage_Hide();
				}); 
			}
		}else{
			NameU_Interacao_Top("Selecione uma mensagem");
		}
	}else{
		NameU_Interacao_Top("Selecione uma Hash");
	}
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_socialu_new_message", function(event) { });
$( document ).on( "pagecreate", "#vw_socialu_new_message", function(event) { });

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_help_desk", function(event) {
	menu_app("#sidebar_menu_22");
    list_helpdesk();
});

$( document ).on( "pagecreate", "#vw_help_desk", function(event) {
    $('#list_control_help_desk_select').delegate("li.control_item_help_desk", "click", function(){
        glbidhelpdesk = $(this).attr("data-id");
        NameU_Tredir_Up("#vw_help_desk_message");
	});
});

function list_helpdesk(){
    $('#list_control_help_desk_select').empty();
	NameU_LoadingPage_Show();
	var furl = url + "/helpuser";
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: furl,
		data: {},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.helpuser, function(k,v){
                    var linha = obj.helpuser[k];
					items.push('<li class="control_item_help_desk" data-id="' + linha.idtenant_help_nameu + '">'+
                                '    <h4><strong>Protocolo:</strong> ' + linha.PROTOCOL + '<br><strong class="toogle_type_' + linha.fltype + '">' + linha.descfltype + '</strong><br><small>' + linha.affiliates_name + '</small></h4>'+
                                '    <p><strong>' + linha.deschelp_type + '</strong></p>' +
                                '    <p>' + linha.help_message + '</p>'+
                                '    <span>' + NameU_DateTime_BR(linha.dtcreate) + '</span>'+
                                '</li>');
				});
				var list = items.join(' ');
				$('#list_control_help_desk_select').append(list).listview().listview('refresh');
                NameU_LoadingPage_Hide();
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_help_desk_message", function(event) { 
    get_helpdeskmessage();
   
    comment_get = setInterval(function(){ 
       list_comment_message();
    }, 6000);
    
     helpdesk = setInterval(function(){ 
       get_helpdeskmessage();
    }, 100000);
});

$( document ).on( "pagecreate", "#vw_help_desk_message", function(event) { 
    $("#btn_comment_area_text").click(function(){
        add_commentmessage();
    });
});


$( document ).on( "pagehide", "#vw_help_desk_message", function(event){
    clearInterval(comment_get);
    clearInterval(helpdesk);
});

function get_helpdeskmessage(){
    $("#helpdesk_message").empty();
    $("#list_comment_help").empty();
    NameU_LoadingPage_Show();
	var furl = url + "/obthelpuser/" + glbidhelpdesk;
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: furl,
		data: {},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var linha = obj.obthelpuser;
				var items = [];
                items.push('<h4><strong>Protocolo:</strong> ' + linha.PROTOCOL + '<br><strong class="toogle_type_' + linha.fltype + '">' + linha.descfltype + '</strong><br><small>' + linha.affiliates_name + '</small><br><strong>' + linha.deschelp_type + '</strong></h4>' +
                           '<p>' + linha.help_message + '</p>' +
                           '<span>' + NameU_DateTime_BR(linha.dtcreate) + '</span>');
				var list = items.join(' ');
				$('#helpdesk_message').append(list).trigger("create");
                if (linha.fltype == 0 || linha.fltype == 1){
                    $("#footer_helpchat").show();
                }else{
                    $("#footer_helpchat").hide();
                }
                $('#list_comment_help').empty();
                list_comment_message();
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}

function list_comment_message(){
    var furl = url + "/sltcommenthelpuser/" + glbidhelpdesk ;
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: furl,
		data: {},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
				$.each(obj.sltcommenthelpuser, function(k,v){
                    var linha = obj.sltcommenthelpuser[k];
                    var additem = true;
                    $('#list_comment_help').contents().each(function () {
                        if ($(this).attr("data-id") == linha.idtenant_help_nameu_comment){
                            additem = false;
                        }
                    });
                    if (additem){
                        if (linha.comment_type == 1){
                            items.push( '<div class="for_help_desk" data-id="' + linha.idtenant_help_nameu_comment + '">' +
                                        '<strong>' + linha.tenantuser_nickname + '</strong>' +
                                        '<p>' + linha.help_message + '</p>' +
                                        '<span>' + NameU_DateTime_BR(linha.dtcreate) + '</span>' +
                                        '</div>');
                        }else{
                            items.push( '<div class="to_help_desk" data-id="' + linha.idtenant_help_nameu_comment + '">' +
                                        '<strong>' + linha.tenantuser_nickname + '</strong>' +
                                        '<p>' + linha.help_message + '</p>' +
                                        '<span>' + NameU_DateTime_BR(linha.dtcreate) + '</span>' +
                                        '</div>');
                        }
                    }
				});
				var list = items.join(' ');
				$('#list_comment_help').prepend(list).trigger("create");
			}else{
				//NameU_Interacao_Top(obj.msg);
			}
		}else{
			//NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
	}); 
}

function add_commentmessage(){
    if ($("#message_comment").val() != ""){
        NameU_LoadingPage_Show();
        $.ajax({ 
            headers: gblaheaders,
            type: "POST",
            url: url + "/addcommenthelp/" + glbidhelpdesk,
            data: {help_message:$("#message_comment").val()},
            cache: false
        })
        .done(function(data) {
            var obj = data;
            if (obj.error == 0){
                if (obj.retorno > 0){
                    var linha = obj.addcommenthelp;
                    NameU_LoadingPage_Hide();
                    list_comment_message();
                    $("#message_comment").val('');
                }else{
                    NameU_Interacao_Top(obj.msg);
                }
            }else{
                NameU_Interacao_Top(obj.msg);
            }
        })
        .fail(function(xhr, err) { 
            NameU_Fail(xhr, err);
        })
        .always(function() {
            NameU_LoadingPage_Hide();
        });
    }else{
        NameU_Interacao_Top("Digite um comentário!");
    }
}

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_new_help_desk_message", function(event) { 
    $("#get_affiliate_helpdesk").empty();
    $("#text_new_helpdesk").val('');
    if (glbaaffiliate["id"] > 0){
        get_helpstore();
    }else{
        NameU_Interacao_Top("Selecione uma loja!");
        mylocal();
    }
});

$( document ).on( "pagecreate", "#vw_new_help_desk_message", function(event) { 
    $("#btn_new_helpdesk").click(function(){
        add_helpdeskmessage();
    });
});

function add_helpdeskmessage(){
    if ($("#text_new_helpdesk").val() != ""){
        if (glbaaffiliate["id"] > 0){
            NameU_LoadingPage_Show();
            $.ajax({ 
                headers: gblaheaders,
                type: "POST",
                url: url + "/addhelpuser",
                data: {idtenant_affiliates:glbaaffiliate["id"],help_message:$("#text_new_helpdesk").val(),help_type:$("#type_helpdesk").val()},
                cache: false
            })
            .done(function(data) {
                var obj = data;
                if (obj.error == 0){
                    if (obj.retorno > 0){
                        var linha = obj.addcommenthelp;
                        NameU_Interacao_Top(obj.msg);
                        NameU_LoadingPage_Hide();
                        NameU_Tredir("#vw_help_desk");
                    }else{
                        NameU_Interacao_Top(obj.msg);
                    }
                }else{
                    NameU_Interacao_Top(obj.msg);
                }
            })
            .fail(function(xhr, err) { 
                NameU_Fail(xhr, err);
            })
            .always(function() {
                NameU_LoadingPage_Hide();
            });
        }else{
            NameU_Interacao_Top("Selecione uma loja!");
        }
    }else{
       NameU_Interacao_Top("Escreva uma mensagem!"); 
    }
}

function get_helpstore(){
    $("#get_affiliate_helpdesk").empty();
	NameU_LoadingPage_Show();
	$.ajax({ 
		headers: gblaheaders,
		type: "GET",
		url: url + "/getaffiliates/" + glbaaffiliate["id"],
		data: {latitude:glbaadress["latitude"], longitude:glbaadress["longitude"]},
		cache: false
	})
	.done(function(data) {
		var obj = data;
		if (obj.error == 0){
			if (obj.retorno > 0){
				var items = [];
					var linha = obj.getaffiliates;
					var dataadr = obj.getaffiliates["ADDRESS"];
					var dataphn = obj.getaffiliates["PHONE"];
					var dataweb = obj.getaffiliates["WEB"];
					var htmladdress = "";
					var htmlphone = "";
					var htmlweb = "";
						// ADDRESS
						if(dataadr[2] > 0){
							$.each(dataadr[1], function(ka,va){
								// idtenant_affiliates_address
								var linhaaddress = dataadr[1][ka];
								var aref_number = linhaaddress.ref_number.length > 0 ? ', ' + linhaaddress.ref_number: '';
								var acomplement = linhaaddress.complement.length > 0 ? ' - ' + linhaaddress.complement: '';
								var acity = linhaaddress.city.length > 0 ? linhaaddress.city : '';
								var adistrict = linhaaddress.district.length > 0 ? '<br>' + linhaaddress.district + (linhaaddress.city.length > 0 ? ' - ' + linhaaddress.city: ''): '<br>' + acity;
								var acountry = linhaaddress.country.length > 0 ? linhaaddress.country: '';
								var astates = linhaaddress.states.length > 0 ? linhaaddress.states + (linhaaddress.country.length > 0 ? ' - ' + linhaaddress.country: ''): acountry;
								var azip_code = linhaaddress.zip_code.length > 0 ? '<br>' + linhaaddress.zip_code + (astates.length > 0 ? ' - ' + astates: ''): (astates.length > 0 ? '<br>' + astates: '');
								htmladdress += '<br>' + linhaaddress.address + aref_number + acomplement + adistrict + azip_code;
							});
						}
						// PHONE
						if(dataphn[2] > 0){
							$.each(dataphn[1], function(kp,vp){
								// idtenant_affiliates_phone
								var linhaphone = dataphn[1][kp];
								var pprefixcode = linhaphone.prefixcode.length > 0 ? '(' + linhaphone.prefixcode + ') ': '';
								var pareacode = linhaphone.areacode.length > 0 ? '(' + linhaphone.areacode + ') ': '';
								var pcodephone = linhaphone.codephone.length > 0 ? ' Ramal: ' + linhaphone.codephone: '';
								htmlphone += '<br>Tel.: ' + pprefixcode + pareacode + linhaphone.telephone + pcodephone;
							});
						}
						// WEB
						if(dataweb[2] > 0){
							$.each(dataweb[1], function(kp,vp){
								// idtenant_affiliates_web
								var linhaweb = dataweb[1][kp];
								htmlweb += '<br>' + linhaweb.uri;
							});
						}
					// companyname, ISDISTANCE, DISTANCE
					items.push('<li data-id="' + linha.idtenant_affiliates + '">' +
                                '   <a  href="#" onclick="mylocal()" >Alterar Loja</a>' +
                                '   <br>' +
								'	<strong>' + linha.companyfantasy + ' - ' + linha.affiliates_name + '</strong><br>' +
								'	<div class="NameU-dados-aff">' + htmladdress + htmlphone + htmlweb + '</div>' +
								'</li>');
				
				var list = items.join(' ');
				$('#get_affiliate_helpdesk').append(list).listview().listview('refresh');
				NameU_LoadingPage_Hide();
			}else{
				NameU_Interacao_Top(obj.msg);
			}
		}else{
			NameU_Interacao_Top(obj.msg);
		}
	})
	.fail(function(xhr, err) { 
		NameU_Fail(xhr, err);
	})
	.always(function() {
		NameU_LoadingPage_Hide();
	}); 
}
// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_terms_privacy", function(event) { });
$( document ).on( "pagecreate", "#vw_terms_privacy", function(event) { });

// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
$( document ).on( "pageshow", "#vw_affiliate_detail", function(event) {
    menu_app("#sidebar_menu_23");
});
$( document ).on( "pagecreate", "#vw_affiliate_detail", function(event) { });
// ///////////////////////////////////////////////// ******** /////////////////////////////////////////////////
function updateCardBrand(cardBin) {
	if(hasSessionId){
		PagSeguroDirectPayment.getBrand({
			cardBin: cardBin,
			success: function(response) {
			    var brand = response.brand.name;
				$("#cardBrand").attr('brand', brand);
				$("#creditCardBrand").val(brand);
                gblacard.cdbrand = brand;
				updateInstallments(brand);
			},
			error: function(response) {
			 	NameU_LoadingPage_Hide();
			},
			complete: function(response) {
				NameU_LoadingPage_Hide();
			}
		});
	}
	
}
	


// Atualiza dados de parcelamento atráves da bandeira do cartão
var updateInstallments = function(brand) {
		var amount = glbaaffiliate["allcart"] + glbashipping["price"];
		PagSeguroDirectPayment.getInstallments({
			amount: amount,
			brand:  brand,
			success: function(response) {
				
				// Para obter o array de parcelamento use a bandeira como "chave" da lista "installments"
				var installments = response.installments[brand];
				
				var options = '';
				for (var i in installments) {
					
					var optionItem     = installments[i];
					var optionQuantity = optionItem.quantity; // Obtendo a quantidade
					var optionAmount   = optionItem.installmentAmount; // Obtendo o valor
					var optionLabel    = (optionQuantity + "x " + NameU_formatMoney(optionAmount)); // montando o label do option
					var price          = Number(optionAmount).toMoney(2,'.',',');
					
					options += ('<option value="' + optionItem.quantity + '" dataPrice="'+price+'">'+ optionLabel +'</option>');
					
				};
				
				// Atualizando dados do select de parcelamento
				$("#installmentQuantity").html(options);
				
				// Exibindo select do parcelamento
				$("#installmentsWrapper").show();
				
				// Utilizando evento "change" como gatilho para atualizar o valor do parcelamento
				$("#installmentQuantity").trigger('change');
				
			},
			error: function(response) {
				NameU_LoadingPage_Hide();
			},
			complete: function(response) {
				NameU_LoadingPage_Hide();
			}
		});
		
	};
	

function updateCardToken() {
    gblacard.cdToken = "";
	if(hasSessionId){
        gblacard.cdCard = $("#cardNumber").val();
		PagSeguroDirectPayment.createCardToken({
			cardNumber: gblacard.cdCard,
			brand: gblacard.cdbrand,
			cvv: $("#cardCvv").val(),
			expirationMonth: $("#cardExpirationMonth").val(),
			expirationYear: $("#cardExpirationYear").val(),
			success: function(response) {
				var token = response.card.token;
                gblacard.cdToken = token;
                execdopay();
			},
			error: function(response) {
                NameU_Interacao_Top(JSON.stringify(response.errors));
			},
			complete: function(response) {
				NameU_LoadingPage_Hide();
			}
		});
	}
};