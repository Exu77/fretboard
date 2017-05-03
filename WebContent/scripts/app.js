var fretboardApp = angular.module('fretboardApp',['ngMaterial']);

fretboardApp.controller('FretboardController', function FretboardController($scope) {
	  var tuningStd = {
			  4: ['G','D','A','E'],
			  5: ['B','G','D','A','E'],
			  6: ['E', 'B','G','D','A','E'],
			  7: ['E', 'B','G','D','A','E','B'],
			  8: ['E', 'B','G','D','A','E','B','F#'],
			  9: ['E', 'B','G','D','A','E','B','F#','C#']
	  };
	  var scales = {};
	  var scalesDef = {};
	  var initialized = false;
	  
	  $scope.scKeys = {pentatonic: {
		  name: 'pentatonic'
	  }};
	  
	  scalesDef[$scope.scKeys.pentatonic.name] = [3,2,2,3,2];
	  
	  $scope.notes = ['A', 'A#', 'B', 'C', 'C#','D','D#','E','F','F#','G','G#'];

	  $scope.isMajor = false;
	  $scope.currentKey = 'C';
	  $scope.fretSize = 24;
	  $scope.stringCnt = 6;
	  $scope.strings = initStrings();
	  $scope.currentScale = $scope.scKeys.pentatonic;
	  $scope.notes2Displ;
	  var allNotes = getAllNotes();
	  console.log('strings ' + $scope.stringCnt);
	  console.log($scope.strings);
	  console.log(getAllNotes())
	  
	  function initScales(aKey) {
		  var keyPos = getNotePos(aKey);
		  var currentPos = keyPos;
		  console.log('isMajor ' + $scope.isMajor)
		  if ($scope.isMajor) {
		  	currentPos -= 3;
		  	if (currentPos < 0) {
		  		currentPos = $scope.notes.length - currentPos - 1;
			}
		  }
		  // Pentatonic Scale
		  var currentScale = {
				  arr: [aKey], 
				  obj: {}
		  };
		  
		  currentScale.obj[aKey] = true;
		  angular.forEach(scalesDef[$scope.scKeys.pentatonic.name], function (keyStep){
			  currentPos += keyStep;
			  if (currentPos >= $scope.notes.length) {
				  currentPos -= $scope.notes.length;
			  }
			  currentScale.arr.push($scope.notes[currentPos]);
			  currentScale.obj[$scope.notes[currentPos]] = true;
		  });
		  
		  scales[$scope.scKeys.pentatonic.name] = currentScale;
		  console.log('xxxxx ' + aKey)
		  console.log(scales)
		  
		  initialized = true;
	  };
	  
	  function calcScale(aScale) {
		  if(!initialized) {
			  return;
		  }
		  var scale = angular.copy(allNotes);
		  var currentScale = scales[aScale.name];
		  angular.forEach(scale, function(aString, stringInd) {
			  angular.forEach(aString, function(aFretNote, fretInd) {
				  if (!currentScale.obj[aFretNote]) {
					  scale[stringInd][fretInd] = null;
				  }
			  });
		  }); 

		  console.log('calcScale')
		  console.log(scale)
		  return scale;
	  }
	  
	  initScales($scope.currentKey);
	  $scope.notes2Displ = calcScale($scope.currentScale);

	  $scope.getNumberArray = function (aNum) {
		  return new Array(aNum);
	  }
	  
	  $scope.getHighlightClass = function(stringPos, fretPos) {
		  var classPu = ' fret-pu';
		  var classPd = ' fret-pd';
		  
		  if (fretPos === 12 || fretPos === 24) {
			  if (stringPos === 2) {
				  return classPu;
			  } else if (stringPos === 3) {
				  return classPd;
			  } else if (stringPos === 4) {
				  return classPu;
			  } else if (stringPos === 5) {
				  return classPd;
			  }
		  } else if (fretPos === 3 
				  || fretPos === 5
				  || fretPos === 7
				  || fretPos === 9
				  || fretPos === 15
				  || fretPos === 17
				  || fretPos === 19
				  || fretPos === 21) {
			  if (stringPos === 3) {	  
				  return classPu;
			  } else if (stringPos === 4) {
				  return classPd;
			  }
		  }
	  }
	  
	  function initStrings() {
		  var result = [];
		  for (var i = 0; i < $scope.stringCnt; i++) {
			  result.push({
				  stringPos: i+1,
				  baseNote: tuningStd[$scope.stringCnt][i]
			  });
		  }
		  
		  return result;
		  
		  
	  }
	  
	  function getNotePos(aNote) {
		  for (var i = 0; i < $scope.notes.length; i++) {
			  if (aNote === $scope.notes[i]) {
				  return i;
			  }
		  }
		  return -1;
	  }
	  
	  function isPentatonic(stringPos, fretPos) {
		  
		  
	  };
	  
	  function getAllNotes() {
		  result = [];
		  angular.forEach($scope.strings, function(aString) {
			 var aNoteList = [aString.baseNote];
			 var notePos = getNotePos(aString.baseNote) + 1;
			 for (var i = 0; i <= $scope.fretSize; i++) {
				 if(notePos === $scope.notes.length) {
					 notePos = 0;
				 }
				 
				 aNoteList.push($scope.notes[notePos++]);
			 }
			 result.push(aNoteList); 
		  });
		  return result;
	  }

	  $scope.setCurrentKey = function (aKey) {
	  	console.log('setCurrentkey ' + aKey)
	  	$scope.currentKey = aKey;
        recalcEverything();
	  }

	  $scope.setIsMajor = function(isMajor) {
	  	$scope.isMajor = isMajor;
          recalcEverything();
	  }

	  function recalcEverything() {
          initScales($scope.currentKey, $scope.isMajor);
          $scope.notes2Displ = calcScale($scope.currentScale);
	  }
	});