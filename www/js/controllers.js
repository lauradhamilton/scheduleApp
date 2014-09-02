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

.controller('SplashCtrl', function($scope, $state, $stateParams, $filter, $http) {

  $scope.user = {
    email: '',
    password: '',
    attending_abbreviation: ''
  }

  var today = $filter('date') (new Date(), 'yyyyMMdd');

  $scope.goToToday = function() {
    $http.post("http://localhost:3000/api_sessions", {"email": $scope.user.email,"password": $scope.user.password})
      .success(function(data){
        console.log(data.authentication_token);
        localStorage.setItem("user_token", data.authentication_token);
        localStorage.setItem("user_email", $scope.user.email);
        localStorage.setItem("attending_abbreviation", $scope.user.attending_abbreviation)
      });
    $state.go('schedule/:attending_abbreviation/:date', {attending_abbreviation: $scope.user.attending_abbreviation, date: today});
    $stateParams.attending_abbreviation = $scope.user.attending_abbreviation;
    $stateParams.date = $scope.today;
  }
})

.controller('ScheduleCtrl', function($scope, $http, $state, $stateParams, $filter, $timeout) {

  var data_date_year = parseInt($stateParams.date.substring(0,4));
  var data_date_month = parseInt($stateParams.date.substring(4,6));
  var data_date_day = parseInt($stateParams.date.substring(6,9));
  $scope.date = new Date(data_date_year, data_date_month -1, data_date_day);

  var previous_date = $filter('date') (new Date(data_date_year, data_date_month-1, data_date_day -1), 'yyyyMMdd');
  var next_date = $filter('date') (new Date(data_date_year, data_date_month-1, data_date_day +1), 'yyyyMMdd');
  
  $scope.goToPreviousDate = function() {
    $state.go('schedule/:attending_abbreviation/:date', {attending_abbreviation: $stateParams.attending_abbreviation, date: previous_date});
    $stateParams.date = $scope.data_date;
  }

  $scope.goToNextDate = function() {
    $state.go('schedule/:attending_abbreviation/:date', {attending_abbreviation: $stateParams.attending_abbreviation, date: next_date});
    $stateParams.date = $scope.data_date
  }

  $scope.data = {
    swipe : 0,
    swiperight: 0,
    swipeleft: 0,
    tap : 0,
    doubletap : 0,
    scroll : 0
  };

  $scope.reportEvent = function(event)  {
    
    $timeout(function() {
      $scope.data[event.type]++;
      if (event.type == 'swipe' && event.gesture.direction == 'left') {
        $state.go('schedule/:attending_abbreviation/:date', {attending_abbreviation: $stateParams.attending_abbreviation, date: next_date});
        $stateParams.date = $scope.date
      }
      if (event.gesture.direction == 'right') {
        $state.go('schedule/:attending_abbreviation/:date', {attending_abbreviation: $stateParams.attending_abbreviation, date: previous_date});
        $stateParams.date = $scope.date
      }
    })
  }

  $http.get('http://localhost:3000/api/schedule_app_api?appointment_date=' + $stateParams.date + "&attending_abbreviation=" + localStorage.getItem("attending_abbreviation") + "&user_email=" + localStorage.getItem("user_email") + "&user_token=" + localStorage.getItem("user_token"))
    .success(function(data){
      $scope.appointments = data;
    })
});
