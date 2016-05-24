angular.module('app', []).controller('MainController', ['$scope', '$http',
    function($scope, $http) {

        $scope.successfulInfo = false;
        $scope.isProcessing = false;
        $scope.update = function(youtubeURL) {

            $scope.isProcessing = true;
            $http({
                method: 'POST',
                url: '/api/mp3',
                data: {'youtubeURL': youtubeURL}
            }).then(function successCallback(response) {
                $scope.successfulInfo = true;
                $scope.videoInfo = response.data[0];
                console.log($scope.videoInfo);
                $scope.isProcessing = false;
            }, function errorCallback(response) {
                $scope.successfulInfo = false;
                console.log(response);
                $scope.isProcessing = false;
            });

        };
    }
]);