import React from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import Axios from '../Controller/Axios';

const DIALOG = {
	CLOSE: 0,
	OPEN: 1,
};
export default function PurchaseHistory() {
	const navigate = useNavigate();
	const mounted = React.useRef(true);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const [dialog, openDialog] = React.useState(DIALOG.CLOSE);
	const [purchase, setPurchase] = React.useState({});
	const [purchases, setPurchases] = React.useState([]);

	React.useEffect(() => {
		async function fetchSearchProducts() {
			try {
				const { data } = await Axios.get('/purchase');

				if (!mounted.current) return;
				setPurchases(data);
			} catch (e) {
				alert('Error fetching products.');
			}
		}
		fetchSearchProducts();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const password = prompt('Master Code');
		try {
			await Axios.put('/purchase', { purchase, password });
			alert('Purchase Updated');
			navigate('/us_inventory/purchase');
		} catch (e) {
			if (e.response?.status === 404) {
				return alert(e.response.data);
			}
			if (e.response?.status === 400) {
				return alert(e.response.data);
			}
			return alert('Error saving products.');
		}
	};

	const update = (product, stock) => {
		if (!mounted.current) return;
		setPurchase((prev) => {
			const products = prev.products?.map((p) => {
				if (product._id.toString() === p._id.toString()) {
					p.updatedQuantity = stock;
				}
				return p;
			});
			prev.products = products;
			return prev;
		});
	};

	return (
		<>
			<form
				className='w-full h-full flex flex-col items-center px-2'
				onSubmit={handleSubmit}
				method='post'
			>
				<span className='font-bold text-2xl text-black/70 mt-12 mb-5'>Purchase History</span>
				<div className='w-full lg:w-3/4 p-4 rounded-xl bg-white'>
					{!purchase?._id && (
						<div className='flex justify-end select-none'>
							<span
								className={`py-1 px-3 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
								onClick={(e) => openDialog(DIALOG.OPEN)}
							>
								Search
							</span>
						</div>
					)}
					<div className='w-full flex border-[1px] mt-2'>
						<span className='w-6/12 text-left px-2 font-medium '>Product Name</span>
						<span className='w-2/12 text-left px-2 font-medium border-l-[1px]'>Price</span>
						<span className='w-2/12 text-right px-2 font-medium border-l-[1px]'>CBB</span>
						<span className='w-2/12 text-right px-2 font-medium border-l-[1px]'>PCS</span>
						<span className='w-[5px]'></span>
					</div>
					<div
						className='overflow-x-hidden overflow-y-scroll border-[1px]'
						style={{ maxHeight: 'calc(100vh - 220px)' }}
					>
						{purchase?.products?.map((product, index) => (
							<Product
								key={index}
								detail={product.product}
								quantity={product.updatedQuantity || product.quantity}
								update={(stock) => {
									update(product, stock);
								}}
							/>
						))}
					</div>
					<div className='flex justify-between mt-4'>
						<span
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
							onClick={(e) => setPurchase({})}
						>
							Reset
						</span>
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
						setPurchase(data);
					}}
					openDialog={openDialog}
					purchases={purchases}
				/>
			)}
		</>
	);
}

function Product({ detail, update, quantity }) {
	const [cbb, setCBB] = React.useState(Math.floor(quantity / detail.qty));
	const [pcs, setPCS] = React.useState(Math.floor(quantity % detail.qty));
	return (
		<div className='w-full flex border-b-[1px] border-l-[1px] border-r-[1px] outline-none'>
			<span className='w-6/12 text-left px-2  outline-none '>{detail.name}</span>
			<span className='w-2/12 text-left px-2  border-l-[1px] outline-none'>{detail.price}</span>
			<input
				type='number'
				className='w-2/12 text-right px-2  border-l-[1px] outline-none'
				value={cbb}
				min={0}
				onChange={(e) => {
					setCBB(Math.max(0, e.target.value));
				}}
				onBlur={(e) => {
					update(cbb * detail.qty + pcs);
				}}
			/>
			<input
				type='number'
				className='w-2/12 text-right px-2  border-l-[1px] outline-none'
				value={pcs}
				min={0}
				onChange={(e) => {
					setPCS(Math.max(0, e.target.value));
				}}
				onBlur={(e) => {
					const _pcs = pcs;
					const _cbb = cbb;
					let rem = Math.floor(_pcs / detail.qty);
					if (rem > 0) {
						setCBB((prev) => prev + rem);
						setPCS((prev) => prev % detail.qty);
					}
					update(_cbb * detail.qty + _pcs);
				}}
			/>
		</div>
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

function SearchDialog({ setResult, openDialog, purchases }) {
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
		const search = purchases.filter(
			(product) => !searchText || product.billno?.toLowerCase().startsWith(searchText.toLowerCase())
		);
		setResults(search);
	}, [searchText, purchases]);

	return (
		<div className='dialog-wrapper w-screen h-screen z-20 fixed left-0 top-0 flex-center bg-black/50 opacity-0 transition-all'>
			<div className='dialog w-[500px] p-4 h-fit flex-center flex-col rounded-[12px] bg-white overflow-hidden max-70vh'>
				<Input
					placeholder='Bill No.'
					value={searchText}
					type='text'
					onChange={(e) => setSearchText(e.target.value)}
				/>
				<div className='w-full h-[250px] border-[1px] overflow-hidden'>
					<div className='w-full flex border-b-[1px]'>
						<span className='w-full text-left px-2 font-medium '>Bill No.</span>
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
				<span className='w-full text-left  '>{detail.billno}</span>
			</div>
		);
	}
}
