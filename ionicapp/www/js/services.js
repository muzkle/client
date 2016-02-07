angular.module('starter.services', [])

.factory('ProductService', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var products = [{
        id: 0,
        name: 'Camisa',
        lastText: 'Camisa branca sem textura',
        img: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
        id: 1,
        name: 'Blusa',
        lastText: 'Blusa azul sem capuz',
        img: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
        id: 2,
        name: 'Camisa',
        lastText: 'Camisa social listrada',
        img: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 3,
        name: 'Terno',
        lastText: 'Terno azul',
        img: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 4,
        name: 'Calça',
        lastText: 'Calça de camursa',
        img: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }];

    return {
        all: function () {
            return products;
        },
        remove: function (product) {
            products.splice(products.indexOf(product), 1);
        },
        get: function (productId) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].id === parseInt(productId)) {
                    return products[i];
                }
            }
            return null;
        }
    };
});
