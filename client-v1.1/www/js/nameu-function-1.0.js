function NameU_check_Images() {
  $("img").each(function() {
    $(this).error(function() {
      $(this).attr("src", "img/padrao.jpg");
        
    });
  });
};

function toogle_return(){
    $("#toogle_return").hide();
    
    $("#toogle_return").click(function(){
        $(this).hide();
    });
    
}

function NameU_formatMoney(valor) {
    var valorAsNumber = Number(valor);
    return valorAsNumber.toMoney(2,',','.');
}

	Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep) {
		var n = this,
		c = isNaN(decimals) ? 2 : Math.abs(decimals),
		d = decimal_sep || '.', 
		t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		sign = (n < 0) ? '-' : '',
		i = parseInt(n = Math.abs(n).toFixed(c)) + '', 
		j = ((j = i.length) > 3) ? j % 3 : 0; 
		return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
	};


function NameU_MenuCircle(param){
    if($("#menu_center_" + param).attr('data-situation') == 0){
        $(".icons_" + param).show(10);
		$("#menu_center_" + param).attr('data-situation', 1);
    }else{
        $(".icons_" + param).hide(10);
		$("#menu_center_" + param).attr('data-situation', 0);
    }
}

function NameU_MenuCircle_Hide(param){
	$("#menu_center_" + param).attr('data-situation', 1);
    NameU_MenuCircle(param);
}

function NameU_Interacao_Top(mensagem){
    var obj = $("#toogle_return");
	var ret = "";
	ret = '<div><p>' + mensagem + '</p></div>';
	obj.show();
	obj.empty().append(ret);
	obj.fadeTo('fast',1).delay(2000).fadeTo("slow", 0, function() {
		obj.hide();
	});
}

function NameU_Interacao_Top_Time(mensagem, timevalue){
    var obj = $("#toogle_return");
	var ret = "";
	ret = '<div><p>' + mensagem + '</p></div>';
	obj.show();
	obj.empty().append(ret);
	obj.fadeTo('fast',1).delay(timevalue).fadeTo("slow", 0, function() {
		obj.hide();
	});
}

function NameU_Interacao(obj, mensagem){
	var ret = "";
	ret = '<div><p>' + mensagem + '</p></div>';
	obj.show();
	obj.empty().append(ret);
	obj.fadeTo('fast',1).delay(2000).fadeTo("slow", 0, function() {
		obj.hide();
	});
}

function NameU_Fail(xhr, err){
	if (xhr.status == 401) {
		var ret = $.parseJSON( xhr.responseText );
		NameU_Interacao_Top(ret.msg);
        sairdb();
	}else{
		var responseTitle= $(xhr.responseText).filter('title').get(0);
		var errormensagem = $(responseTitle).text() + "\n" + NameU_FailMessage(xhr, err);
		NameU_LoadingPage_Hide();
		NameU_Interacao_Top(errormensagem);
	}
}

function NameU_FailMessage(jqXHR, exception) {
    if (jqXHR.status === 0) {
        return ('Problema com a internet.');
    } else if (jqXHR.status == 404) {
        return ('Ocorreu um erro no aplicativo.');
    } else if (jqXHR.status == 500) {
        return ('Tente novamente mais tarde!');
    } else if (exception === 'parsererror') {
        return ('Dados incorretos. Tente novamente mais tarde!');
    } else if (exception === 'timeout') {
        return ('Tempo esgotado!');
    } else if (exception === 'abort') {
        return ('Operação foi cancelada.');
    } else {
       return ('Erro desconhecido.' + jqXHR.responseText);
    }
}

function NameU_pontue(nv, c, d, t){
    var n = nv, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function NameU_LoadingPage_Show(){
	$.mobile.loading( 'show', {
		text: 'Aguarde...',
		textVisible: false,
		theme: 'a',
		html: ""
	});
}

function NameU_DateTime_BR(data){
	var rdata = '';
	if (data != ''){
		var t = data.split(/[- .:]/);
		rdata = t[2] + '/' + t[1] + '/' + t[0] + ' às ' + t[3] + ':' + t[4];
	}
	return rdata;
}

function NameU_LoadingPage_Hide(){
	$.mobile.loading( 'hide' );
}

function NameU_Tredir(nextPage){
   $.mobile.navigate(nextPage, { transition : "slide", info: ""});
}

function NameU_Tredir_Up(nextPage){
	$.mobile.navigate(nextPage, { transition : "slideup", info: ""});
}

function NameU_Tredir_Down(nextPage){
	$.mobile.navigate(nextPage, { transition : "slidedown", info: ""});
}

function NameU_Tredir_Time(varpage) {
	setTimeout(function(){tredir(varpage)}, 4000);
}
function NameU_Back() {

	if(getBackPage == 'vw_wizard')
		NameU_Tredir('#vw_home');
	else
		parent.history.back();
}

function NameU_Random(){
    return Math.floor((Math.random() * 500) + 1);
}

function NameU_Json_Concat(o1, o2) {
	for (var key in o2) {
		o1[key] = o2[key];
	}
	return o1;
}

function NameU_NumberChar(string) {
	var er = /\^|~|\?|,|\ |\*|\.|\-/g;
	string = string.replace(er, "");
	return string;
}