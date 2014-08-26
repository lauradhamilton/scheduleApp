angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ScheduleCtrl', function($scope, $http, $state, $stateParams) {
  var data_date_year = parseInt($stateParams.date.substring(0,4));
  var data_date_month = parseInt($stateParams.date.substring(4,6));
  var data_date_day = parseInt($stateParams.date.substring(6,9));
  $scope.date = new Date(data_date_year, data_date_month -1, data_date_day);
  
  $http.get('data/schedule_app_data.json')
    .success(function(data, status, headers, config){
      $scope.appointments = data;
    })
});
