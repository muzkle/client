angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('HomeCtrl', function ($scope) {
    
})

.controller('CircularMenuCtrl', function ($scope) {

    $scope.options = {
        isOpen: false,
        toggleOnClick: true,
        background: 'white',
        color: 'black',
        size: 'big',
        button: {
            content: '',
            cssClass: 'fa NameU_Logo',
            size: 'big'
        },
        items: [
            {
                cssClass: 'icon ion-person-stalker',
                isActive: true,
                onclick: function (options, clicked) {
                    clicked.isActive = true;
                    alert("teste")
                }
            }, {
                cssClass: 'icon ion-bag',
                onclick: $scope.switchType
            }, {
                cssClass: 'icon ion-ios-heart',
                onclick: $scope.switchType
            },
            {
                cssClass: 'icon ion-network',
                isActive: true,
                onclick: $scope.switchType
            }, {
                cssClass: 'icon ion-search',
                onclick: $scope.switchType
            }
        ]
    };
})

.controller('CategoriesCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Acessórios', id: 1 },
      { title: 'Calça e Saia', id: 2 },
      { title: 'Top e Blusa', id: 3 },
      { title: 'Vestido', id: 4 }
    ];
})

.controller('CategoryCtrl', function ($scope, $stateParams) {
})

.controller('SearchCtrl', function ($scope) {

})

.controller('StoreAddressesCtrl', function ($scope) {

})

.controller('VitrineCtrl', function ($scope) {

})

.controller('ProductsCtrl', function ($scope, ProductService) {
    $scope.products = ProductService.all();
})

.controller('ProductCtrl', function ($scope, ProductService) {
    this.products = ProductService.all();
})

.controller('CartCtrl', function ($scope) {

})

.controller('CheckoutCtrl', function ($scope) {

})

.controller('PaymentCtrl', function ($scope) {

})

.controller('BookmarksCtrl', function ($scope) {

})

.controller('RegisterCtrl', function ($scope) {

})

.controller('MyAccountCtrl', function ($scope) {

})

.controller('PushCtrl', function ($scope) {

})

.controller('OrdersCtrl', function ($scope) {

})

.controller('OrderCtrl', function ($scope) {

})

.controller('SocialCtrl', function ($scope) {

})

.controller('MessagesCtrl', function ($scope) {

})

.controller('MessageCtrl', function ($scope) {

})

.controller('CommentsCtrl', function ($scope) {

})
.controller('ConditionsCtrl', function ($scope) {

})

.controller('HelpDeskCtrl', function ($scope) {

})

.controller('HelpDeskMessagesCtrl', function ($scope) {

})

.controller('HelpDeskMessageCtrl', function ($scope) {

})

.controller('AffiliateCtrl', function ($scope) {

})

.controller('ToogleDetailsCtrl', function ($scope) {

})