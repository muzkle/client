var db;
var dbCreated   = false;
var gblaheaders	= {Authorization:"" ,device: ""};
var gblauserdb	= {flstate:false,nickname:"",email:"",fltype:"",flvalid:""};
var gblaondb	= {idaddress:0};
var gblpage		= "#vw_home";
var gblgeo;

var gbl_device  = {cordova:"",model:"",platform:"",version:"",isvirtual:"",serial:"",regid:""};
	
function onDeviceReady() {
    
    db = window.openDatabase("DBNAMEUBUW", "1.0", "DBNAMEUBUW", 200000);
    if (dbCreated){
    	verificardb();
    }else{
    	db.transaction(populateDB, transaction_error, populateDB_success);
	}
    
    var deviceID = device.uuid;
    gblaheaders.device = deviceID;
    
    gbl_device.cordova = device.cordova;
    gbl_device.model = device.model;
    gbl_device.platform = device.platform;
    gbl_device.version = device.version;
    gbl_device.isvirtual = device.isVirtual;
    gbl_device.serial = device.serial;
    
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {timeout: 10000, enableHighAccuracy: true});
    

	var pushregid = PushNotification.init({ "android": {"senderID": "36266926733"},
		 "ios": {"alert": "true", "badge": "true", "sound": "true"}} );

	pushregid.on('registration', function(data) {
		gbl_device.regid = data.registrationId;
		adddevice();
	});

	pushregid.on('notification', function(data) {// data.message, data.title, data.count, data.sound, data.image, data.additionalData
		var isimg = data.additionalData.picture.length > 0 ? '<br><img src="' + data.additionalData.picture + '" width="90%">' : '';
		NameU_Interacao_Top_Time(data.title + '<br>' + data.message + isimg, 10000);
	});

	pushregid.on('error', function(e) {// e.message
		NameU_Interacao_Top(e.message);
	});
    adddevice();
}

function populateDB_success() {
	dbCreated = true;
    verificardb();
}

function transaction_error(tx, error) {
    NameU_Interacao($("#toogle_return") , "Erro no DATABASE");
}

function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS TBUSERNAMEU (idtenantuser INTEGER PRIMARY KEY AUTOINCREMENT' +
				', tksession VARCHAR(250), nickname VARCHAR(250), email VARCHAR(40), fltype INT(11), flvalid INT(11))');
}

function acessardb(ptksession,pnickname,pemail,pfltype,pflvalid) {
    db.transaction(function(tx){
		var sql = "SELECT * FROM TBUSERNAMEU WHERE tksession = '" + ptksession + "'";
		tx.executeSql(sql, [], function (tx, results) {
			if (results.rows.length == 0) {
				cadastrardb(ptksession,pnickname,pemail,pfltype,pflvalid);
			}else if (results.rows.length == 1){
				for(var i = 0; i < results.rows.length; i++) {
					vtksession = results.rows.item(i).tksession;
					conenctardb(vtksession,pnickname,pemail,pfltype,pflvalid);
				}
			}else{
				descconenctardb();
			}
		});
    }, transaction_error);
}

function loginsetpagedb(ppage,isfunction) {
	gblpage = ppage;
    conectadodb("login",isfunction);
};

