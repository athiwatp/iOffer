class SearchPanel extends React.Component {

	constructor() {
		super()
		this.result = [ ]
	}

	render() {
		let items = [ ]
		for (let r of this.result) {
			let link = '/detail/' + r._id
			items.push(
				(
				<tr>
					<td>
						<a href={link}>
							<img style={{height:40}}
								src={r.photos[0]} />
						</a>
					</td>
					<td><a href={link}>{r.name}</a></td>
					<td><a href={link}>{r.description}</a></td>
				</tr>
				)
			)
		}

		let table = ''
		if (this.result.length > 0) {
			table = (
				<table className='table'>
					<thead>
						<tr>
							<th>Photo</th>
							<th>Name</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{items}
					</tbody>
				</table>
			)
		}

		return (
			<div>
			<form onSubmit={this.search.bind(this)}>
				<div className='input-group'>
					<input id='query' autoFocus
 						className='form-control'
						onChange={this.typing.bind(this)}/>
					<div className='input-group-btn'>
						<button type='submit'
							className='btn btn-primary'
						>Search</button>
					</div>
				</div>
			</form>
			{table}
			</div>
		)
	}

	typing(e) {
		if (e.target.value.length >= 3) {
			$.get('/search-result/' + e.target.value)
			.success(data => {
				this.result = data
				this.setState({})
			})
		}
	}

	search(e) {
		e.preventDefault()
		let query = e.target.query.value
		$.get('/search-result/' + query)
		.success(data => {
			this.result = data
			this.setState({})
		})
	}

}

ReactDOM.render(<SearchPanel />,
	document.getElementById('search-panel'))
