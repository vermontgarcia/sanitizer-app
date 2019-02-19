//Auxiliar Variables

//let reader;
let data = [];
var hexDataFile;
let cleanHexStream = '';
let fileHeader = '';
let transportHeader = [];
let hexMessage = [];
let pointer = 0;
let fileHeaderLong = 48;
let transportHeaderLong = 32;
let isoHeaderLong = 32;
let isoHeader = [];
let hexPrimaryBitMap;
let hexPrimaryBitMapLong = 32;
let hexSecundaryBitMap;
let hexSecundaryBitMapLong = 32;
let ascciPrimaryBitMap;
let ascciSecundaryBitMap;
let binPrimaryBitMap;
let binSecundaryBitMap;
let indexISOMessages;
let hexISOString = '49534f';
let tokenC0String = '21204330303030323620';
let secBitMap = false;
let binBitMap = '';

let hexStreamIni = 0;

let name;

//Conversion functions
function pad(n, width, z = '0') {
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function hexdump(buf) {
    let view = new Uint8Array(buf);
    let hex = Array.from(view).map(v => this.pad(v.toString(16), 2));
    return `${hex.join('')}`;
}

function hex2Ascii(string){
    let hex  = string.toString();
	let str = '';
	for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

function hex2bin(hexString){
    let bin = '';
    for(let i = 0; i<hexString.length ; i++){
        bin += ("0000" + (parseInt(hexString[i], 16)).toString(2)).substr(-4);
    }
    return bin
}

//Mesagges processing functions

function indexString(string) {
	let index = 0
	let i = 0;
	let isoIndex = [];
	while(index>-1){
		index = hexDataFile.indexOf(string,index);
		if (index >-1){
			isoIndex[i] = index;    
			i++;
			index ++;
		}
	}
	return isoIndex;
}

function mBreakDown (mBitMap,item){
	let acc=0;
	for(let i=0; i<mBitMap.length; i++){
		if(mBitMap[i]==='1'){
			let deLong = dataElementProcess(i+1);
			acc += deLong;
			//console.log(i+1,deLong,acc);
		}
	}

	//Searching for spaces tail and update pointer
	let test = hexDataFile.slice(pointer,pointer+32)
	if (test === '20202020202020202020202020202020'){
		cleanHexStream += hexDataFile.slice(pointer,pointer+32);
		pointer += 32;
	}

	//Searching for 2 possition tail and in case update pointer

	//let long1 = hexDataFile.slice(pointer+2+16 +8,pointer+2+24 +4); /// For 248 + 88 headers
	//let long2 = hexDataFile.slice(pointer+2+24 +4 ,pointer+2+32); /// For 248 + 88 headers
	let long1 = hexDataFile.slice(pointer+2+16, pointer+2+24);
	let long2 = hexDataFile.slice(pointer+2+24 ,pointer+2+32);
	if (long1 === long2){
		console.log('Equal, updating pointer and continuing the proccess...')
		cleanHexStream += hexDataFile.slice(pointer,pointer+2);
		pointer += 2;
		console.log(pointer);
		//pointer += 32;
		//console.log(pointer);
	} else{
		console.log('Not equal, testing back possition....')
		//long1 = hexDataFile.slice(pointer+16 +8 ,pointer+24 +4); /// For 248 + 88 headers
		//long2 = hexDataFile.slice(pointer+24 +4 ,pointer+32); /// For 248 + 88 headers
		long1 = hexDataFile.slice(pointer+16 ,pointer+24);
		long2 = hexDataFile.slice(pointer+24 ,pointer+32);
		if (long1 === long2){
			console.log('Equal, continuing the proccess...');
			console.log(pointer);
			// pointer += 32;
			// console.log(pointer);
		}
	} 

	console.log('Clean HexStream');
	console.log(cleanHexStream);
	let message = {};
	message.message = item;
	message.hexStream = cleanHexStream;
	data.push(message)

	console.log ('write message', data)
	//writeMessage(item,cleanHexStream);
	//cleanHexStream='';
	//pointer+=32;
	pointer+=transportHeaderLong;
	return acc;
}

function variableLenght(deLongitud,de){
	let longitud;
	let hex = hexDataFile.slice(pointer,pointer+deLongitud);
	cleanHexStream += hex;
	//console.log('Long DE-'+de+': ', hex);
	console.log('Long DE-'+de+': ', hex2Ascii(hex));
	let deLong = parseInt(hex2Ascii(hex));
	//console.log(deLong);
	pointer += deLongitud;
	longitud = deLong*2;
	staticLenght(longitud,de);
	return deLongitud+longitud;
}

function staticLenght(longitud,de){
	let hex;
	hex = hexDataFile.slice(pointer,pointer+longitud);
	if (de === 35 ){
		let auxPointer = pointer + 12;
		if(longitud === 16*2){
			let string = hexDataFile.slice(auxPointer,auxPointer+12);
			hex = hex.replace(string,'2a2a2a2a2a2a');
		} else if (longitud >= 21*2){
			let string = hexDataFile.slice(auxPointer,auxPointer+12);
			hex = hex.replace(string,'2a2a2a2a2a2a');
			string = hexDataFile.slice(auxPointer+22,auxPointer+30);
			hex = hex.replace(string,'2a2a2a2a');
		}
			
	} else if (de === 63 || de === 126){
		let index = 0;
		index = hex.indexOf(tokenC0String,index);
		//console.log('index ', index)
		if (index >-1){
			index += tokenC0String.length;
			//console.log('index ', index)
			let string = hex.slice(index,index+6);
			//console.log('string ', string)
			if (!(string.includes('20')||string.includes('58'))){
				hex = hex.replace(string,'2a2a2a');
				//console.log('hex ', hex)
			}
		}
	}
	//console.log('DE-'+de+': ',hex);
	cleanHexStream += hex;
	console.log('DE-'+de+': ',hex2Ascii(hex));
	pointer += longitud;
}

function dataElementProcess(de){
	let longitud;
	let deLongitud;
	//let deLong;
	switch(de){
		case 1:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		case 2:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;        
		case 3:
			longitud = 6*2;
			staticLenght(longitud,de);
		return longitud;
		case 4:
			longitud = 12*2;
			staticLenght(longitud,de);
		return longitud;
		case 5:
			longitud = 12*2;
			staticLenght(longitud,de);
		return longitud;
		case 6:
			longitud = 12*2;
			staticLenght(longitud,de);
		return longitud;
		case 7:
			longitud = 10*2;
			staticLenght(longitud,de);
		return longitud;
		case 8:
			longitud = 8*2;
			staticLenght(longitud,de);
		return longitud;
		case 9:
			longitud = 8*2;
			staticLenght(longitud,de);
		return longitud;
		case 10:
			longitud = 8*2;
			staticLenght(longitud,de);
		return longitud;
		case 11:
			longitud = 6*2;
			staticLenght(longitud,de);
		return longitud;
		case 12:
			longitud = 6*2;
			staticLenght(longitud,de);
		return longitud;
		case 13:
			longitud = 4*2;
			staticLenght(longitud,de);
		return longitud;
		case 14:
			longitud = 4*2;
			staticLenght(longitud,de);
		return longitud;
		case 15:
			longitud = 4*2;
			staticLenght(longitud,de);
		return longitud;
		case 16:
			longitud = 4*2;
			staticLenght(longitud,de);
		return longitud;
		case 17:
			longitud = 4*2;
			staticLenght(longitud,de);
		return longitud;
		case 18:
			longitud = 4*2;
			staticLenght(longitud,de);
		return longitud;
		case 19:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 20:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 21:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 22:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 23:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 24:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 25:
			longitud = 2*2;
			staticLenght(longitud,de);
		return longitud;
		case 26:
			longitud = 2*2;
			staticLenght(longitud,de);
		return longitud;
		case 27:
			longitud = 1*2;
			staticLenght(longitud,de);
		return longitud;
		case 28:
			longitud = (1+8)*2;
			staticLenght(longitud,de);
		return longitud;
		case 29:
			longitud = (1+8)*2;
			staticLenght(longitud,de);
		return longitud;
		case 30:
			longitud = (1+8)*2;
			staticLenght(longitud,de);
		return longitud;
		case 31:
			longitud = (1+8)*2;
			staticLenght(longitud,de);
		return longitud;
		case 32:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 33:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 34:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 35:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 36:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 37:
			longitud = 12*2;
			staticLenght(longitud,de);
		return longitud;
		case 38:
			longitud = 6*2;
			staticLenght(longitud,de);
		return longitud;
		case 39:
			longitud = 2*2;
			staticLenght(longitud,de);
		return longitud;
		case 40:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 41:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		case 42:
			longitud = 15*2;
			staticLenght(longitud,de);
		return longitud;
		case 43:
			longitud = 40*2;
			staticLenght(longitud,de);
		return longitud;
		case 44:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 45:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 46:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 47:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 48:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 49:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 50:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 51:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 52:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		case 53:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		case 54:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 55:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 56:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 57:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud; 
		case 58:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 59:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 60:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 61:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 62:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 63:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 64:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		case 70:
			longitud = 3*2;
			staticLenght(longitud,de);
		return longitud;
		case 73:
			longitud = 6*2;
			staticLenght(longitud,de);
		return longitud;
		case 90:
			longitud = 42*2;
			staticLenght(longitud,de);
		return longitud;
		case 91:
			longitud = 1*2;
			staticLenght(longitud,de);
		return longitud;
		case 95:
			longitud = 42*2;
			staticLenght(longitud,de);
		return longitud;
		case 96:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		case 100:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 101:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 102:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 103:
			deLongitud = 2*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 112:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 113:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 114:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 115:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 116:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 117:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 118:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 119:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 120:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 121:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 122:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 123:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 124:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 125:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 126:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 127:
			deLongitud = 3*2;
			longitud = variableLenght(deLongitud,de);
		return longitud;
		case 128:
			longitud = 16*2;
			staticLenght(longitud,de);
		return longitud;
		default:
			console.log('ERROR ',de);
	}
}



export const hexDump = (buf) => {
	let view = new Uint8Array(buf);
	let hex = Array.from(view).map(v => pad(v.toString(16), 2));
	return `${hex.join('')}`;
}


export const proccessFile = (hdf) => {

	data = [];
	hexDataFile = hdf

	//Header of the file
	fileHeader = hexDataFile.slice(pointer,fileHeaderLong);
	pointer += fileHeaderLong;
	//Transport data of the message
	transportHeader[0] = hexDataFile.slice(pointer,pointer+transportHeaderLong);
	pointer += transportHeaderLong;

	//Identifying ISO Messages
	indexISOMessages = indexString(hexISOString);
	console.log(indexISOMessages);

	//Processing Messages

	for(let i = 0; i < indexISOMessages.length; i++){

		binBitMap='';

		console.log('************************** MESSAGE '+ (i+1) +' **************************')

		//console.log(cleanHexStream);
		cleanHexStream = '';

		//console.log(pointer);

		cleanHexStream += hexDataFile.slice(pointer,indexISOMessages[i]);

		isoHeader[i] = hexDataFile.slice(indexISOMessages[i],indexISOMessages[i]+isoHeaderLong);

		cleanHexStream += isoHeader[i];

		console.log(hex2Ascii(isoHeader[i]));
		//Primary bit map
		pointer = indexISOMessages[i]+isoHeaderLong;
		hexPrimaryBitMap = hexDataFile.slice(pointer,pointer+hexPrimaryBitMapLong);
		pointer += hexPrimaryBitMap.length;
		cleanHexStream += hexPrimaryBitMap;


		ascciPrimaryBitMap = hex2Ascii(hexPrimaryBitMap);
		binPrimaryBitMap = hex2bin(ascciPrimaryBitMap);
		binBitMap += binPrimaryBitMap;
		//console.log(hexPrimaryBitMap);
		//console.log(ascciPrimaryBitMap);
		//console.log(binPrimaryBitMap);

		//Seundary bit map if any
		if (binPrimaryBitMap[0]==='1'){
			//console.log('Entrando....')
			secBitMap = true;
			hexSecundaryBitMap = hexDataFile.slice(pointer,pointer+hexSecundaryBitMapLong);
			//cleanHexStream += hexSecundaryBitMap;
			ascciSecundaryBitMap = hex2Ascii(hexSecundaryBitMap);
			binSecundaryBitMap = hex2bin(ascciSecundaryBitMap);
			binBitMap += binSecundaryBitMap;
			//console.log(hexSecundaryBitMap);
			//console.log(ascciSecundaryBitMap);
		} else {
			//console.log('No entrando....')
			secBitMap = false;
		}
		//identifying DE35
		console.log(binBitMap);
		mBreakDown(binBitMap,i+1);
	}
	return data;	
}