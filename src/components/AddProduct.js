import React from 'react';
import $ from 'jquery';
import Axios from '../Controller/Axios';

const DIALOG = {
	CLOSE: 0,
	OPEN: 1,
};
export default function AddProduct() {
	const [dialog, openDialog] = React.useState(DIALOG.CLOSE);
	const [details, setDetails] = React.useState({
		name: '',
		price: '0',
		qty: '0',
	});
	const [products, setProducts] = React.useState([]);

	React.useEffect(() => {
		async function fetchSearchProducts() {
			try {
				const { data } = await Axios.get('/products');
				setProducts(data);
			} catch (e) {
				alert('Error fetching products.');
			}
		}
		fetchSearchProducts();
	}, []);

	const changeHandler = (e) => {
		setDetails((prev) => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await Axios.post('/add-product', details);
			setProducts((prev) => [...prev, details]);
			setDetails({
				name: '',
				price: '0',
				qty: '0',
			});
			alert('Product Added');
		} catch (e) {
			alert('Error saving products.');
		}
	};

	return (
		<>
			<form
				className='w-full h-full flex flex-col items-center px-2'
				onSubmit={handleSubmit}
				method='post'
			>
				<span className='font-bold text-2xl text-black/70 mt-12 mb-5'>Add Product</span>
				<div className='w-full md:w-1/2 p-4 rounded-xl bg-white'>
					<div className='flex justify-end select-none'>
						<span
							className={`py-1 px-3 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							onClick={(e) => openDialog(DIALOG.OPEN)}
						>
							Search
						</span>
					</div>
					<Input
						name='name'
						type='text'
						placeholder='Product Name'
						value={details.name}
						tabIndex={1}
						onChange={changeHandler}
					/>
					<Input
						name='price'
						placeholder='Price (₹)'
						value={details.price}
						type='number'
						tabIndex={2}
						onChange={changeHandler}
					/>
					<Input
						name='qty'
						placeholder='Quantity per CBB'
						value={details.qty}
						type='number'
						tabIndex={3}
						onChange={changeHandler}
					/>
					<div className='flex justify-center mt-4'>
						<input
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							type='submit'
							value='Save'
						/>
					</div>
				</div>
			</form>
			{dialog === DIALOG.OPEN && (
				<SearchDialog
					setResult={(data) => {
						setDetails(data);
					}}
					openDialog={openDialog}
					products={products}
				/>
			)}
		</>
	);
}

function Input(props) {
	return (
		<div className='w-full my-2 flex items-center justify-between'>
			<span className='w-1/4 font-medium '>{props.placeholder}</span>
			<input
				className=' w-3/4 border-[1px] rounded-md outline-none bg-zinc-50 py-1 px-3'
				value={props.value}
				onChange={props.onChange}
				name={props.name}
				type={props.type}
				tabIndex={props.tabIndex}
			/>
		</div>
	);
}

function SearchDialog({ setResult, openDialog, products }) {
	const [searchText, setSearchText] = React.useState('');
	const [results, setResults] = React.useState([]);

	React.useEffect(() => {
		$('.dialog-wrapper').toggleClass('opacity-0');
	}, []);

	React.useEffect(() => {
		$('.dialog-wrapper').on('click', function (e) {
			if ($(e.target).closest('.dialog').length === 0) {
				openDialog(DIALOG.CLOSE);
			}
		});
	}, [openDialog]);

	React.useEffect(() => {
		const search = products.filter(
			(product) => !searchText || product.name.toLowerCase().startsWith(searchText.toLowerCase())
		);
		setResults(search);
	}, [searchText, products]);

	return (
		<div className='dialog-wrapper w-screen h-screen z-20 fixed left-0 top-0 flex-center bg-black/50 opacity-0 transition-all'>
			<div className='dialog w-[500px] p-4 h-fit flex-center flex-col rounded-[12px] bg-white overflow-hidden max-70vh'>
				<Input
					placeholder='Product Name'
					value={searchText}
					type='text'
					onChange={(e) => setSearchText(e.target.value)}
				/>
				<div className='w-full h-[250px] border-[1px] overflow-hidden'>
					<div className='w-full flex border-b-[1px]'>
						<span className='w-3/4 text-left px-2 font-medium '>Product Name</span>
						<span className='w-1/4 text-right px-2 font-medium border-l-[1px]'>Price</span>
						<span className='w-[5px]'></span>
					</div>
					<div className='overflow-x-hidden overflow-y-scroll h-full'>
						{results.map((result, index) => (
							<SearchResult key={index} detail={result} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
	function SearchResult({ detail }) {
		return (
			<div
				className='w-full flex border-b-[1px] px-2 cursor-pointer'
				onClick={(e) => {
					setResult(detail);
					openDialog(DIALOG.CLOSE);
				}}
			>
				<span className='w-3/4 text-left  '>{detail.name}</span>
				<span className='w-1/4 text-right border-l-[1px]'>{detail.price}</span>
			</div>
		);
	}
}
