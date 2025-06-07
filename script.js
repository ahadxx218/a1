
let video = document.getElementById("camera");
let result = document.getElementById("result");
let model;

async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
  } catch (error) {
    result.textContent = "❌ لم يتم تشغيل الكاميرا. تأكد من الإذن.";
  }
}

async function loadModel() {
  model = await mobilenet.load();
  result.textContent = "✅ جاهز للتحليل";
}

async function analyze() {
  if (!model) {
    result.textContent = "📦 جاري تحميل النموذج...";
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const predictions = await model.classify(canvas);

  if (predictions.length > 0) {
    const prediction = predictions[0];
    const label = prediction.className.split(',')[0];
    result.textContent = `📍 وصف المكان: ${label.trim()} (نسبة: ${Math.round(prediction.probability * 100)}%)`;
  } else {
    result.textContent = "😔 ما قدرت أتعرف على المكان";
  }
}

setupCamera();
loadModel();
