//https://web3js.readthedocs.io/en/v1.4.0/web3-eth-contract.html?highlight=contract%20encodeabi //멜렉형
//https://muyu.tistory.com/entry/Ethereum-web3js-%EC%82%AC%EC%9A%A9%EB%B2%95-%EA%B0%84%EB%8B%A8-%EC%9A%94%EC%95%BD  //함수실행결과 가져오기
//myContract.methods.myMethod([param1[, param2[, ...]]]).estimateGas(options[, callback])
//https://www.npmjs.com/package/web3-eth-contract 웹3js eth 컨트랙트
//https://kimsfamily.kr/343 웹3js 설치 및 확인
    //var Web3 = require('web3');
    //var web3 = new Web3();	
    //var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8123'));\
//https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=gglee0127&logNo=221310438795 솔리디티 코드 컴파일 

    
    window.onload=function() {
        document.getElementById("optimize").onclick=Optimize_Code;
    }
  
  

   function Optimize_Code() {
    //    // 솔리디티.sol 파일의 내용을 문자열로 값을 가져온다
    // code = fs.readFileSync('test.sol').toString()

    // // solc 라이브러리 로드
    // var solc = require('solc')

    // // 컴파일 실행 및 컴파일 된 객체 받기
    // compiledCode = solc.compile(code);
    // console.log(compiledCode);
    // console.log("dd");


    var txtBox = document.getElementById("inputbox");
    var code = txtBox.value.split("\n");
   
    // generate HTML version of text
    var resultString  = "<p>";
    //var orginalCode = resultString;
    
    
    /*들여쓰기*/
    for (var i = 0; i < code.length; i++) {
      resultString += code[i] + "<br/>";

      for (var j = 0; j < code[i].length; j++){
        if(code[i][j]==" ") //들여쓰기 #개선필요
        {
            resultString += "&nbsp";
            break;
        }
      }
    }


    //###   PATTERN1 동적배열을 정적배열로 바꿔줌   ###
    // 동적 배열 uint[] public unitArray = [1,2,3];  // 실행시간에 크기가 결정됨
    // 정적 배열 uint[3] public unitArray = [1,2,3]; // 배열 선언시 크기가 결정됨
    var setArr='';
    var count = 0; 

    for (var i=0; i< resultString.length; i++){
        
        if(resultString[i]=='[' && resultString[i+1]==']'){
            j=i;
            while(resultString[j]!=';')
            {
                setArr+=resultString[j];
                j++;
            }setArr+=';';
        }
    }
    const splitArr= setArr.split(";");
    const copySplitArr=splitArr.slice();//깊은 복사
 
    for (var i=0; i<splitArr.length-1;i++)
    {
        count=0;
        //alert(splitArr[i]);
        for(var j=0; j<splitArr[i].length;j++)
        {
            if(splitArr[i][j]==',')
            {
                count+=1;
            }
        }
        if(count!=0)
        {
            splitArr[i]=insert(splitArr[i],1,count+1);
            resultString = replaceAll(resultString,copySplitArr[i],splitArr[i]);
            //alert(copySplitArr[i]);
            //alert(splitArr[i]);
        }
    }
    

    //###   PATTERN2 반복문 내의 storage 변수를 memory로 변경해줌    ###
    // var loopStr='';
    // for (var i=0; i< resultString.length; i++){
    //     if(resultString[i]=='f' && resultString[i+1]=='o' && resultString[i+2]=='r'){
    //         j=i;
    //         while(resultString[j]!='}') 
    //         {
    //             loopStr+=resultString[j];
    //             j++;
    //         }loopStr+='}';
    //     }
    // }
    //loopStr = replaceAll(loopStr,'<br/>',''); // <br/>제거
    //loopStr = replaceAll(loopStr,'&nbsp',''); // &nbsp 제거
   
    //###   PATTERN2 함수 내의 storage 변수를 memory로 변경해줌    ###
    var loopStr='';
    for (var i=0; i< resultString.length; i++){
        if(resultString[i]=='f' && resultString[i+1]=='u' && resultString[i+2]=='n'){
            j=i;
            while(resultString[j]!='}') 
            {
                loopStr+=resultString[j];
                j++;
            }loopStr+='}';
        }
    }

    const splitFor= loopStr.split("}");
    const copySplitFor=splitFor.slice();//깊은 복사
 
    for (var i=0; i<splitFor.length-1;i++)
    {
            splitFor[i] = replaceAll(splitFor[i],"storage","memory");
            resultString = replaceAll(resultString,copySplitFor[i],splitFor[i]);// 반복문 안의 storage를 memory로 변경
   
    }

    

// //Uint* vs Uint256
// //c=a
// //a=b
// //b=c
// //###   PATTERN3 변수 스왑해줌   ###
//     var swapStr='';
//         for (var i=0; i< resultString.length; i++){
//             if(resultString[i]=='=' && resultString[i+1]=='n' && resultString[i+2]=='t'){
//                 j=i;
//                 while(resultString[j]!=';') 
//                 {
//                     swapStr+=resultString[j];
//                     j++;
//                 }swapStr+=';';
//             }
//         }
//         swapStr = replaceAll(swapStr,'<br/>',''); // <br/>제거
//         swapStr = replaceAll(swapStr,'&nbsp',''); // &nbsp 제거
//         alert(swapStr);

// let obj = {
//     get field_totalSupply(){
//         //getter, obj.propName를, 실행할 때 실행되는 코드
//         return this.field_totalSupply;
//     },
//     set filed_totalSupply(value){
//         this.filed_totalSupply=value;
//     }
// };
// obj.field_totalSupply = "zzzzz";


//###   PATTERN3 0으로 초기화된 코드 제거해서 최적화 해줌    ###
    resultString = replaceAll(resultString,"=0",""); // 0은 없애주고
    resultString += "</p>";

    // print out to page
    var   blk   = document.getElementById("result");
    blk.innerHTML  =  resultString; 

    
    
    //replaceAll("javascript","a","b") => 'jbvbscript'
    function replaceAll(str, searchStr, replaceStr) { //#pattern1
        return str.split(searchStr).join(replaceStr);
     }
    

     //alert(insert("foo baz", 4, "bar "));
     function insert(str, index, value) {
        return str.substr(0, index) + value + str.substr(index);
    }

    

  
}
    
   