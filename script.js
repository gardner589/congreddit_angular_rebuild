var app = angular.module("greddit", ["ngResource", "ui.router"])

app.config(["$stateProvider", function($stateProvider){
  $stateProvider.state("index", {
    url: "/legislators",
    templateUrl: "./legIndex.html",
    controller: "legis"
  })
  .state("show", {
    url: "/legislators/:id",
    views: {
      "main": {
        templateUrl: "./show.html"
      },
      "partial": {
        // templateUrl: "./comment.html"
      }
    },
  })
  .state("mainPage",{
    url: "/",
    templateUrl: "./mainPage.html"
  })
  .state("bills", {
    url: "/bills",
    templateUrl: "./billIndex.html",
    controller: "billIndex"
  })
  .state("billShow",{
    url: "/bills/:id",
    templateUrl: "./billShow.html",
    controller: "billShow"
  })
}])

app.factory("factry",["$resource", function($resource){
  return $resource('https://thawing-island-32605.herokuapp.com/legislators/:id', {},{
    update: {
      method: 'PUT'
    }
  });
}])

app.factory("billFactry", function($resource){
  return $resource('https://thawing-island-32605.herokuapp.com/bills/:id')
})

app.controller("billIndex", ["$scope", "billFactry", function($scope, billFactry){
  $scope.bills = billFactry.query();

}])

app.controller("legis",["$scope","factry", function($scope, factry){
  $scope.legislators = factry.query();
}])

app.controller("billShow", ["$scope", "billFactry", "$stateParams", function($scope, billFactry, $stateParams){
  $scope.bill = billFactry.get({id: $stateParams.id}, function(res){
   $scope.sponsor = angular.fromJson(res.sponsor)
   $scope.pdf = angular.fromJson(res.last_version)
    console.log($scope.pdf)
  })
}])

app.controller("legislatorShow", ["$scope", "factry", "$stateParams", "$state", function($scope, factry, $stateParams, $state){
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
            newObj.bill_id = bill[2]
            // console.log(newObj.bill_id)
            $scope.votes.push(newObj);
          }
        })
      }
    });
  });
  // $scope.putComment = function($state){
  //   console.log(this.comment);
  //   console.log(this.poster);
  //   $scope.newComment = this.comment;
  //   $scope.poster = this.poster
  //   $scope.legislator = factry.get({id: $stateParams.id},function(res){
  //     var obj = {};
  //     obj.comment = $scope.newComment;
  //     obj.posted_by = $scope.poster;
  //     console.log(res.comments)
  //     res.comments.push(obj)
  //     res.$update()
  //     res.$save()
  //     console.log(res.comments)
  //   });
  //     // $scope.legislator.comments
  //     // res.comments.save(this.comment);
  //   this.comment = '';
  // };
  $scope.switch = function(){
      $scope.voteHistory = true;
      $scope.Hascomments = false
  };
  $scope.comments = function(){
      $scope.voteHistory = false;
      $scope.Hascomments = true
  }

}])

// https://thawing-island-32605.herokuapp.com/legislators/:id
