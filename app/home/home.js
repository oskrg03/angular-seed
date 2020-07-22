'use strict';
/*jshint esversion: 8 */
/*global localStorage: false, console: false, $: false */

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .controller('HomeCtrl', ["$scope", "$http", "$location", function ($scope, $http, $location) {
        let data = [];
        let BookingList = [];
        $scope.BookingListFiltered = [];
        let token = localStorage.getItem('token');
        $scope.choosed = ">=";
        $scope.precio = 0;
        
        if (token.toString() == 'null') {
            $location.path("/login");
        } else {
            const adminemail = "testapis@tuten.cl";
            const email = "contacto@tuten.cl";
            const current = true;
            const app = "APP_BCK";


            var settings = {
                url: 'https://dev.tuten.cl/TutenREST/rest/user/' + email + '/bookings?current=' + current,
                method: 'GET',
                timeout: 0,
                headers: {
                    adminemail: adminemail,
                    token: token,
                    app: app,
                    Accept: 'application/json',
                },
                processData: false,
                mimeType: 'multipart/form-data',
                contentType: false,
            };


            $http(settings).then(function (response) {

                data = response.data;
                $scope.loadBookings();
            });
        }


        $scope.choosedMethod = (opcion) => {

            $scope.choosed = opcion;
          
            $scope.filtrar();
        }

        $scope.salir = () => {
            localStorage.setItem("token", null);
            $location.path("/login");
        };


        $scope.buscar = () => {
            let valor = "" + $scope.searchValue;

            if (valor != null) {
                $scope.filtrar();
            } else {
                $scope.searchValue = 0;
                $scope.filtrar();
            }
        };

        $scope.loadBookings = () => {

            /*Se recorren los bookings obtenidos y se crean nuevos objetos
             simplificados de la información que solicitan para visualizar*/
            data.forEach((element) => {
                console.log(element.bookingId);
                let booking = {
                    bookingID: 0,
                    cliente: '',
                    direccion: '',
                    fecha_creacion: new Date(),
                    precio: 0,
                };

                booking.bookingID = element.bookingId;
                booking.cliente =
                    element.tutenUserClient.firstName +
                    ' ' +
                    element.tutenUserClient.lastName;
                booking.direccion = element.locationId.streetAddress;
                booking.fecha_creacion = new Date(element.bookingTime);
                booking.precio = element.bookingPrice;

                BookingList.push(booking);
            });
            $scope.BookingListFiltered = BookingList;
            console.log($scope.BookingListFiltered);
        };

        $scope.filtrar = () => {
            $scope.BookingListFiltered = BookingList;

            if ($scope.searchValue > 0 || $scope.precio > 0) {
                //Se filtra por el bookingid
                if ($scope.searchValue > 0) {
                    $scope.BookingListFiltered = BookingList.filter((item) => {


                        if (item.bookingID === $scope.searchValue) {

                            return item;
                        }
                    });
                }

                //Se filtra por precio 
                if ($scope.choosed === "y") {

                    $scope.BookingListFiltered = $scope.BookingListFiltered.filter((item) => {
                        if (item.precio === $scope.precio) {
                            return item;
                        }
                    });
                } else {

                    if ($scope.choosed == ">=") {

                        $scope.BookingListFiltered = $scope.BookingListFiltered.filter((item) => {

                            if (item.precio >= $scope.precio) {
                                return item;
                            }
                        });
                    } else {
                        $scope.BookingListFiltered = $scope.BookingListFiltered.filter((item) => {
                            if (item.precio <= $scope.precio) {
                                return item;
                            }
                        });
                    }
                }


            } else {
                //En caso de que no se ingrese bookingId y/o precio, los datos son los iniciales.
                $scope.BookingListFiltered = BookingList;
            }
        };


    }]);