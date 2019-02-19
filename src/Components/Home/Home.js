import React, {Component} from 'react';
import {isLoggedIn} from '../../authService';
import {hexDump} from '../../service';

import {
	Button,
	message,
	Upload,
	Icon
} from 'antd';

const Dragger = Upload.Dragger;

/*

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
*/

class Home extends Component {

	constructor (){
		super();
		this.state = {
			file: {},
			hexDataFile: '',
		};
	}

	handleDropFile = (event) => {

		console.log('dropping file...')

    event.preventDefault();
		event.stopPropagation();

		let dropZone = document.getElementById('drop-zone');
		dropZone.setAttribute('class', 'ant-upload ant-upload-drag')

    var files = event.dataTransfer.files; // FileList object.
		console.log('Files ',files);
		
		this.handleChangeFile(files[0]);

	}

	handleDragOver = (event) => {

		event.preventDefault();
		event.stopPropagation();

		let dropZone = document.getElementById('drop-zone');
		console.log('DragOver')
		dropZone.setAttribute('class', 'ant-upload ant-upload-drag ant-upload-drag-hover')
	}

	handleDragOverExit = (event) => {

		event.preventDefault();
		event.stopPropagation();

		console.log('Leaving...')

		let dropZone = document.getElementById('drop-zone');
		dropZone.setAttribute('class', 'ant-upload ant-upload-drag')
	}

	handleChangeFile = (file) => {
		//let fileName = file.name;
		this.setState({file})
		//console.log('File', file)
		//console.log('File Change')
		let fileData = new FileReader();

		//console.log('File Data', fileData)
		//fileData.onloadend = console.log('Loaded!');
		fileData.readAsArrayBuffer(file);
		fileData.onloadend = () => {
			let hexDataFile = hexDump(fileData.result)
			this.setState({hexDataFile})
			console.log('Hex Dump loadEnd', hexDataFile)
		}
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
	
	componentDidMount(){
		var dropZone = document.getElementById('drop-zone');
		console.log('Drop Zone', dropZone)
		dropZone.addEventListener('dragover', this.handleDragOver, false);
		dropZone.addEventListener('dragleave', this.handleDragOverExit);
		dropZone.addEventListener('drop', this.handleDropFile, false);
		
	}
	

	render(){

		const {
			file,
			hexDataFile
		} = this.state;

		return (
			<div>
				<h1>Sanitizer</h1>
				{/*
				<div className='container'>
					<Dragger {...props}>
						<p className="ant-upload-drag-icon">
							<Icon type='inbox' />
						</p>
						<p className="ant-upload-text">Click or drag file to this area</p>
						<p className="ant-upload-hint">Support for a single or bulk upload.</p>				
					</Dragger>
				</div>
				*/}
				<div className='container'>
					<span >
						<div id='drop-zone'className='ant-upload ant-upload-drag'>
							<span className='ant-upload ant-upload-btn' role='button'>
								<label htmlFor='input-file' className='input-file' role='button'>
									<input
										id='input-file'
										type='file'
										className='hide'
										onChange={ (e) => 
											this.handleChangeFile(e.target.files[0])} />
									<p className='ant-upload-drag-icon'>
										<Icon type='inbox' />
									</p>
									<p className="ant-upload-text">Click or drag file to this area</p>
									<p className="ant-upload-hint">Support for a single upload.</p>
								</label>
							</span>
						</div>
					</span>
				</div>
				<div className='container'>
					{file.name !== undefined ? <p><strong>{file.name}</strong>{` - ${file.type} - ${file.size} bytes`}</p> : null}
				</div>
				<div className='container result'>
					<p>{hexDataFile}</p>
				</div>
				{file.name !== undefined ? <Button type='primary'>Export to Excel</Button> : null}
			</div>
		)
	}
}

export default Home;