// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.categorias', {
        url: '/categorias',
        views: {
            'menuContent': {
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesCtrl'
            }
        }
    })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html',
                controller: 'SearchCtrl'
            }
        }
    })

    .state('app.store-addresses', {
        url: '/store-addresses',
        views: {
            'menuContent': {
                templateUrl: 'templates/store-addresses.html',
                controller: 'StoreAddressesCtrl'
            }
        }
    })

    .state('app.vitrine', {
        url: '/vitrine',
        views: {
            'menuContent': {
                templateUrl: 'templates/vitrine.html',
                controller: 'VitrineCtrl'
            }
        }
    })

    .state('app.produts', {
        url: '/produts',
        views: {
            'menuContent': {
                templateUrl: 'templates/produts.html',
                controller: 'ProductsCtrl'
            }
        }
    })

    .state('app.product', {
        url: '/product/:productId',
        views: {
            'menuContent': {
                templateUrl: 'templates/product.html',
                controller: 'ProductCtrl'
            }
        }
    })

    .state('app.cart', {
        url: '/cart',
        views: {
            'menuContent': {
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
            }
        }
    })

    .state('app.checkout', {
        url: '/checkout',
        views: {
            'menuContent': {
                templateUrl: 'templates/checkout.html',
                controller: 'CheckoutCtrl'
            }
        }
    })

    .state('app.payment', {
        url: '/payment',
        views: {
            'menuContent': {
                templateUrl: 'templates/payment.html',
                controller: 'PaymentCtrl'
            }
        }
    })

    .state('app.bookmarks', {
        url: '/bookmarks',
        views: {
            'menuContent': {
                templateUrl: 'templates/bookmarks.html',
                controller: 'BookmarksCtrl'
            }
        }
    })

    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            }
        }
    })

    .state('app.my-account', {
        url: '/my-account',
        views: {
            'menuContent': {
                templateUrl: 'templates/my-account.html',
                controller: 'MyAccountCtrl'
            }
        }
    })

    .state('app.push', {
        url: '/push',
        views: {
            'menuContent': {
                templateUrl: 'templates/push.html',
                controller: 'PushCtrl'
            }
        }
    })

    .state('app.orders', {
        url: '/orders',
        views: {
            'menuContent': {
                templateUrl: 'templates/orders.html',
                controller: 'OrdersCtrl'
            }
        }
    })

    .state('app.order', {
        url: '/order/:orderId',
        views: {
            'menuContent': {
                templateUrl: 'templates/order.html',
                controller: 'OrderCtrl'
            }
        }
    })

    .state('app.social', {
        url: '/social',
        views: {
            'menuContent': {
                templateUrl: 'templates/social.html',
                controller: 'SocialCtrl'
            }
        }
    })

    .state('app.messages', {
        url: '/messages',
        views: {
            'menuContent': {
                templateUrl: 'templates/messages.html',
                controller: 'MessagesCtrl'
            }
        }
    })

    .state('app.message', {
        url: '/message',
        views: {
            'menuContent': {
                templateUrl: 'templates/message.html',
                controller: 'MessageCtrl'
            }
        }
    })

    .state('app.comments', {
        url: '/comments',
        views: {
            'menuContent': {
                templateUrl: 'templates/comments.html',
                controller: 'CommentsCtrl'
            }
        }
    })

    .state('app.conditions', {
        url: '/conditions',
        views: {
            'menuContent': {
                templateUrl: 'templates/conditions.html',
                controller: 'ConditionsCtrl'
            }
        }
    })

    .state('app.help-desk', {
        url: '/help-desk',
        views: {
            'menuContent': {
                templateUrl: 'templates/help-desk.html',
                controller: 'HelpDeskCtrl'
            }
        }
    })

    .state('app.help-desk-messages', {
        url: '/help-desk-messages',
        views: {
            'menuContent': {
                templateUrl: 'templates/help-desk-messages.html',
                controller: 'HelpDeskMessageCtrl'
            }
        }
    })

    .state('app.help-desk-message', {
        url: '/help-desk-message',
        views: {
            'menuContent': {
                templateUrl: 'templates/help-desk-message.html',
                controller: 'HelpDeskMessageCtrl'
            }
        }
    })

    .state('app.affiliate', {
        url: '/affiliate',
        views: {
            'menuContent': {
                templateUrl: 'templates/affiliate.html',
                controller: 'AffiliateCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
