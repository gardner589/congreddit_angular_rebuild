var app = angular.module("greddit", ["ngResource", "ui.router"])

app.config(["$stateProvider", function($stateProvider){
  $stateProvider.state("index", {
    url: "/legislators",
    templateUrl: "./legIndex.html",
    controller: "legis"
  })
  .state("show", {
    url: "/legislators/:id",
    templateUrl: "./show.html",
    controller: "legislatorShow"
  })
}])

app.factory("factry",["$resource", function($resource){
  return $resource('http://localhost:3000/legislators/:id', {}, {
    update: {method: 'PUT'}
  })
}])

app.controller("legis",["$scope","factry", function($scope, factry){
  $scope.legislators = factry.query();
}])

app.controller("legislatorShow", ["$scope", "factry", "$stateParams", function($scope, factry, $stateParams){
  $scope.votes = [];
  $scope.legislator = factry.get({id: $stateParams.id}, function(res){
    angular.forEach(res.votes, function(vote){
      var newObj = {};
      var blob = angular.fromJson(vote[0]);
      if(blob[res.legislator.bio_id]){
        angular.forEach(res.bill, function(bill){
          if (bill[1] == vote[1]){
            newObj.vote = blob[res.legislator.bio_id];
            newObj.bill = vote[1];
            newObj.bill_title = bill[0];
            $scope.votes.push(newObj);
          }
        })
      }
    });
  });

}])

// https://thawing-island-32605.herokuapp.com/legislators/:id
