import React, {Component} from 'react';
import {isLoggedIn} from '../../authService';

import {
	Button,
	message,
	Upload,
	Icon
} from 'antd';

const Dragger = Upload.Dragger;

const props = {
	name: 'file',
	showUploadList: false,
	customRequest: handleFileReader,
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file read successfull.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file read failed.`);
    }
  }, 
};


function handleFileReader(event){
		console.log('Reading file....')
		message.success('Reading file...')
		//e.stopPropagation();
		//e.preventDefault();
		
		console.log('Event ===>', event)

    var files = event.dataTransfer.files; // FileList object.
    console.log('Files ',files);

	}

class Home extends Component {

	handleFile = (e) => {
		const content = 'hello'//fileReader.result;
		console.log('file content', content)
	}

	handleChangeFile = (file) => {
		//console.log('File', file)
		//console.log('File Change')
		let fileData = new FileReader();

		//console.log('File Data', fileData)
		//fileData.onloadend = console.log('Loaded!');
		fileData.readAsArrayBuffer(file);
		fileData.onload = (function(){
			return function (){
				console.log('Result 2', fileData.result)
			}
		})(file)
		//console.log('Result 1', fileData.result)
	}

	componentWillMount(){

		/*
    const token = localStorage.getItem('token');
		token ? isLoggedIn(this.props.history) : this.props.history.push('/login');
		*/

		if (window.File && window.FileReader && window.FileList && window.Blob) {
			console.log('All File APIs supported')
		} else {
			message.error('The File APIs are not fully supported in this browser.');
		}


	}
	
	

	render(){
		return (
			<div>
				<h1>Sanitizer</h1>
				<div className='container'>
					<Dragger {...props}>
						<p className="ant-upload-drag-icon">
							<Icon type='inbox' />
						</p>
						<p className="ant-upload-text">Click or drag file to this area</p>
						<p className="ant-upload-hint">Support for a single or bulk upload.</p>				
					</Dragger>
				</div>
				<div className='container'>
					<input type='file' onChange={ (e) => 
						this.handleChangeFile(e.target.files[0])} />
				</div>
				<Button type='primary'>Export to Excel</Button>
			</div>
		)
	}
}

export default Home;