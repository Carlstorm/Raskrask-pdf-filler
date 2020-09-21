const {
  PDFDocument
} = require('pdf-lib');
const atob = require('atob');

let sundomain = "https://pcnavn.dk/pdfsss/"


const getfieldNames = async (z, bundle) => {
  return await z.request({
    url: ""+sundomain+"PdfForms.json"
  }).then(response => {
    return response.json[0].FormNames;
  })
}

const stshfiles = async (z, bundle, content) => {
  const contentda = Buffer.from(content, 'utf8');
  return (z.stashFile(contentda, contentda.length, bundle.inputData.filnavn + '.pdf', 'application/pdf').then(function (result) {
    return result;
  }, function (err) {
    throw error;
  }))
};

const base64ToArrayBufferform = async (z, bundle, base64String) => {
  var binary_string = atob(base64String);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const gettheForm = async (z, bundle) => {
  let pdfs = ""

  if (bundle.inputData.chosenPdf == null) {
    pdfs = await getfieldNames(z, bundle).then(async function (realt) {
      return realt[0];
    })
  } else {
    pdfs = bundle.inputData.chosenPdf
  }


  urlTemplate = ""+sundomain+"" + pdfs + ""
  const response = await z.request({
      url: urlTemplate,
      raw: true,
    })
    .then(
      res => res.arrayBuffer()
    )
  return await PDFDocument.load(response);
}

const perform = async (z, bundle) => {
  return await gettheForm(z, bundle).then(async function (pdfFile) {
    let form = pdfFile.getForm();
    for (let i = 0; i < form.getFields().length; i++) {
      form.getTextField(form.getFields()[i].getName()).setText(bundle.inputData[form.getFields()[i].getName()])
    }

    const base64String = await pdfFile.saveAsBase64()
    const backtoarraybuffer = await base64ToArrayBufferform(z, bundle, base64String);

    return LinkObject = await stshfiles(z, bundle, backtoarraybuffer).then(function (output) {
      return {
        pdf: output
      };
    })
  })
}

module.exports = {
  key: 'RaskRask_pdf_filler',
  noun: 'RaskRask pdf filler',

  display: {
    label: 'RaskRask pdf filler',
    description: 'RaskRask pdf filler.',
  },

  operation: {
    inputFields: [
      async function (z, bundle) {
          return await getfieldNames(z, bundle).then(async function (fields) {
            let a = new Object();
            a.key = 'chosenPdf'
            a.required = true
            a.altersDynamicFields = true
            a.choices = fields
            return a
          })
        },

        {
          key: 'filnavn',
          required: true,
        },

        async function (z, bundle) {
          return await gettheForm(z, bundle).then(async function (pdfFile) {
            let fomrF = pdfFile.getForm();
            let fieldobject = []
            for (let i = 0; i < fomrF.getFields().length; i++) {
              let a = new Object();
              a.key = fomrF.getFields()[i].getName();
              a.required = false
              fieldobject.push(a)
            }
            return fieldobject
          })
        },
    ],
    perform,
  },
};
