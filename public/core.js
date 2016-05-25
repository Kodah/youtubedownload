angular.module('app', []).controller('MainController', ['$scope', '$http',
    function($scope, $http) {

        $scope.successfulInfo = false;
        $scope.isProcessing = false;
        $scope.errorOccured = false;

        $scope.update = function(youtubeURL) {
            $scope.successfulInfo = false;
            $scope.errorOccured = false;
            $scope.isProcessing = true;
            $http({
                method: 'POST',
                url: '/api/mp3',
                data: {
                    'youtubeURL': youtubeURL
                }
            }).then(function successCallback(response) {
                $scope.successfulInfo = true;
                $scope.isProcessing = false;
                $scope.videoInfo = response.data[0];
            }, function errorCallback(response) {
                console.log("error")
                $scope.successfulInfo = false;
                $scope.errorOccured = true;
                $scope.isProcessing = false;
                $scope.videoInfo = null;
            });

        };
    }
]);