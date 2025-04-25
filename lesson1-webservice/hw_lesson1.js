// B1 print 1 - 1000
function printTo1000(){
    for(let i = 0; i<=1000; i++){
        console.log(i);
    }
}
// printTo1000()

// B2 print reverse 1000 - 1
function printTo1(){
    for(let i = 1000; i >= 1; i--){
        console.log(i);
    }
}
// printTo1();

// B3 kim tu thap 
function rightAngledTriangle(n) {
    for (let i = 1; i <= n; i++) {
      let row = '#'.repeat(i);
      console.log(row);
    }
  }
//   rightAngledTriangle(4);

// divided by num 5
function devidedFive(){
    for(let i = 1; i< 100; i++){
        if(i%5 ==0){
            console.log(i);
        }
    }
}
// devidedFive();
function devidedFive(){
    for(let i = 100; i>=1; i--){
        if(i%5 ==0){
            console.log(i);
        }
    }
}
// devidedFive();

// Bài 7Left-angled triangle
// Nhập vào một số n và in ra màn hình theo định dạng sau:
function lefttAngledTriangle(n) {
    for (let i = 1; i <= n; i++) {
      let distance = " ".repeat(n-i);
      let row = '#'.repeat(i);
      console.log(distance+ row);
    }
  }
//   lefttAngledTriangle(5);
  //  n-i vì là giảm dần sẽ khớp với # tăng dần

  // Bài 8: 
//Viết chương trình nhập vào số n và tính trung bình cộng các số ước chẵn của n.
//  Lưu ý kết quả làm tròn 2 chữ số thập phân
function handleAverage(){
    let count =0;
    let sum = 0;
    let n = 12;
    for(let i =1; i< n; i++){
        if(n % i === 0 && i%2 ===0 ){
            count ++;
            sum+=i;
        }
    }
    if(count == 0){
        console.log("Ko co uoc chan");
    }
    else{
        let average = (sum/count).toFixed(2);
        console.log("Uoc chan la: ", average);
    }

}
handleAverage();