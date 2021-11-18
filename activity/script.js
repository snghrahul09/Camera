let videoplayer = document.querySelector('video');
let vidRecordBtn = document.querySelector('#record-video');
let captureBtn = document.querySelector('#click-picture');
let constraints = {video:true, audio:false};
let mediaRecorder;
let recordState = false;
let chunks = [];
let filter = '';
let currZoom = -1;
let ZoomInBtn = document.getElementById('in');
let ZoomOutBtn = document.getElementById('out');

ZoomInBtn.addEventListener("click",function(){
    let vidscale = Number(
        videoplayer.style.transform.split("(")[1].split(")")[0]
    );
    // console.log(vidscale);
    if(vidscale < 3){
        currZoom = vidscale + 0.1;
        videoplayer.style.transform=`scale(${currZoom})`
    }
})

ZoomOutBtn.addEventListener("click",function(){
    let vidscale = Number(
        videoplayer.style.transform.split("(")[1].split(")")[0]
    );
    // console.log(vidscale);
    if(vidscale > 1){
        currZoom = vidscale - 0.1;
        videoplayer.style.transform=`scale(${currZoom})`
    }
})






let allFilters = document.querySelectorAll('.filter');
for(let i=0;i<allFilters.length;i++){
    allFilters[i].addEventListener("click",function(e){
        filter = e.currentTarget.style.backgroundColor;
        removeFilter();
        addFilterToScreen(filter);

    })
}

function addFilterToScreen(filterColor){
    let filter = document.createElement('div'); 
    filter.classList.add('on-screen-filter');
    filter.style.height = '100vh';
    filter.style.width = '100vw';
    filter.style.backgroundColor = `${filterColor}`;
    filter.style.position = 'fixed';
    filter.style.top = '0px';
    document.querySelector('body').appendChild(filter);


}

function removeFilter(){
    let el = document.querySelector('.on-screen-filter');
    if(el){
        el.remove();
    }
}

vidRecordBtn.addEventListener("click",function(){
    if(mediaRecorder != undefined){
        removeFilter();
        let innerdiv = vidRecordBtn.querySelector("#record-div");
      if(recordState == false){
            recordState = true;
            innerdiv.classList.add('recording-animation');
            currZoom = 1;
            videoplayer.style.transform = `scale(${currZoom})`;
            mediaRecorder.start();
            // vidRecordBtn.innerText = 'Recording...';
        }else{
            recordState = false;
            innerdiv.classList.remove('recording-animation');
            mediaRecorder.stop();
            // vidRecordBtn.innerText = 'Record';
            }
        }
        })
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
    videoplayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = function(e){
       chunks.push(e.data);
    }
mediaRecorder.onstop = function(){
     let blob = new Blob(chunks,{type:'video/mp4'});
     chunks = [];
     let blobUrl = URL.createObjectURL(blob);
     var link = document.createElement('a');
     link.href = blobUrl;
     link.download = 'video.mp4';
     link.click();
     link.remove()
    }
  }).catch(function(err){
      console.log(err);
  })
  captureBtn.addEventListener("click",function(){
      let innerdiv = captureBtn.querySelector('#click-div');
      innerdiv.classList.add('capture-animation');
      console.log('clicked');
      capture();
      setTimeout(function(){
          innerdiv.classList.remove('capture-animation')
      },1000);
  })
  function capture(){
      let c = document.createElement('canvas');
      c.width = videoplayer.videoWidth;
      c.height = videoplayer.videoHeight;
      let tool = c.getContext('2d');
      //origin shifting
      tool.translate(c.width/2,c.height/2);
      //scaling
      tool.scale(currZoom,currZoom);
      //moving back to origin
      tool.translate(-c.width/2,-c.height/2);
      tool.drawImage(videoplayer,0,0);
      if(filter != ''){
          tool.fillStyle = filter;
          tool.fillRect(0,0,c.width,c.height);
      }
      let link = document.createElement('a');
      link.download = 'image.png';
      link.href = c.toDataURL();
      link.click();
      link.remove();

  }
