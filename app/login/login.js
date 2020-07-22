'use strict';
/*jshint esversion: 8 */
// import {API} from '../services/API';
/*global localStorage: false, console: false, $: false */

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', "$http", "$location", function ($scope, $http, $location) {

        $scope.error = '';

        $scope.user = {
            email: "",
            password: "",
            app: ""
        };

        let token = localStorage.getItem('token');
        console.log(token);
        if (token.toString() !== 'null') {
            $location.path("/home");
        }

        // validarUser();
        // console.log($scope.error);

        $scope.validarUser = () => {
            $scope.error ="";

            let email = $scope.user.email;
            let password = $scope.user.password;
            let app = $scope.user.app;
            if (email !== "" && password !== "" && app !== "") {
                var settings = {
                    url: 'https://dev.tuten.cl/TutenREST/rest/user/' + email,
                    method: 'PUT',
                    timeout: 0,
                    headers: {
                        password: password,
                        app: app,
                        Accept: 'application/json',
                    },
                    processData: false,
                    mimeType: 'multipart/form-data',
                    contentType: false,
                };


                $http(settings).then(function (response) {

                    console.log(response.data.sessionTokenBck != null);
                    if (response.data.sessionTokenBck != null) {
                        localStorage.setItem('token', response.data.sessionTokenBck);
                        console.log(localStorage.getItem('token'));
                        $location.path("/home");
                    }
                }).catch((error)=>{

                    $scope.error ="Datos incorrectos";
                });
            }else{
                $scope.error ="Todos los campos del formulario deben ser diligenciados";
            }

        };


    }]);