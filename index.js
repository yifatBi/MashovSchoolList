//MyApp
angular.module('MyApp', [
 'ngMaterial','md.data.table'
]).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
    .accentPalette('orange');
}).constant('constant',{
  yearConverter:{2009:'תשע״ד',2014:'תשס״ט'},
  selectYearLabel:"בחר שנת לימודים",
  columnNames: [{
    name: "studentId",
    display: "ת״ז"
  },{
    name: "fullName",
    display: "שם"
  },{
    name: "classCode",
    display: "שכבה"
  },{
    name: "classNum",
    display: "מספר כיתה"
  }],
  classCodes:['יב','יא','י','ט','ח'],
  classNums:[1,2,3,4],
  schoolPlaceholder:'בחר בית ספר'
}).constant('config',{
  urlApi:"https://web.mashov.info/sd/test/",
  schoolsUrl:"https://web.mashov.info/sd/test/schools.json",
  studentsPostfix:"/students.json",
  existFamily:999999,
  idMinLength:4
}).service('MyService',service).controller('AppCtrl', controller);
service.$inject=['$http','config'];
controller.$inject=['$scope','constant','MyService'];
//This is the service function
function service($http,config){
  //Schools list	
  this.getSchools=function(){
    return $http.get(config.schoolsUrl);
  }
  //actions for UI
  this.isInvalidStudent=function(student){
    return (student.studentId.toString().length<config.idMinLength);
  }
   this.isExistFamily=function(student){
    return student.studentId==config.existFamily;
  }
    this.isWasValid=function(student){
    return !student.classNum;
  }
  //Students list
  this.getStudents=function(school,year){
    return $http.get(config.urlApi+school+'/'+year+config.studentsPostfix)
  }
}
//This is the controller function
function controller($scope,constant,MyService){
  $scope.isInvalidStdent=MyService.isInvalidStudent;
  $scope.isExistFamily=MyService.isExistFamily;
  $scope.isWasValid=MyService.isWasValid;
  // import the data for the school list
  MyService.getSchools().success(function(data) {
    $scope.schoolList = data;
  })
  // When yearSelected-select the student according to the school and selected year
  // and year select from the hebrew years list
  $scope.yearSelected=function(){
    if ($scope.yearItem !== undefined) {
        MyService.getStudents($scope.schoolItem.semel,$scope.yearItem).success(function(data) {
        $scope.students = data;
      }); 
      return constant.yearConverter[$scope.yearItem];
    }
    return constant.selectYearLabel;
  };
  //When school selected init the years value and show the school name
  $scope.schoolSelected=function(){
    if ($scope.schoolItem !== undefined) {
    $scope.yearItem = undefined;
      return $scope.schoolItem.name;
    }
    return constant.schoolPlaceholder;
  }
  //reset student filters
  $scope.resetAll=function(){
  	$scope.search=undefined;
    $scope.yearItem=undefined;
    $scope.schoolItem=undefined;
    $scope.students='';
    $scope.showSearch=false;
  }
  //Init scope values
  $scope.classCodes=constant.classCodes;
  $scope.classNums=constant.classNums;
  $scope.yearConverter=constant.yearConverter;
  $scope.showSearch=false;
  $scope.autocolumn = constant.columnNames;
}