function conectadodb(plocal,isfunction) {
	if (isfunction == null && isfunction === undefined) {
		isfunction = false;
    }
    db.transaction(function(tx){
		var sql = "SELECT * FROM TBUSERNAMEU";
		tx.executeSql(sql, [], function(tx, results) {
			if (results.rows.length == 1) {
				for(var i = 0; i < results.rows.length; i++) {
					gblaheaders["Authorization"] = results.rows.item(i).tksession;
					gblauserdb["flstate"] = true;
					gblauserdb["nickname"] = results.rows.item(i).nickname;
					gblauserdb["email"] = results.rows.item(i).email;
					gblauserdb["fltype"] = results.rows.item(i).fltype;
					gblauserdb["flvalid"] = results.rows.item(i).flvalid;
				}
				if(plocal == "login"){
					if(isfunction){
						if(gblpage == "#vw_socialu"){
							saveusertheme();
						}else if(gblpage == "#vw_socialu_comment"){
							addcomment();
						}else{
							NameU_Tredir(gblpage);
						}	
					}else{
						NameU_Tredir(gblpage);
					}
				}else if(plocal == "logado"){
					NameU_Tredir("#vw_home");
				}else if(plocal == "checklogin"){
					NameU_Tredir("#vw_home");
				}else if(plocal == "checkhome"){
					menu_app("#sidebar_menu_1");
				}else if(plocal == "flvalid"){
					inti_profilr();
				}
			}else{
				if(plocal == "login"){
					NameU_Tredir("#vw_connect");
				}else if(plocal == "logado"){
					NameU_Tredir("#vw_connect");
				}else if(plocal == "logoff"){
					NameU_Tredir("#vw_home");
				}else if(plocal == "checkprofile"){
					NameU_Tredir("#vw_connect");
                }else if(plocal == "checkhome"){
					menu_app("#sidebar_menu_1");
				}
				gblaheaders["Authorization"] = "";
				gblauserdb	= {flstate:false,nickname:"",email:"",fltype:"",flvalid:""};
				gblaondb	= {idaddress:0}
			}
		});
    }, transaction_error);
}

function verificardb() {
    db.transaction(function(tx){
		var sql = "SELECT * FROM TBUSERNAMEU";
		tx.executeSql(sql, [], function(tx, results) {
			if (results.rows.length == 1) {
				for(var i = 0; i < results.rows.length; i++) {
					gblaheaders["Authorization"] = results.rows.item(i).tksession;
					gblauserdb["flstate"] = true;
					gblauserdb["nickname"] = results.rows.item(i).nickname;
					gblauserdb["email"] = results.rows.item(i).email;
					gblauserdb["fltype"] = results.rows.item(i).fltype;
					gblauserdb["flvalid"] = results.rows.item(i).flvalid;
				}
			}else{
				gblaheaders["Authorization"] = "";
				gblauserdb	= {flstate:false,nickname:"",email:"",fltype:"",flvalid:""};
				gblaondb	= {idaddress:0}
			}
			menu_app("#sidebar_menu_1");
		});
    }, transaction_error);
}

function cadastrardb(ptksession,pnickname,pemail,pfltype,pflvalid){
    db.transaction(function(tx){
        tx.executeSql("INSERT INTO TBUSERNAMEU (tksession, nickname, email, fltype, flvalid) VALUES ('" + ptksession + "','" + pnickname + "','" + pemail + "','" + pfltype + "','" + pflvalid + "')");
		conectadodb("login");
    }, transaction_error);
}

function conenctardb(ptksession,pnickname,pemail,pfltype,pflvalid){
    db.transaction(function(tx){
        tx.executeSql("UPDATE TBUSERNAMEU SET nickname = '" + pnickname + "', email = '" + pemail + "', fltype = '" + pfltype + "', flvalid = '" + pflvalid + "' WHERE tksession = '" + ptksession + "'");
		conectadodb("");
    }, transaction_error);
}

function updflvaliddb(ptksession,pflvalid){
    db.transaction(function(tx){
        tx.executeSql("UPDATE TBUSERNAMEU SET flvalid = '" + pflvalid + "' WHERE tksession = '" + ptksession + "'");
		conectadodb("flvalid");
    }, transaction_error);
}

function descconenctardb(){
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM TBUSERNAMEU");
    }, transaction_error);
}

function sairdb(){
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM TBUSERNAMEU");
		conectadodb("logoff");
    }, transaction_error);
}
//GEO
var onGeoSuccess = function(position) {
        gblgeo = position;
        glbageo.latitude  =  position.coords.latitude;
        glbageo.longitude =  position.coords.longitude;
};

function onGeoError(error) {
    NameU_Interacao_Top("Por favor ative sua localização para que possamos encontrar as lojas para você!");
}