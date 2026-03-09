let qrCode

function openTab(tab){

document.querySelectorAll(".tab").forEach(t=>t.style.display="none")

document.getElementById(tab).style.display="block"

}

openTab("qr")



function generateQR(){

const data=document.getElementById("qrInput").value
const style=document.getElementById("qrStyle").value

const color1=document.getElementById("color1").value
const color2=document.getElementById("color2").value

const logo=document.getElementById("logoUpload").files[0]

document.getElementById("qrCanvas").innerHTML=""

qrCode=new QRCodeStyling({

width:250,
height:250,
data:data,

dotsOptions:{
type:style,
gradient:{
type:"linear",
colorStops:[
{offset:0,color:color1},
{offset:1,color:color2}
]
}
},

image:logo?URL.createObjectURL(logo):"",

imageOptions:{margin:5}

})

qrCode.append(document.getElementById("qrCanvas"))

}



function downloadQR(){

qrCode.download({name:"snapqr",extension:"png"})

}



function showTemplateFields(){

let type=document.getElementById("templateType").value
let fields=document.getElementById("templateFields")

fields.innerHTML=""

if(type==="wifi"){

fields.innerHTML=`

<input id="ssid" placeholder="WiFi Name">
<input id="password" placeholder="Password">

`

}

if(type==="whatsapp"){

fields.innerHTML=`

<input id="phone" placeholder="Phone number">

`

}

if(type==="youtube"){

fields.innerHTML=`

<input id="yt" placeholder="YouTube Video URL">

`

}

if(type==="maps"){

fields.innerHTML=`

<input id="location" placeholder="Google Maps link">

`

}

if(type==="upi"){

fields.innerHTML=`

<input id="upiid" placeholder="UPI ID">
<input id="amount" placeholder="Amount">

`

}

}



function generateTemplateQR(){

let type=document.getElementById("templateType").value
let data=""

if(type==="wifi"){

let ssid=document.getElementById("ssid").value
let pass=document.getElementById("password").value

data=`WIFI:T:WPA;S:${ssid};P:${pass};;`

}

if(type==="whatsapp"){

let phone=document.getElementById("phone").value

data=`https://wa.me/${phone}`

}

if(type==="youtube"){

data=document.getElementById("yt").value

}

if(type==="maps"){

data=document.getElementById("location").value

}

if(type==="upi"){

let upi=document.getElementById("upiid").value
let amount=document.getElementById("amount").value

data=`upi://pay?pa=${upi}&am=${amount}`

}

document.getElementById("templateQR").innerHTML=""

let qr=new QRCodeStyling({

width:250,
height:250,
data:data

})

qr.append(document.getElementById("templateQR"))

}

// =============================
// PDF TOOLS
// =============================

async function mergePDF(){

    const files=document.getElementById("pdfFiles").files
    
    if(files.length < 2){
    
    alert("Select at least 2 PDFs to merge")
    return
    
    }
    
    const mergedPdf = await PDFLib.PDFDocument.create()
    
    for(let file of files){
    
    const bytes = await file.arrayBuffer()
    
    const pdf = await PDFLib.PDFDocument.load(bytes)
    
    const pages = await mergedPdf.copyPages(pdf,pdf.getPageIndices())
    
    pages.forEach(page => mergedPdf.addPage(page))
    
    }
    
    const mergedBytes = await mergedPdf.save()
    
    downloadFile(mergedBytes,"merged.pdf")
    
    }
    
    
    
    async function splitPDF(){
    
    const file=document.getElementById("pdfFiles").files[0]
    
    if(!file){
    
    alert("Upload a PDF first")
    return
    
    }
    
    const bytes = await file.arrayBuffer()
    
    const pdf = await PDFLib.PDFDocument.load(bytes)
    
    const totalPages = pdf.getPageCount()
    
    for(let i=0;i<totalPages;i++){
    
    const newPdf = await PDFLib.PDFDocument.create()
    
    const [page] = await newPdf.copyPages(pdf,[i])
    
    newPdf.addPage(page)
    
    const pdfBytes = await newPdf.save()
    
    downloadFile(pdfBytes,"page-"+(i+1)+".pdf")
    
    }
    
    }
    
    
    
    async function compressPDF(){

        const file=document.getElementById("pdfFiles").files[0]
        const targetMB=parseFloat(document.getElementById("targetSize").value)
        
        if(!file){
        alert("Upload a PDF")
        return
        }
        
        if(!targetMB){
        alert("Enter target size in MB")
        return
        }
        
        const originalMB=file.size/(1024*1024)
        
        if(targetMB >= originalMB){
        alert("Target must be smaller than original size")
        return
        }
        
        const compressionRatio = targetMB/originalMB
        
        const bytes=await file.arrayBuffer()
        
        const pdf=await PDFLib.PDFDocument.load(bytes)
        
        const newPdf=await PDFLib.PDFDocument.create()
        
        const pages=await newPdf.copyPages(pdf,pdf.getPageIndices())
        
        pages.forEach(p=>newPdf.addPage(p))
        
        const compressedBytes=await newPdf.save({
        
        useObjectStreams:true,
        objectsPerTick:compressionRatio*100
        
        })
        
        downloadFile(compressedBytes,"compressed.pdf")
        
        }
    
    
    
    function downloadFile(bytes,name){
    
    const blob = new Blob([bytes],{type:"application/pdf"})
    
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement("a")
    
    a.href = url
    a.download = name
    
    document.body.appendChild(a)
    
    a.click()
    
    document.body.removeChild(a)
    
    }

    document.getElementById("pdfFiles").addEventListener("change",function(){

        const file=this.files[0]
        
        if(file){
        
        const size=(file.size/(1024*1024)).toFixed(2)
        
        document.getElementById("fileSize").innerText="Original Size: "+size+" MB"
        
        }
        
        })