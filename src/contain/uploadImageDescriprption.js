import axios from 'axios';
// Custom Upload Adapter
export class uploadImageDescriprption {
    constructor(loader) {
      this.loader = loader
    }
    async upload() {
      return this.loader.file.then((file) => {
        const data = new FormData()
        data.append("image", file)
        const genericError = `Couldn't upload file : ${file.name}.`
        return axios({
          data,
          method: "POST",
          url: "/uploads/uploadImageProductDescription",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.loader.uploadTotal = progressEvent.total
            this.loader.uploaded = progressEvent.loaded
            const uploadPercentage = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            )
          },
        })
          .then((response) => ({ default: "/Upload/ImageDescription/"+response.data.msg.filename }))
          .catch(err=>console.log(err));
      })
    }
  
    abort() {
      return Promise.reject()
    }
  }
  export default function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new uploadImageDescriprption( loader );
    };
}
