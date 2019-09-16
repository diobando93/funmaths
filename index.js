const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
let net;
let a=0,b=0,c=0,d=0,sum=0,aux=0,saux=0,fcount=0;

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
  };
  // When clicking a button, add an example for that class.
  document.getElementById('class-s').addEventListener('click', () => addExample(0));
  document.getElementById('class-a').addEventListener('click', () => addExample(1));
  document.getElementById('class-b').addEventListener('click', () => addExample(2));
  document.getElementById('class-c').addEventListener('click', () => addExample(3));
  document.getElementById('class-d').addEventListener('click', () => addExample(4));
  document.getElementById('class-m').addEventListener('click', () => addExample(5));

  while (aux==0) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['S','A', 'B', 'C','D','M'];
      if (result.confidences[result.classIndex]>0.8){
          document.getElementById('console').innerText = `
          prediction: ${classes[result.classIndex]}\n
          probability: ${result.confidences[result.classIndex]}
          `;
          if (classes[result.classIndex] == 'S'){
              aux = 0;
              while(fcount <50000){
                  fcount = fcount + 1
                  console.log(fcount);
              }
              fcount = 0;
              saux = 0;
          }
          if (classes[result.classIndex] == 'A'){
              a = 1;
              while(fcount <50000){
                  fcount = fcount + 1
                  console.log(fcount);
              }
              fcount = 0;
          }
          if (classes[result.classIndex] == 'B'){
              b = 2;
              while(fcount <50000){
                  fcount = fcount + 1
                  console.log(fcount);
              }
              fcount = 0;
          }
          if (classes[result.classIndex] == 'C'){
              c = 3;
              while(fcount <50000){
                  fcount = fcount + 1
                 console.log(fcount);
              }
              fcount = 0;
          }
          if (classes[result.classIndex] == 'D'){
              d = 4;
              while(fcount <50000){
                  fcount = fcount + 1
                 console.log(fcount);
              }
              fcount = 0;
          }

          //console.log(sum)
          if (classes[result.classIndex]=='M'){
            saux = sum + saux
            while(fcount <50000){
                fcount = fcount + 1
               console.log(fcount);
            }
            fcount = 0;
          }

          sum = a+b+c+d
          if (sum >=10 && classes[result.classIndex]!='M' ){
              a = 0;
              b = 0;
              c = 0;
              d = 0;
              //sum = 0;
          }
          document.getElementById('console').innerText = `
          prediction: ${classes[result.classIndex]}\n
          probability: ${result.confidences[result.classIndex]}
          mult : ${saux}
          add : ${sum}
          `;

          //sum = sum+sum

      }
      document.getElementById('console2').innerText = `
        prediction: ${classes[result.classIndex]}\n
        probability: ${result.confidences[result.classIndex]}
      `;
    }

    await tf.nextFrame();
  }
}

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

app();
