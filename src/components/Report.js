import React from 'react';
import Axios from '../Controller/Axios';
import { CSVLink } from 'react-csv';

const headers = [
	{ label: 'Product Name', key: 'name' },
	{ label: 'Price', key: 'price' },
	{ label: 'Opening STK CBB', key: 'open_stk_cbb' },
	{ label: 'Opening STK PCS', key: 'open_stk_pcs' },
	{ label: 'Purchase CBB', key: 'pur_cbb' },
	{ label: 'Purchase PCS', key: 'pur_pcs' },
	{ label: 'Sales CBB', key: 'sale_cbb' },
	{ label: 'Sales PCS', key: 'sale_pcs' },
	{ label: 'Closing STK CBB', key: 'close_stk_cbb' },
	{ label: 'Closing STK PCS', key: 'close_stk_pcs' },
];
export default function Report() {
	const [products, setProducts] = React.useState([]);
	const [searchText, setSearchText] = React.useState('');
	const mounted = React.useRef(true);
	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	React.useEffect(() => {
		async function fetchSearchProducts() {
			try {
				const { data } = await Axios.get('/report');
				if (mounted.current) setProducts(data);
			} catch (e) {
				alert('Error fetching products.');
			}
		}
		fetchSearchProducts();
	}, []);

	function formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [day, month, year].join('-');
	}

	return (
		<>
			<div className='w-full h-full flex flex-col items-center px-3'>
				<span className='font-bold text-2xl text-black/70 my-3'>Report</span>
				<div className='w-full lg:w-3/4 py-4 px-2 lg:px-4 rounded-xl bg-white'>
					<div className='flex justify-between mb-2'>
						<span
							className={`py-1 px-5 bg-primary rounded-md text-white font-medium cursor-pointer opacity-80 hover:opacity-100`}
						>
							<CSVLink
								filename={`Report-${formatDate(new Date())}`}
								data={resolve(products)}
								headers={headers}
							>
								Export
							</CSVLink>
						</span>
						<input
							className=' w-1/4 border-[1px] rounded-md outline-none bg-zinc-50 py-1 px-3'
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							type={'text'}
							tabIndex={1}
							placeholder={'Search'}
						/>
					</div>
					<div className='w-full flex border-[1px]'>
						<span className='w-4/12 text-left md:px-2 font-medium '>Product Name</span>
						<span className='w-1/12 text-left md:px-2 font-medium border-l-[1px]'>Price</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>
							Opening Stock (CBB - PCS)
						</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>Purchase</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>Sales</span>
						<span className='w-2/12 text-center md:px-2 font-medium border-l-[1px]'>
							Closing Stock (CBB - PCS)
						</span>
						<span className='w-[5px]'></span>
					</div>
					<div
						className='overflow-x-hidden overflow-y-scroll border-[1px]'
						style={{ maxHeight: 'calc(100vh - 220px)' }}
					>
						{products.map((product, index) => (
							<Product key={index} detail={product} searchText={searchText} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}

function Product({ detail, searchText }) {
	if (searchText && !detail.name.toLowerCase().startsWith(searchText.toLowerCase())) return <></>;
	return (
		<div className='w-full flex border-b-[1px] border-l-[1px] border-r-[1px] outline-none'>
			<span className='w-4/12 text-left px-2  outline-none '>{detail.name}</span>
			<span className='w-1/12 text-left px-2  border-l-[1px] outline-none'>{detail.price}</span>
			<span className='w-2/12 text-left px-2 flex-center border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>
					{Math.floor((detail.closingbalance - detail.purchase + detail.sales) / detail.qty)}
				</span>
				<span>-</span>
				<span className='w-1/2 text-center'>
					{Math.floor((detail.closingbalance - detail.purchase + detail.sales) % detail.qty)}
				</span>
			</span>
			<span className='w-2/12 text-left px-2 flex-center border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>{Math.floor(detail.purchase / detail.qty)}</span>
				<span>-</span>
				<span className='w-1/2 text-center'>{Math.floor(detail.purchase % detail.qty)}</span>
			</span>
			<span className='w-2/12 text-left px-2 flex-center border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>{Math.floor(detail.sales / detail.qty)}</span>
				<span>-</span>
				<span className='w-1/2 text-center'>{Math.floor(detail.sales % detail.qty)}</span>
			</span>
			<span className='w-2/12 flex-center px-2  border-l-[1px] outline-none'>
				<span className='w-1/2 text-center'>{Math.floor(detail.closingbalance / detail.qty)}</span>
				<span>-</span>
				<span className='w-1/2 text-center'>{Math.floor(detail.closingbalance % detail.qty)}</span>
			</span>
		</div>
	);
}

const resolve = (products) => {
	return products.map((product) => {
		return {
			name: product.name,
			price: product.price,
			open_stk_cbb: Math.floor(
				(product.closingbalance - product.purchase + product.sales) / product.qty
			),
			open_stk_pcs: Math.floor(
				(product.closingbalance - product.purchase + product.sales) % product.qty
			),
			pur_cbb: Math.floor(Math.floor(product.purchase / product.qty)),
			pur_pcs: Math.floor(Math.floor(product.purchase % product.qty)),
			sale_cbb: Math.floor(Math.floor(product.sales / product.qty)),
			sale_pcs: Math.floor(Math.floor(product.sales % product.qty)),
			close_stk_cbb: Math.floor(Math.floor(product.closingbalance % product.qty)),
			close_stk_pcs: Math.floor(Math.floor(product.closingbalance % product.qty)),
		};
	});
};
