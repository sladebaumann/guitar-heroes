'use strict';

angular.module('creator').controller('CreatorController',
    ['$scope',
     '$http',
     '$location',
     '$stateParams',
     'Authentication',
     function ($scope, $http, $location, $stateParams, Authentication) {
         $scope.saveGuitar = function () {
             if (!$scope.active.name) {
                 $scope.save.errorMessage = 'You have to name your guitar before saving.';
                 $scope.save.error = true;
                 return;
             }

             if (!Authentication.user) {
                 $scope.save.errorMessage = 'You need to be logged in to save a guitar.';
                 $scope.save.error = true;
                 return;
             }

             function saveSuccess() {
                 $scope.save.success = true;
             }

             var saveObject = {
                 name: $scope.active.name,
                 head: $scope.active.head._id,
                 neck: $scope.active.neck._id,
                 body: $scope.active.body._id,
                 creator: $scope.user._id
             };

             if ($scope.existingGuitar) {
                 $http.put('/guitars/' + $stateParams.guitarId,
                     saveObject).
                     success(saveSuccess).
                     error(saveError);
             } else {
                 $http.post('/guitars',
                     saveObject).
                     success(saveSuccess).
                     error(saveError);
             }
         };

         $scope.orderGuitar = function () {
         };

         $scope.select = function (part) {
             if ($scope.parts.heads.indexOf(part) !== -1) {
                 $scope.setHead(part);
             }
             if ($scope.parts.necks.indexOf(part) !== -1) {
                 $scope.setNeck(part);
             }
             if ($scope.parts.bodies.indexOf(part) !== -1) {
                 $scope.setBody(part);
             }
         };

         $scope.setTab = function (tab) {
             window.localStorage.setItem('tab', tab);
             $scope.active.tab = tab;
         };
         $scope.setName = function (name) {
             if (name) {
                 window.localStorage.setItem('name', name);
                 $scope.active.name = name;
             }
         };
         $scope.setBrand = function (brand) {
             window.localStorage.setItem('brand', brand);
             $scope.active.brand = brand;
         };
         $scope.setHead = function (head) {
             window.localStorage.setItem('head', JSON.stringify(head));
             $scope.active.head = head;
         };
         $scope.setNeck = function (neck) {
             window.localStorage.setItem('neck', JSON.stringify(neck));
             $scope.active.neck = neck;
         };
         $scope.setBody = function (body) {
             window.localStorage.setItem('body', JSON.stringify(body));
             $scope.active.body = body;
         };

         function initiateValues() {
             $scope.user = Authentication.user;
             $scope.parts = {
                 heads: {},
                 necks: {},
                 bodies: {}
             };
             $scope.active = {
                 head: {},
                 neck: {},
                 body: {},
                 brand: '',
                 tab: 'heads'
             };
             $scope.brands = [];
             $scope.existingGuitar = false;
             $scope.save = {
                 success: false,
                 error: false
             };
         }

         function loadSessionData() {
             if (window.localStorage.brand) {
                 $scope.setBrand(window.localStorage.brand);
             }
             if (window.localStorage.tab) {
                 $scope.setTab(window.localStorage.tab);
             }

             $scope.existingGuitar = 'guitarId' in $stateParams;
             $scope.sessionGuitar = window.localStorage.getItem('head') ||
                                    window.localStorage.getItem('neck') ||
                                    window.localStorage.getItem('body');
         }

         function loadGuitar() {
             function findPart(parts, id) {
                 var retVal;
                 parts.forEach(function (part) {
                     if (part._id === id) {
                         retVal = part;
                     }
                 });
                 return retVal;
             }

             function loadSavedGuitar() {
                 $http.get('/guitars/' + $stateParams.guitarId).success(function (guitar) {
                     $scope.setName(guitar.name);
                     $scope.setHead(findPart($scope.parts.heads, guitar.head));
                     $scope.setNeck(findPart($scope.parts.necks, guitar.neck));
                     $scope.setBody(findPart($scope.parts.bodies, guitar.body));
                 });
             }

             function loadSessionGuitar() {
                 $scope.active.name = window.localStorage.name;
                 if (window.localStorage.head) {
                     $scope.active.head = findPart(
                         $scope.parts.heads, JSON.parse(window.localStorage.head)._id);
                 }
                 if (window.localStorage.neck) {
                     $scope.active.neck = findPart(
                         $scope.parts.necks, JSON.parse(window.localStorage.neck)._id);
                 }
                 if (window.localStorage.body) {
                     $scope.active.body = findPart(
                         $scope.parts.bodies, JSON.parse(window.localStorage.body)._id);
                 }
             }

             if ($scope.existingGuitar) {
                 loadSavedGuitar();
             } else if ($scope.sessionGuitar) {
                 $scope.$apply(loadSessionGuitar);
             }
         }

         function loadAssets() {
             var headsLoaded = false,
                 necksLoaded = false,
                 bodiesLoaded = false;

             $http.get('/parts/head').success(function (data) {
                 $scope.parts.heads = data;
                 addBrands(data);
                 headsLoaded = true;
             });
             $http.get('/parts/neck').success(function (data) {
                 $scope.parts.necks = data;
                 addBrands(data);
                 necksLoaded = true;
             });
             $http.get('/parts/body').success(function (data) {
                 $scope.parts.bodies = data;
                 addBrands(data);
                 bodiesLoaded = true;
             });

             var waitForParts = function () {
                 if (headsLoaded !== true || necksLoaded !== true || bodiesLoaded !== true) {
                     setTimeout(waitForParts, 20);
                 } else {
                     loadGuitar();
                 }
             };

             waitForParts();

             function addBrands(parts) {
                 parts.forEach(function (part) {
                     if ($scope.brands.indexOf(part.brand) === -1) {
                         $scope.brands.push(part.brand);
                     }
                 });
             }
         }

         initiateValues();
         loadAssets();
         loadSessionData();
     }

    ]
)
;


