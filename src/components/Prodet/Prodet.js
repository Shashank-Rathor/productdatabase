import React, { Component } from 'react';
import classes from './Prodet.module.css';
import Createprod from '../Createprod/Createprod.js';
import instance from '../firebase/instance.js';
import {projectStorage} from '../../fire';



class Prodet extends Component {

  state = {
    name: '',
    description: '',
    category: '',
    prodId: '',
    url: [],
    image: null,
    prods: [],
    isDuplicate: false,
    open: false,
    prevList:[],
    isLoading: false
  };

  componentDidMount() {
    instance.get("/products.json").then((response) => {
      const fetchedResults = [];

        for (let key in response.data) {
          fetchedResults.push({
            ...response.data[key],
            id: key,
          });
        }

        this.setState({
          prods: fetchedResults,
        });

    })
  }

  handleChange = (e) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
    let bool = this.state.prods.find(item => item.prodId === this.state.prodId)
    bool ? this.setState({isDuplicate: true}) : this.setState({isDuplicate: false})
  };

  handleChangeCat = (e) => {
    this.setState({category: e.target.value})
    console.log(e.target.value)
    let bool = this.state.prods.find(item => item.prodId === this.state.prodId)
    bool ? this.setState({isDuplicate: true}) : this.setState({isDuplicate: false})
  };

  handleChangeUp = (e) => {
    const file = Array.from(e.target.files);
   this.setState({ image: file });
   this.state.prevList = [];
   for(let i=0;i<file.length;i++){

        this.state.prevList[i] = URL.createObjectURL(e.target.files[i])

   }
  }

  handleUpload = (e) => {
    e.preventDefault();
    const uploadTask = projectStorage.ref();
    this.state.image.forEach((file) => {
      alert(`${file.name} uploaded`);
      this.setState({isLoading: true});
      uploadTask
      .child(`images/${this.state.prodId}/${file.name}`)
      .put(file).then((snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if(progress === 100 ) {this.setState({isLoading: false})}
        snapshot.ref.getDownloadURL().then(url => this.state.url.push({url}) )
  })
})
  }

  handlePost = (e) => {
    e.preventDefault();

     const Data = {
     name: this.state.name,
     description: this.state.description,
     category: this.state.category,
     prodId: this.state.prodId,
     url: this.state.url
   };

   instance.post("/products.json", Data).then((response) => {
     const prods = [
          ...this.state.prods,
          { ...Data, id: response.data.prodId },
        ];

        this.setState({
          prods: prods,
          name: "",
          prodId: "",
          description: "",
          category: "",
          url: [],
          open: true,
          prevList: []
        });
   })
   .catch((error) => {
     alert(error);
   })
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({open: false})
  };

  render(){
    const {name,description,category,prodId,url,isDuplicate,open,prods,catList} = this.state;

    return (
      <div className={classes.container}>
          <Createprod
          name={name}
          prodId={prodId}
          description={description}
          category={category}
          url={url}
          prods={prods}
          open={open}
          prevList={this.state.prevList}
          isDuplicate={isDuplicate}
          isLoading={this.state.isLoading}
          handleClose={this.handleClose}
          handleChange={this.handleChange}
          handleChangeCat={this.handleChangeCat}
          handleChangeUp={this.handleChangeUp}
          handlePost={this.handlePost}
          handleUpload={this.handleUpload}/>
      </div>
    );
  }
}

export default Prodet;
