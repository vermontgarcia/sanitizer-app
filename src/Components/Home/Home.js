import React, {Component} from 'react';
import {isLoggedIn} from '../../authService';
import {
	hexDump,
	proccessFile
} from '../../service';
import {
	Button,
	message,
	Upload,
	Icon,
	Skeleton,
	Table,
} from 'antd';

const Dragger = Upload.Dragger;

class Home extends Component {

	constructor (){
		super();
		this.state = {
			file: {},
			hexDataFile: '',
			data: [],
			table: {
        bordered: false,
        pagination: true,
        size: 'small',
        title: undefined,
        showHeader: true,
        scroll: undefined,
        hasData: true,
      }
		};
	}

	handleDropFile = (event) => {
    event.preventDefault();
		event.stopPropagation();
		let dropZone = document.getElementById('drop-zone');
		dropZone.setAttribute('class', 'ant-upload ant-upload-drag')
    var files = event.dataTransfer.files;
		this.handleLoadFile(files[0]);
	}

	handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
		let dropZone = document.getElementById('drop-zone');
		dropZone.setAttribute('class', 'ant-upload ant-upload-drag ant-upload-drag-hover')
	}

	handleDragOverExit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		let dropZone = document.getElementById('drop-zone');
		dropZone.setAttribute('class', 'ant-upload ant-upload-drag')
	}

	handleLoadFile = (file) => {
		this.setState({file})
		let fileData = new FileReader();
		fileData.readAsArrayBuffer(file);
		fileData.onloadend = () => {
			let hexDataFile = hexDump(fileData.result)
			this.setState({hexDataFile})
			console.log('Hex Dump loadEnd', hexDataFile)
			let data = proccessFile(hexDataFile);
			this.setState({data});
		}
	}

	componentWillMount(){
    const token = localStorage.getItem('token');
		token ? isLoggedIn(this.props.history) : this.props.history.push('/login');
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

	componentDidUpdate(){
    const token = localStorage.getItem('token');
		token ? isLoggedIn(this.props.history) : this.props.history.push('/login');
	}
	

	render(){

		const columns = [{
			title: 'Message',
			dataIndex: 'message',
			align: 'center',
			className: 'itemResult'
		},{
      title: 'HexStream',
			dataIndex: 'hexStream',
			align: 'center',
			render: (text, record) => (
				<span>
					<p className='hexResult'>{record.hexStream}</p>
				</span>
			),
    },{
			title: 'Source',
			dataIndex: 'source',
			align: 'center',
			className: 'hide',
		},{
			title: 'Destination',
			dataIndex: 'destination',
			align: 'center',
			className: 'hide',
		}];

		const {
			file,
			hexDataFile,
			data,

		} = this.state;

		return (
			<div>
				<h1>Sanitizer</h1>
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
											this.handleLoadFile(e.target.files[0])} />
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
					{data[0] !== undefined ? <Table {...this.state.table} columns={columns} dataSource={this.state.data} onChange={this.onChange} /> : null}
				</div>
			</div>
		)
	}
}

export default Home;